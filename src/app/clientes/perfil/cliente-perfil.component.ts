import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
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
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MultifactorConfirmationModalComponent } from 'src/app/shared/layout/modals/multifactor-confirmation-modal/multifactor-confirmation-modal.component';
import { Ga4Service, EventGa4Types} from 'src/app/shared/services/ga4/ga4.service';
import { LegitimuzService } from 'src/app/shared/services/legitimuz.service';
import { LegitimuzFacialService } from 'src/app/shared/services/legitimuz-facial.service';
import { FaceMatchService } from 'src/app/shared/services/face-match.service';
import { Subject } from 'rxjs';
import { Cliente } from 'src/app/shared/models/clientes/cliente';
import { DocCheckService } from 'src/app/shared/services/doc-check.service';

declare global {
    interface Window {
      ex_partner: any;
      exDocCheck: any;
      exDocCheckAction: any;
    }
  }

@Component({
    selector: 'app-cliente-perfil',
    templateUrl: './cliente-perfil.component.html',
    styleUrls: ['./cliente-perfil.component.css']
})
export class ClientePerfilComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;
    @ViewChildren('legitimuzLiveness') private legitimuzLiveness: QueryList<ElementRef>;
    @ViewChildren('docCheck') private docCheck: QueryList<ElementRef>;

    public estados: Array<Estado>;
    public cidades: Array<Cidade>;
    private estadoSelecionado: number;
    public cidadeSelecionada: number;
    public showLoading = true;
    public mostrarSenha = false;
    public googleLogin = false;
    public isMandatoryPhoneValidation = false;
    public userPhoneValidated = false;
    unsub$ = new Subject();

    private tokenMultifator: string;
    private codigoMultifator: string;

    faceMatchEnabled = false;
    faceMatchProfileEdit = false;
    faceMatchProfileEditValidated = false;
    legitimuzToken = "";
    verifiedIdentity = false;
    disapprovedIdentity = false;
    cliente : Cliente;
    docCheckToken = "";
    secretHash = "";
    faceMatchType = null;
    dataUserCPF = "";

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
        private ga4Service: Ga4Service,
        private legitimuzService: LegitimuzService,
        private legitimuzFacialService : LegitimuzFacialService,
        private faceMatchService : FaceMatchService,
        private cd: ChangeDetectorRef,
        private docCheckService: DocCheckService
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
        this.faceMatchType = this.paramsLocais.getOpcoes().faceMatchType;
        this.cd.detectChanges();
        const user = this.auth.getUser();
        this.googleLogin = user?.google_login ?? false;

        this.sidebarService.changeItens({contexto: 'cliente'});

        this.createForm();
        this.utilsService.getEstados().subscribe(estados => this.estados = estados);
        this.loadCliente();

        this.menuFooterService.setIsPagina(true);

        this.isMandatoryPhoneValidation = this.paramsLocais.isMandatoryPhoneValidation();
        switch(this.faceMatchType) {
            case 'legitimuz':
                this.legitimuzToken = this.paramsLocais.getOpcoes().legitimuz_token;
                this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.legitimuzToken && this.paramsLocais.getOpcoes().faceMatchProfileEdit);
                break;
            case 'docCheck':
                this.docCheckToken = this.paramsLocais.getOpcoes().dockCheck_token;
                this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.docCheckToken && this.paramsLocais.getOpcoes().faceMatchProfileEdit);
                this.docCheckService.iframeMessage$.subscribe(message => {
                    if (message.StatusPostMessage.Status == 'APROVACAO_AUTOMATICA' || message.StatusPostMessage.Status == 'APROVACAO_MANUAL') {
                        this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, last_change_password: true }).subscribe()
                        this.faceMatchProfileEditValidated = true;
                        this.faceMatchProfileEdit = true;
                    }
                })
                break;
            default:
                break;
        }
        if (!this.faceMatchEnabled) {
            this.faceMatchProfileEditValidated = true;
        }

        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            this.legitimuzService.curCustomerIsVerified
                .pipe(takeUntil(this.unsub$))
                .subscribe(curCustomerIsVerified => {
                    this.verifiedIdentity = curCustomerIsVerified;
                    this.cd.detectChanges();
                    if (this.verifiedIdentity) {
                        this.legitimuzService.closeModal();
                        this.messageService.success(this.translate.instant('face_match.verified_identity'));
                        this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, profile_edit: true }).subscribe()
                        this.faceMatchProfileEditValidated = true;
                        this.faceMatchProfileEdit = true;
                    } else if (!this.verifiedIdentity && this.verifiedIdentity !== null) {
                        this.legitimuzService.closeModal();
                        this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                        this.faceMatchProfileEditValidated = false;
                    }
                });

            this.legitimuzFacialService.faceIndex
                .pipe(takeUntil(this.unsub$))
                .subscribe(faceIndex => {
                    if (faceIndex) {
                        this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, profile_edit: true }).subscribe({
                            next: (res) => {
                                this.legitimuzFacialService.closeModal();
                                this.messageService.success(this.translate.instant('face_match.verified_identity'));
                                this.faceMatchProfileEditValidated = true;
                                this.faceMatchProfileEdit = true;
                            }, error: (error) => {
                                this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                                this.faceMatchProfileEditValidated = false;
                            }
                        })
                    }
                })
        }
    }

    async loadCliente() {
        try {
            this.showLoading = true;
            const user = JSON.parse(localStorage.getItem('user'));
            const cliente = await this.clienteService
                .getCliente(user.id)
                .toPromise();

            this.userPhoneValidated = cliente.is_phone_validated;
            this.cliente = cliente;
            this.dataUserCPF = String(this.cliente.cpf).replace(/[.\-]/g, '');

            if (this.faceMatchEnabled) {
                if (this.faceMatchType == 'docCheck') {
                    this.secretHash = this.docCheckService.hmacHash(this.dataUserCPF, this.paramsLocais.getOpcoes().dockCheck_secret_hash);
                    this.docCheckService.init();
                }
            }

            this.form.patchValue({
                nome: cliente.nome.toUpperCase(),
                sobrenome: cliente.sobrenome.toUpperCase(),
                nascimento: moment(cliente.dataNascimento.date).format('DD/MM/YYYY'),
                cpf: cliente.cpf,
                telefone: cliente.telefone,
                email: cliente.email
            });

            this.verifiedIdentity = cliente.verifiedIdentity;
            this.disapprovedIdentity = typeof this.verifiedIdentity === 'boolean' && !this.verifiedIdentity;
            this.cd.detectChanges();

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
        this.unsub$.next();
        this.unsub$.complete();
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
                    } else {
                        this.handleError(this.translate.instant('geral.enderecoNaoEncontrado'));
                    }

                    this.ga4Service.triggerGa4Event(EventGa4Types.ADD_SHIPPING_INFO);
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
                () => {this.messageService.success(this.translate.instant('geral.alteracoesSucesso')); this.faceMatchProfileEdit = false},
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

    ngAfterViewInit() {
        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            if (this.faceMatchType == 'legitimuz') {
                this.legitimuz.changes
                .subscribe(() => {
                    this.legitimuzService.init();
                    this.legitimuzService.mount();
                });
                this.legitimuzLiveness.changes
                .subscribe(() => {
                    this.legitimuzFacialService.init();
                    this.legitimuzFacialService.mount();
                });
            } else {
                this.docCheck.changes
                .subscribe(() => {
                    this.docCheckService.init();
                });
            }
        }
    }
}
