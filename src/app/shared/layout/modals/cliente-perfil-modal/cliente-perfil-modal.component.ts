import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService, MessageService, ParametrosLocaisService, UtilsService } from 'src/app/services';
import { Cidade } from 'src/app/shared/models/endereco/cidade';
import { Estado } from 'src/app/shared/models/endereco/estado';
import { BaseFormComponent } from '../../base-form/base-form.component';
import * as moment from 'moment';
import { Endereco } from 'src/app/shared/models/endereco/endereco';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MultifactorConfirmationModalComponent } from '../multifactor-confirmation-modal/multifactor-confirmation-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-cliente-perfil-modal',
    templateUrl: './cliente-perfil-modal.component.html',
    styleUrls: ['./cliente-perfil-modal.component.css']
})
export class ClientePerfilModalComponent extends BaseFormComponent implements OnInit {
    public estados: Array<Estado>;
    public cidades: Array<Cidade>;
    private estadoSelecionado: number;
    public cidadeSelecionada: number;
    private showLoading = true;
    public mostrarSenha = false;

    private tokenMultifator: string;
    private codigoMultifator: string;

    constructor(
        private fb: UntypedFormBuilder,
        private clienteService: ClienteService,
        private utilsService: UtilsService,
        private messageService: MessageService,
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private translate: TranslateService,
        private paramsLocais: ParametrosLocaisService,
    ) {
        super();
    }

    get twoFactorInProfileChangeEnabled(): boolean {
        return Boolean(this.paramsLocais.getOpcoes()?.enable_two_factor_in_profile_change);
    }

    ngOnInit() {
        this.createForm();
        this.utilsService.getEstados().subscribe(estados => this.estados = estados);
        this.loadCliente();
    }

    createForm() {
        this.form = this.fb.group({
            nome: [''],
            sobrenome: [''],
            nascimento: [''],
            cpf: [''],
            telefone: [''],
            email: [''],
            logradouro: ['', Validators.required],
            numero: ['', Validators.required],
            bairro: ['', Validators.required],
            cidade: ['', Validators.required],
            estado: ['', Validators.required],
            cep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
            senha_atual: [null, Validators.required]
        });

        this.form.controls['cep']
            .valueChanges
            .pipe(
                debounceTime(600),
                distinctUntilChanged()
            )
            .subscribe((cep) => this.buscarPorCep(cep))
        
        this.form.markAllAsTouched();
    }

    onSubmit() {
        if (this.form.valid) {
            if(this.twoFactorInProfileChangeEnabled) {
                this.validacaoMultifator();
            } else {
                this.submit();
            }
        } else {
            this.checkFormValidations(this.form);
        }
    }

    submit() {
        if(this.form.invalid) return;

        let values = this.form.value;

        if(this.twoFactorInProfileChangeEnabled) {
            values = {
                ...values,
                token: this.tokenMultifator,
                codigo: this.codigoMultifator
            }
        }
        this.clienteService
            .atualizarDadosCadastrais(values)
            .subscribe(
                () => this.messageService.success(this.translate.instant('geral.alteracoesSucesso')),
                error => this.handleError(error)
            );
    }

    private validacaoMultifator() {
        const modalref = this.modalService.open(
             MultifactorConfirmationModalComponent, {
                 ariaLabelledBy: 'modal-basic-title',
                 windowClass: 'modal-550 modal-h-350',
                 centered: true,
                 backdrop: 'static'
             }
         );
 
        modalref.componentInstance.senha = this.form.get('senha_atual').value;
        modalref.result.then(
             (result) => {
                 this.tokenMultifator = result.token;
                 this.codigoMultifator = result.codigo;
 
                 if (result.checked) {
                     this.submit();
                 }
             }
         );
     }

    async loadCliente() {
        try {
            this.showLoading = true;
            const user = JSON.parse(localStorage.getItem('user'));
            const cliente = await this.clienteService
                .getCliente(user.id)
                .toPromise();

            this.form.patchValue({
                nome: cliente.nome.toUpperCase(),
                sobrenome: cliente.sobrenome.toUpperCase(),
                nascimento: moment(cliente.dataNascimento.date).format('DD/MM/YYYY'),
                cpf: cliente.cpf,
                telefone: cliente.telefone,
                email: cliente.email
            });

            if (Boolean(cliente.endereco)) {
                const endereco: Endereco = cliente.endereco;
                if (Boolean(endereco.estado) && Boolean(endereco.cidade)) {
                    this.estadoSelecionado = endereco.estado.id;
                    this.cidadeSelecionada = endereco.cidade.id;
                    this.utilsService.getCidades(endereco.estado.id)
                    .subscribe(
                        cidades => this.cidades = cidades,
                        error => this.handleError(error)
                    );

                    this.form.patchValue({
                        logradouro: endereco.logradouro,
                        numero: endereco.numero,
                        bairro: endereco.bairro,
                        cep: endereco.cep
                    });
                    this.form.get('estado').patchValue(this.estadoSelecionado);
                    this.form.get('cidade').patchValue(this.cidadeSelecionada);
                }
            }

        } catch (error) {
            this.handleError('Algo inesperado aconteceu. Tente novamente mais tarde.')
        } finally {
            this.showLoading = false;
        }
    }

    getCidades(event: any) {
        let estadoId = event.target.value;

        if (estadoId > 0) {
            this.utilsService
                .getCidades(event.target.value)
                .subscribe(
                    cidades => this.cidades = cidades,
                    error => this.handleError(error)
                );
        }
    }

    buscarPorCep(cep: string) {
        if (cep.length == 8) {
            this.utilsService.getEnderecoPorCep(cep).subscribe((endereco: any) => {
                if (!endereco.erro) {
                    let estadoLocal: Estado;
                    for (let estado of this.estados) {
                        if (estado.uf == endereco.uf) {
                            estadoLocal = estado;
                        }
                    }

                    this.estadoSelecionado = estadoLocal.id;
                    this.form.get('estado').patchValue(this.estadoSelecionado);

                    this.utilsService.getCidades(estadoLocal.id).subscribe(
                        cidades => {
                            for (let cidade of cidades) {
                                if (cidade.nome == endereco.localidade.toUpperCase()) {
                                    this.cidadeSelecionada = cidade.id;
                                    this.form.get('cidade').patchValue(this.cidadeSelecionada);
                                }
                            }
                        },
                        error => this.handleError(error));
                    this.form.patchValue({
                        logradouro: endereco.logradouro,
                        bairro: endereco.bairro,
                    });
                } else {
                    this.handleError('Endereço não encontrado, por favor preencha manualmente');
                }
            });
        }
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
