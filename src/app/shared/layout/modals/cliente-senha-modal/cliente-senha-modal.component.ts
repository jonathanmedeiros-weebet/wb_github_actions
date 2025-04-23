import { DocCheckService } from './../../../services/doc-check.service';
import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, ClienteService, MessageService, ParametrosLocaisService } from 'src/app/services';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PasswordValidation } from 'src/app/shared/utils';
import { MultifactorConfirmationModalComponent } from '../multifactor-confirmation-modal/multifactor-confirmation-modal.component';
import { Cliente } from 'src/app/shared/models/clientes/cliente';
import { TranslateService } from '@ngx-translate/core';
import { LegitimuzService } from 'src/app/shared/services/legitimuz.service';
import { FaceMatchService } from 'src/app/shared/services/face-match.service';
import { LegitimuzFacialService } from 'src/app/shared/services/legitimuz-facial.service';

@Component({
    selector: 'app-cliente-senha-modal',
    templateUrl: './cliente-senha-modal.component.html',
    styleUrls: ['./cliente-senha-modal.component.css']
})
export class ClienteSenhaModalComponent extends BaseFormComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {
    @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;
    @ViewChildren('legitimuzLiveness') private legitimuzLiveness: QueryList<ElementRef>;
    @ViewChildren('docCheck') private docCheck: QueryList<ElementRef>;

    public isCollapsed: boolean = false;
    private unsub$ = new Subject();

    public mostrarSenhaAtual = false;
    public mostrarSenhaNova = false;
    public mostrarSenhaConfirmacao = false;

    private tokenMultifator: string;
    private codigoMultifator: string;

    currentLanguage = 'pt';
    cliente: Cliente;
    faceMatchEnabled = false;
    faceMatchChangePassword = false;
    faceMatchChangePasswordValidated = false;
    legitimuzToken = "";
    docCheckToken = "";
    faceMatchType = null;
    verifiedIdentity = null;
    disapprovedIdentity = false;
    showLoading = true;
    dataUserCPF = "";
    secretHash = "";

    constructor(
        private fb: UntypedFormBuilder,
        private clienteService: ClienteService,
        private messageService: MessageService,
        private auth: AuthService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private paramsLocais: ParametrosLocaisService,
        private cd: ChangeDetectorRef,
        private translate: TranslateService,
        private legitimuzService: LegitimuzService,
        private legitimuzFacialService: LegitimuzFacialService,
        private faceMatchService: FaceMatchService,
        private docCheckService: DocCheckService
    ) {
        super();
    }

    get isCliente() {
        return this.auth.isCliente();
    }

    get isMobile() {
        return window.innerWidth <= 1024;
    }

    get twoFactorInProfileChangeEnabled(): boolean {
        return Boolean(this.paramsLocais.getOpcoes()?.enable_two_factor_in_profile_change);
    }

    ngAfterContentChecked(): void {
        this.cd.detectChanges();
    }

