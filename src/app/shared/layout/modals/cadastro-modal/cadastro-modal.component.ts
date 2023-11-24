import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, Validators} from '@angular/forms';

import {Subject} from 'rxjs';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApostaService, AuthService, ClienteService, MessageService, ParametrosLocaisService} from './../../../../services';
import {BaseFormComponent} from '../../base-form/base-form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Usuario} from '../../../models/usuario';
import {FormValidations, PasswordValidation} from 'src/app/shared/utils';

import * as moment from 'moment';
import {config} from '../../../config';
import {TranslateService} from '@ngx-translate/core';
import {ValidarEmailModalComponent} from '../validar-email-modal/validar-email-modal.component';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-cadastro-modal',
    templateUrl: './cadastro-modal.component.html',
    styleUrls: ['./cadastro-modal.component.css'],
})
export class CadastroModalComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('ativacaoCadastroModal', {static: true}) ativacaoCadastroModal;
    appMobile;
    isMobile = false;
    unsub$ = new Subject();
    usuario = new Usuario();
    debouncer: any;
    submitting = false;
    afiliadoHabilitado;
    isCliente;
    isLoggedIn;
    modalRef;
    mostrarSenha;
    mostrarConfirmarSenha;
    LOGO = config.LOGO;
    modalTermosRef;
    hCaptchaLanguage;
    provedorCaptcha;
    validacaoEmailObrigatoria;
    autoPreenchimento = true;
    cpfValidado = false;
    menorDeIdade = false;
    possuiCodigoAfiliado = false;

    user: any;
    loginGoogleAtivo = false;
    formSocial = false;

    constructor(
        public activeModal: NgbActiveModal,
        private clientesService: ClienteService,
        private fb: UntypedFormBuilder,
        private apostaService: ApostaService,
        private messageService: MessageService,
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private paramsService: ParametrosLocaisService,
        private modalService: NgbModal,
        private translate: TranslateService,
        private cd: ChangeDetectorRef,
        private socialAuth: SocialAuthService,
    ) {
        super();
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.isMobile = window.innerWidth <= 1024;
        this.validacaoEmailObrigatoria = this.paramsService.getOpcoes().validacao_email_obrigatoria;

        this.createForm();

        this.hCaptchaLanguage = this.translate.currentLang;

        this.autoPreenchimento = this.paramsService.getOpcoes().validar_cpf_receita_federal;

        this.translate.onLangChange.subscribe(res => {
            this.hCaptchaLanguage = res.lang;
            this.cd.detectChanges();
        });

        this.afiliadoHabilitado = this.paramsService.getOpcoes().afiliado;
        this.provedorCaptcha = this.paramsService.getOpcoes().provedor_captcha;

        this.route.queryParams
            .subscribe((params) => {
            if (params.afiliado) {
                this.clientesService.codigoFiliacaoCadastroTemp = params.afiliado;
                localStorage.setItem('codigoAfiliado', params.afiliado);
            } else {
                const storagedCodigoAfiliado = localStorage.getItem('codigoAfiliado');
                if (storagedCodigoAfiliado) {
                    this.clientesService.codigoFiliacaoCadastroTemp = storagedCodigoAfiliado;
                }
            }

            if(params.btag) {
                localStorage.setItem('btag', params.btag);
            } else {
                const storagedBtag = localStorage.getItem('btag');
                if (storagedBtag) {
                    this.form.patchValue({btag: storagedBtag});
                }
            }

            if (params.refId) {
                localStorage.setItem('refId', params.refId);
            } else {
                const storagedRefId = localStorage.getItem('refId');
                if (storagedRefId) {
                    this.form.patchValue({refId: storagedRefId});
                }
            }

            if (this.clientesService.codigoFiliacaoCadastroTemp) {
                this.form.get('afiliado').patchValue(this.clientesService.codigoFiliacaoCadastroTemp);
                this.possuiCodigoAfiliado = true;
            }
        });

        if (this.paramsService.getOpcoes().habilitar_login_google) {
            this.loginGoogleAtivo = true;
            this.socialAuth.authState
                .pipe(takeUntil(this.unsub$))
                .subscribe((user) => {
                        if (user) {
                            this.formSocial = true;
                            this.form.patchValue({
                                nome: user.name,
                                email: user.email,
                                googleId: user.id,
                                googleIdToken: user.idToken,
                            });

                            this.form.controls['usuario'].patchValue('');
                            this.form.controls['usuario'].clearValidators();
                            this.form.controls['usuario'].updateValueAndValidity();
                        }

                        this.user = user;
                    }
                );
        }
    }

    createForm() {
        this.form = this.fb.group({
            nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            usuario: [null, [
                Validators.required,
                Validators.pattern(/^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)
            ], this.validarLoginUnico.bind(this)],
            nascimento: [null, [Validators.required, FormValidations.birthdayValidator]],
            senha: [null],
            senha_confirmacao: [null],
            nomeCompleto: [null],
            cpf: [null, [Validators.required, FormValidations.cpfValidator]],
            telefone: [null, [Validators.required]],
            email: [null, [Validators.required]],
            afiliado: [null, [Validators.maxLength(50)]],
            captcha: [null, [Validators.required]],
            check_1: [''],
            check_2: [''],
            googleId: [''],
            googleIdToken: [''],
            btag: [this.route.snapshot.queryParams.btag],
            refId: [this.route.snapshot.queryParams.refId],
            dadosCriptografados: [null]
        });
    }

    validarLoginUnico(control: AbstractControl) {
        clearTimeout(this.debouncer);
        return new Promise(resolve => {
            this.debouncer = setTimeout(() => {
                if (this.form.get('googleIdToken').value) {
                    resolve(null);
                }

                if (control.value) {
                    this.clientesService.verificarLogin(control.value).subscribe((res) => {
                        if (res) {
                            resolve(null);
                        }
                    }, () => {
                        resolve({'loginEmUso': true});
                    });
                }
            }, 1000);
        });
    }

    ngOnDestroy() {
        this.clearSocialForm();
        this.unsub$.next();
        this.unsub$.complete();
    }

    submit() {
        if (this.menorDeIdade) {
            this.messageService.error(this.translate.instant('geral.cadastroMenorDeIdade'));
            return;
        }
        const values = this.form.value;
        values.nascimento = moment(values.nascimento, 'DDMMYYYY', true).format('YYYY-MM-DD');
        if (!this.autoPreenchimento) {
            values.nomeCompleto = values.nome;
        }
        this.submitting = true;
        this.clientesService.cadastrarCliente(values)
            .subscribe(
                (res) => {
                    sessionStorage.setItem('user', JSON.stringify(res.result.user));
                    this.activeModal.dismiss();
                    localStorage.removeItem('codigoAfiliado');
                    if(this.validacaoEmailObrigatoria) {
                        this.messageService.success(this.translate.instant('geral.cadastroSucedido'));
                        this.modalService.open(ValidarEmailModalComponent, {
                            ariaLabelledBy: 'modal-basic-title',
                            windowClass: 'modal-pop-up',
                            centered: true,
                            backdrop: 'static'
                        });
                    } else {
                        this.modalService.open(this.ativacaoCadastroModal, {
                            ariaLabelledBy: 'modal-basic-title',
                            windowClass: 'modal-pop-up',
                            centered: true
                            }
                        );
                    }
                },
                error => {
                    this.messageService.error(error);
                    this.form.patchValue({captcha: null});
                    this.submitting = false;
                }
            );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    abrirLogin() {
        this.activeModal.dismiss();

        this.modalRef = this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350 modal-login',
                centered: true,
            }
        );
    }

    clearSocialForm() {
        if (this.formSocial) {
            this.socialAuth.signOut();
        }
        this.formSocial = false;

        this.form.controls['usuario'].setValidators([[
            Validators.required,
            Validators.pattern(/^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)
        ], this.validarLoginUnico.bind(this)]);
        this.form.controls['usuario'].updateValueAndValidity();

        this.form.patchValue({
            googleId: '',
            googleIdToken: '',
        });
    }

    validarCpf() {
        const { cpf } = this.form.value;

        if (this.autoPreenchimento) {
            this.clientesService.validarCpf(cpf).subscribe(
                res => {
                    if (res.validarCpfAtivado) {
                        this.autoPreenchimento = true;
                        this.cpfValidado = true;
                        this.menorDeIdade = res.menorDeIdade;
                        this.form.controls['nascimento'].clearValidators();
                        this.form.controls['nascimento'].updateValueAndValidity();
                        this.form.patchValue({
                            nome: res.nome,
                            dadosCriptografados: res.dados
                        });
                    } else {
                        if (!this.formSocial) {
                            this.form.patchValue({nome: ''});
                        }
                        this.autoPreenchimento = false;
                        this.form.controls['nascimento'].setValidators([Validators.required, FormValidations.birthdayValidator]);
                        this.form.controls['nascimento'].updateValueAndValidity();
                        this.cpfValidado = false;
                    }
                },
                error => {
                    this.cpfValidado = false;
                    this.form.patchValue({nome: ''});
                    this.messageService.error(error);
                }
            );
        }

    }
}
