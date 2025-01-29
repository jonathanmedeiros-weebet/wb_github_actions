import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
      } else {
        this.stepService.changeFormValid(false);
      }
    })
      ;
  }

  createForm() {
    this.form = this.fb.group({
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      complemento: [''],
      cep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
    });
    this.form.controls['cep']
      .valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe((cep) => { this.buscarPorCep(cep); console.log(cep) });

    this.form.markAllAsTouched();
  }

  getCidades(event: any) {
    let estadoId = event.target.value;
    if (estadoId > 0) {
      this.utilsService.getCidades(event.target.value).subscribe(
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
            console.log(this.cidades)
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
