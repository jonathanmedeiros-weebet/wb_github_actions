import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, FormGroup, Validators, ValidatorFn} from '@angular/forms';

import { Subject } from 'rxjs';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AuthService, ApostaService, MessageService, ParametrosLocaisService, ClienteService } from './../../../../services';
import {BaseFormComponent} from '../../base-form/base-form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Usuario} from '../../../models/usuario';
import { FormValidations, PasswordValidation } from 'src/app/shared/utils';

import * as moment from 'moment';
import { Pagina } from 'src/app/models';
import {config} from '../../../config';
import {TranslateService} from '@ngx-translate/core';
import {ValidarEmailModalComponent} from '../validar-email-modal/validar-email-modal.component';
import {NgHcaptchaService} from 'ng-hcaptcha';
import { RecaptchaErrorParameters } from "ng-recaptcha";
import { SocialAuthService } from '@abacritt/angularx-social-login';

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
    termosDeUso: Pagina;
    debouncer: any;
    submitting = false;
    afiliadoHabilitado;
    isCliente;
    isLoggedIn;
    mostrarSenha;
    mostrarConfirmarSenha;
    LOGO = config.LOGO;
    modalTermosRef;
    hCaptchaLanguage;
    provedorCaptcha;
    validacaoEmailObrigatoria;

    user: any;
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

        this.translate.onLangChange.subscribe(res => {
            this.hCaptchaLanguage = res.lang;
            this.cd.detectChanges();
        });

        this.clientesService.getTermosDeUso().subscribe(
            (termos: Pagina) => {
                this.termosDeUso = termos ? termos : new Pagina();
            },
            error => this.handleError(error)
        );

        this.afiliadoHabilitado = this.paramsService.getOpcoes().afiliado;
        this.provedorCaptcha = this.paramsService.getOpcoes().provedor_captcha;

        this.route.queryParams
            .subscribe((params) => {
            if (params.afiliado) {
                sessionStorage.setItem('afiliado', params.afiliado);
            }
             this.form.get('afiliado').patchValue(sessionStorage.getItem('afiliado'));
        });

        this.socialAuth.authState.subscribe((user) => {
            console.log('Social LOG: ', user);

            if(user) {
                this.formSocial = true;
                this.form.patchValue({
                    nome: user.firstName,
                    sobrenome: user.lastName,
                    email: user.email,
                    googleId: user.id,
                    googleIdToken: user.idToken,
                })
            }

            this.user = user;
        });
    }

    createForm() {
        this.form = this.fb.group({
            nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
            sobrenome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
            usuario: [null],
            nascimento: [null],
            senha: [null],
            senha_confirmacao: [null],
            cpf: [null, [Validators.required, FormValidations.cpfValidator]],
            telefone: [null, [Validators.required]],
            email: [null, [Validators.required]],
            afiliado: [null, [Validators.maxLength(50)]],
            aceitar_termos: [null, [Validators.required]],
            captcha: [null, [Validators.required]],
            check_1: [''],
            check_2: [''],
            googleId:[''],
            googleIdToken:['']
        });
    }

    validarLoginUnico(control: AbstractControl) {
        clearTimeout(this.debouncer);
        return new Promise(resolve => {
            this.debouncer = setTimeout(() => {
                this.clientesService.verificarLogin(control.value).subscribe((res) => {
                    if (res) {
                        resolve(null);
                    }
                }, () => {
                    resolve({'loginEmUso': true});
                });
            }, 1000);
        });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    submit() {
        const values = this.form.value;
        values.nascimento = moment(values.nascimento, 'DDMMYYYY', true).format('YYYY-MM-DD');
        this.submitting = true;
        this.clientesService.cadastrarCliente(values)
            .subscribe(
                (res) => {
                    sessionStorage.setItem('user', JSON.stringify(res.result.user));
                    this.activeModal.dismiss();
                    if(this.validacaoEmailObrigatoria){
                    this.messageService.success(this.translate.instant('geral.cadastroSucedido'));
                        this.modalService.open(ValidarEmailModalComponent, {
                            ariaLabelledBy: 'modal-basic-title',
                            windowClass: 'modal-pop-up',
                            centered: true,
                            backdrop: 'static'
                        });
                    }else{
                        this.modalService.open(this.ativacaoCadastroModal,{
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

    abrirModalTermosUso(modal: any) {
        if (this.termosDeUso) {
            this.modalTermosRef = this.modalService.open(modal);
        }
    }

    fecharModalTermos() {
        if (this.modalTermosRef) {
            this.modalTermosRef.dismiss();
        }
    }

    clearSocialForm() {
        this.formSocial = false;
        this.form.patchValue({
            googleId: '',
            googleIdToken: '',
        })
    }
}
