import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MessageService, UtilsService } from 'src/app/services';
import { BaseFormComponent } from 'src/app/shared/layout/base-form/base-form.component';
import { Cidade } from 'src/app/shared/models/endereco/cidade';
import { Estado } from 'src/app/shared/models/endereco/estado';
import { StepService } from 'src/app/shared/services/step.service';

@Component({
  selector: 'app-address-data',
  templateUrl: './address-data.component.html',
  styleUrls: ['./address-data.component.scss']
})
export class AddressDataComponent extends BaseFormComponent implements OnInit {
  @Output() addressData = new EventEmitter<any>;
  @Input() data: any;

  formInvalid = true
  form: FormGroup;
  public estados: Array<Estado>;
  public cidades: Array<Cidade>;
  private estadoSelecionado: number;
  public cidadeSelecionada: number;

  constructor(
    private fb: FormBuilder,
    private utilsService: UtilsService,
    private messageService: MessageService,
    private translate: TranslateService,
    private stepService: StepService
  ) {
    super();
    this.cidades = [];
    this.estadoSelecionado = 0;
    this.cidadeSelecionada = 0;
  }

  ngOnInit() {
    this.createForm();
    this.utilsService.getEstados().subscribe(estados => this.estados = estados);
    this.form.valueChanges.subscribe(() => {
      if (this.form.valid) {
        this.stepService.changeFormValid(true);
        this.addressData.emit(this.form.value);
      } else {
        this.stepService.changeFormValid(false);
      }
    });
  }

  createForm() {
    const safePattern = /^[^<>"'`]+$/;
    this.form = this.fb.group({
      logradouro: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(safePattern)]],
      numero: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(safePattern)]],
      bairro: ['', [Validators.required, Validators.maxLength(60), Validators.pattern(safePattern)]],
      cidade: ['', [Validators.required, Validators.maxLength(60), Validators.pattern(safePattern)]],
      estado: ['', [Validators.required, Validators.maxLength(60), Validators.pattern(safePattern)]],
      pais: ['Brasil', [Validators.required, Validators.maxLength(60), Validators.pattern(safePattern)]],
      complemento: ['',[Validators.maxLength(60), Validators.pattern(safePattern)]],
      cep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8),Validators.pattern(safePattern)]],
    });

    this.form.controls['cep']
      .valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe((cep) => { this.buscarPorCep(cep) });

    if (this.data.logradouro) {
      this.getCidades(undefined, this.data.estado)
      this.form.patchValue(this.data);
      this.cidadeSelecionada = this.data.cidade;
      this.form.get('cidade').patchValue(this.cidadeSelecionada);
    }
  }

  getCidades(event?: any, parametro?: number) {
    let estadoId = 0;

    if (event) {
      estadoId = event.target.value;
    } else {
      estadoId = parametro;
    }

    if (estadoId > 0) {
      this.utilsService.getCidades(estadoId).subscribe(
        cidades => this.cidades = cidades,
        error => this.handleError(error)
      );
    }
  }

  buscarPorCep(cep: string) {
    if (cep.length == 8) {
      this.utilsService.getEnderecoPorCep(cep).subscribe(
        (endereco: any) => {
          if (!endereco.erro) {
            let estadoLocal: Estado;
            for (let estado of this.estados) {
              if (estado.uf == endereco.uf) {
                estadoLocal = estado;
              }
            }

            this.estadoSelecionado = estadoLocal.id;
            if (this.estadoSelecionado != this.form.get('estado').value) {
              this.utilsService.getCidades(estadoLocal.id).subscribe(
                cidades => {
                  this.cidades = cidades;
                  for (let cidade of cidades) {
                    if (cidade.nome == endereco.localidade.toUpperCase()) {
                      this.cidadeSelecionada = cidade.id;
                      this.form.get('cidade').patchValue(this.cidadeSelecionada);
                    }
                  }
                },
                error => this.handleError(error));
            } else {
              for (let cidade of this.cidades) {
                if (cidade.nome == endereco.localidade.toUpperCase()) {
                  this.cidadeSelecionada = cidade.id;
                  this.form.get('cidade').patchValue(this.cidadeSelecionada);
                }
              }
            }

            this.form.get('estado').patchValue(this.estadoSelecionado);
            if (endereco.bairro) {
              this.form.get('bairro').patchValue(endereco.bairro);
            }
            if (endereco.logradouro) {
              this.form.get('logradouro').patchValue(endereco.logradouro);
            }
            if (!endereco.numero) {
              this.form.get('numero').markAsTouched();
            }
          } else {
            this.handleError(this.translate.instant('geral.enderecoNaoEncontrado'));
          }
        },
      );
    }
  };

  handleError(mensagem: string) {
    this.messageService.error(mensagem);
  }

  async submit() {
  }
}