    ngOnInit() {
        this.createForm();

        if (this.isCliente) {
            this.faceMatchType = this.paramsLocais.getOpcoes().faceMatchType;
            this.currentLanguage = this.translate.currentLang;

            switch (this.faceMatchType) {
                case 'legitimuz':
                    this.legitimuzToken = this.paramsLocais.getOpcoes().legitimuz_token;
                    this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.legitimuzToken && this.paramsLocais.getOpcoes().faceMatchChangePassword);
                    break;
                case 'docCheck':
                    this.docCheckToken = this.paramsLocais.getOpcoes().dockCheck_token;
                    this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.docCheckToken && this.paramsLocais.getOpcoes().faceMatchChangePassword);
                    this.docCheckService.iframeMessage$.subscribe(message => {
                        if (message.StatusPostMessage.Status == 'APROVACAO_AUTOMATICA' || message.StatusPostMessage.Status == 'APROVACAO_MANUAL') {
                            this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, last_change_password: true }).subscribe()
                            this.faceMatchChangePasswordValidated = true;
                        }
                    })
                    break;
                default:
                    break;
            }

            if (!this.faceMatchEnabled) {
                this.faceMatchChangePasswordValidated = true;
            }
            this.translate.onLangChange.subscribe(change => {
                this.currentLanguage = change.lang;
                if (this.faceMatchEnabled) {
                    this.legitimuzService.changeLang(change.lang);
                }
            });

            const user = JSON.parse(localStorage.getItem('user'));

            this.clienteService.getCliente(user.id)
                .subscribe(
                    res => {
                        this.cliente = res;
                        this.dataUserCPF = String(this.cliente.cpf).replace(/[.\-]/g, '');
                        if (this.faceMatchType == 'docCheck') {
                            this.secretHash = this.docCheckService.hmacHash(this.dataUserCPF, this.paramsLocais.getOpcoes().dockCheck_secret_hash);
                            this.docCheckService.init();
                        }
                        this.verifiedIdentity = res.verifiedIdentity;
                        this.disapprovedIdentity = typeof this.verifiedIdentity === 'boolean' && !this.verifiedIdentity;
                        this.showLoading = false;
                        this.cd.detectChanges();
                    },
                    error => {
                        this.handleError(error);
                    }

                );

            if (this.faceMatchEnabled && !this.disapprovedIdentity && this.faceMatchType == 'legitimuz') {
                this.legitimuzService.curCustomerIsVerified
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(curCustomerIsVerified => {
                        if(curCustomerIsVerified == null) return;
                        
                        this.verifiedIdentity = curCustomerIsVerified;
                        if (this.verifiedIdentity) {
                            this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, last_change_password: true }).subscribe({
                                next: (res) => {
                                    this.legitimuzFacialService.closeModal();
                                    this.messageService.success(this.translate.instant('face_match.verified_identity'));
                                    this.faceMatchChangePasswordValidated = true;
                                    this.cd.detectChanges();
                                }, error: (error) => {
                                    this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                                    this.faceMatchChangePasswordValidated = false;
                                }
                            })
                        }
                    });

                this.legitimuzFacialService.faceIndex
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(faceIndex => {
                        if (faceIndex) {
                            this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, last_change_password: true }).subscribe({
                                next: (res) => {
                                    this.legitimuzFacialService.closeModal();
                                    this.messageService.success(this.translate.instant('face_match.verified_identity'));
                                    this.faceMatchChangePasswordValidated = true;
                                    this.cd.detectChanges();
                                }, error: (error) => {
                                    this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                                    this.faceMatchChangePasswordValidated = false;
                                }
                            })
                        }
                    })
            }
        } else {
            this.faceMatchChangePasswordValidated = true;
            this.showLoading = false;
        }
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

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            senha_atual: ['', Validators.required],
            senha_nova: ['', [Validators.required, Validators.minLength(3)]],
            senha_confirmacao: ['', [Validators.required, Validators.minLength(3)]]
        }, { validator: PasswordValidation.MatchPassword });
    }

    onSubmit() {
        if (this.form.valid) {
            if (this.twoFactorInProfileChangeEnabled) {
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

        if (this.twoFactorInProfileChangeEnabled) {
            values = {
                ...values,
                token: this.tokenMultifator,
                codigo: this.codigoMultifator
            }
        }

        if (this.isCliente) {
            this.clienteService.alterarSenha(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    res => {
                        this.form.reset();
                        this.activeModal.dismiss();
                        this.handleSuccess();
                    },
                    error => this.handleError(error)
                );
        } else {
            this.auth.changePassword(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    res => {
                        this.form.reset();
                        this.handleSuccess();
                    },
                    error => this.handleError(error)
                );
        }
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

    resetarForm() {
        this.form.reset();
    }

    handleSuccess() {
        this.messageService.success('Alterações realizadas com sucesso!');
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    toClose() {
        this.activeModal.dismiss('Cross click');
    }
}
