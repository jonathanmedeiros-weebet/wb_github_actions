import {Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {Estado} from '../../shared/models/endereco/estado';
import {Cidade} from '../../shared/models/endereco/cidade';
import {UtilsService} from '../../shared/services/utils/utils.service';
import {Endereco} from '../../shared/models/endereco/endereco';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import * as moment from 'moment';
import { AuthService, ParametrosLocaisService, SidebarService } from 'src/app/services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MultifactorConfirmationModalComponent } from 'src/app/shared/layout/modals/multifactor-confirmation-modal/multifactor-confirmation-modal.component';

@Component({
    selector: 'app-cliente-perfil',
    templateUrl: './cliente-perfil.component.html',
    styleUrls: ['./cliente-perfil.component.css']
})
export class ClientePerfilComponent extends BaseFormComponent implements OnInit, OnDestroy {
    public estados: Array<Estado>;
    public cidades: Array<Cidade>;
    private estadoSelecionado: number;
    public cidadeSelecionada: number;
    public showLoading = true;
    public mostrarSenha = false;
    public googleLogin = false;

    private tokenMultifator: string;
    private codigoMultifator: string;

    constructor(
        private fb: UntypedFormBuilder,
        private clienteService: ClienteService,
        private utilsService: UtilsService,
        private messageService: MessageService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
        private auth: AuthService,
        private modalService: NgbModal,
        private translate: TranslateService,
        private paramsLocais: ParametrosLocaisService,
    ) {
        super();
        this.cidades = [];
        this.estadoSelecionado = 0;
        this.cidadeSelecionada = 0;
    }

    get twoFactorInProfileChangeEnabled(): boolean {
        return Boolean(this.paramsLocais.getOpcoes()?.enable_two_factor_in_profile_change);
    }

    ngOnInit() {
        const user = this.auth.getUser();
        this.googleLogin = user?.google_login ?? false;

        this.sidebarService.changeItens({contexto: 'cliente'});

        this.createForm();
        this.utilsService.getEstados().subscribe(estados => this.estados = estados);
        this.loadCliente();

        this.menuFooterService.setIsPagina(true);
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
            this.handleError(this.translate.instant('erroInesperado'))
        } finally {
            this.showLoading = false;
        }
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            nome: [''],
            sobrenome: [''],
            nascimento: [''],
            cpf: [''],
            telefone: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
            email: [''],
            logradouro: ['', Validators.required],
            numero: ['', Validators.required],
            bairro: ['', Validators.required],
            cidade: ['', Validators.required],
            estado: ['', Validators.required],
            cep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
            senha_atual: [null, this.googleLogin ? [] : Validators.required]
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

    resetarForm() {
        this.showLoading = true;

        this.cidades = [];
        this.estadoSelecionado = 0;
        this.cidadeSelecionada = 0;

        this.loadCliente();
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
                        this.form.get('estado').patchValue(this.estadoSelecionado);
                        this.utilsService.getCidades(estadoLocal.id).subscribe(
                            cidades => {
                                this.cidades = cidades;
                                for (let cidade of this.cidades) {
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
                        this.handleError(this.translate.instant('enderecoNaoEncontrado'));
                    }
                },
            );
        }
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

    handleError(mensagem: string) {
        this.messageService.error(mensagem);
    }
}
