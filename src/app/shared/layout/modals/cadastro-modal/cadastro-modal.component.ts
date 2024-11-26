import { DocCheckService } from './../../../services/doc-check.service';
import { FaceMatchService } from './../../../services/face-match.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, OnChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApostaService, AuthService, ClienteService, FinanceiroService, MessageService, ParametrosLocaisService } from './../../../../services';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { FormValidations } from 'src/app/shared/utils';

import * as moment from 'moment';
import { config } from '../../../config';
import { TranslateService } from '@ngx-translate/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { takeUntil } from 'rxjs/operators';
import { CampanhaAfiliadoService } from 'src/app/shared/services/campanha-afiliado.service';
import { Ga4Service, EventGa4Types} from 'src/app/shared/services/ga4/ga4.service';
import { LegitimuzService } from 'src/app/shared/services/legitimuz.service';

declare global {
    interface Window {
      ex_partner: any;
      exDocCheck: any;
      exDocCheckAction: any;
    }
  }

@Component({
    selector: 'app-cadastro-modal',
    templateUrl: './cadastro-modal.component.html',
    styleUrls: ['./cadastro-modal.component.css'],
})
export class CadastroModalComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('ativacaoCadastroModal', {static: true}) ativacaoCadastroModal;
    @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;
    
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
    isLoterj;
    user: any;
    loginGoogleAtivo = false;
    formSocial = false;
    aplicarCssTermo = false;
    parameters = {};
    parametersList;
    errorMessage = '';
    postbacks = {};
    registerCancel = false;
    modalClose = true;
    promocoes: any;
    promocaoAtiva = false;
    valorPromocao: number | null = null;
    bonusModalidade: string | null = null;

    verifiedIdentity = false;
    faceMatchEnabled = false;
    faceMatchRegister = false;
    faceMatchRegisterValidated = false;
    faceMatchType = null;
    legitimuzToken = "";
    currentLanguage = 'pt';
    disapprovedIdentity = false;
    dataUserCPF ='';
    docCheckToken = '';
    secretHash = '';
    showLoading = true;
    faceMatchRequested = false;
    isStrengthPassword: boolean | null;
    validPassword: boolean = false;
    requirements = {
        minimumCharacters: false,
        uppercaseLetter: false,
        lowercaseLetter: false,
        specialChar: false,
    };

    constructor(
        public activeModal: NgbActiveModal,
        private clientesService: ClienteService,
        private fb: UntypedFormBuilder,
        private apostaService: ApostaService,
        private campanhaService: CampanhaAfiliadoService,
        private messageService: MessageService,
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private paramsService: ParametrosLocaisService,
        private modalService: NgbModal,
        private translate: TranslateService,
        private cd: ChangeDetectorRef,
        private socialAuth: SocialAuthService,
        private financeiroService: FinanceiroService,
        private ga4Service: Ga4Service,
        private legitimuzService: LegitimuzService,
        private docCheck: DocCheckService,
    ) {
        super();
    }

    ngOnInit() {
        this.faceMatchType = this.paramsService.getOpcoes().faceMatchType;
        this.currentLanguage = this.translate.currentLang;
        switch(this.faceMatchType) {
            case 'legitimuz':
                this.legitimuzToken = this.paramsService.getOpcoes().legitimuz_token;
                this.faceMatchEnabled = Boolean(this.paramsService.getOpcoes().faceMatch && this.legitimuzToken && this.paramsService.getOpcoes().faceMatchRegister);
                break;
            case 'docCheck':
                this.docCheckToken = this.paramsService.getOpcoes().dockCheck_token;
                this.faceMatchEnabled = Boolean(this.paramsService.getOpcoes().faceMatch && this.docCheckToken && this.paramsService.getOpcoes().faceMatchRegister);
                this.docCheck.iframeMessage$.subscribe(message => {
                    console.log(message)
                })
                break;
            default:
                break;            
        }  

        if (!this.faceMatchEnabled) {
            this.faceMatchRegisterValidated = true;
        }

        this.translate.onLangChange.subscribe(change => {
            this.currentLanguage = change.lang;
            if (this.faceMatchEnabled) {
                this.legitimuzService.changeLang(change.lang);
            }
        });   

        this.parametersList = this.paramsService.getOpcoes().enabledParameters;
        this.getPromocoes();
        this.appMobile = this.auth.isAppMobile();
        this.isMobile = window.innerWidth <= 1024;
        this.validacaoEmailObrigatoria = this.paramsService.getOpcoes().validacao_email_obrigatoria;
        this.isLoterj = this.paramsService.getOpcoes().casaLoterj;
        this.isStrengthPassword = this.paramsService.getOpcoes().isStrengthPassword;

        if (this.isLoterj) {
            this.aplicarCssTermo = true;
        }

        this.createForm();
        this.form.valueChanges.subscribe(form => {
            if ((form.cpf != null && form.cpf.length == 14)) {
                this.showLoading = false;
                this.cd.detectChanges();
            } else {
                this.showLoading = true;
            }
        })

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

            if (params.ref || params.afiliado) {
                const codigoAfiliado = params.ref ?? params.afiliado;

                this.clientesService.codigoFiliacaoCadastroTemp = codigoAfiliado;
                localStorage.setItem('codigoAfiliado', codigoAfiliado);
            } else {
                const storagedCodigoAfiliado = localStorage.getItem('codigoAfiliado');
                if (storagedCodigoAfiliado) {
                    this.clientesService.codigoFiliacaoCadastroTemp = storagedCodigoAfiliado;
                }
            }

            if (params.btag) {
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

            if (params.c) {
                this.campanhaService.computarAcesso({campRef: params.c, fonte: params.s}).subscribe();

                localStorage.setItem('campRef', params.c);
                localStorage.setItem('campFonte', params.s);
            } else {
                const campRef = localStorage.getItem('campRef');
                const campFonte = localStorage.getItem('campFonte');

                if (campRef) {
                    this.form.patchValue({campRef: campRef, campFonte: campFonte});
                }
            }

            if (this.clientesService.codigoFiliacaoCadastroTemp) {
                this.form.get('afiliado').patchValue(this.clientesService.codigoFiliacaoCadastroTemp);
                this.possuiCodigoAfiliado = true;
            }

            this.parametersList.forEach(param => {
                if (params[param]) {
                    this.parameters[param] = params[param];
                }
            });
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
                                confirmarEmail: user.email,
                                googleId: user.id,
                                googleIdToken: user.idToken,
                            });

                            this.clearValidators();
                        }

                        this.user = user;
                    }
                );
        }
        if (this.faceMatchEnabled && !this.disapprovedIdentity && this.faceMatchType == 'legitimuz') {
            this.legitimuzService.curCustomerIsVerified
                .pipe(takeUntil(this.unsub$))
                .subscribe(curCustomerIsVerified => {
                    this.verifiedIdentity = curCustomerIsVerified;
                    this.cd.detectChanges();
                    if (this.verifiedIdentity) {
                        this.faceMatchRequested = true;
                        this.showLoading = false
                        this.legitimuzService.closeModal();
                        this.messageService.success(this.translate.instant('face_match.verified_identity'));
                    }
                });
        }
        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            this.form.get('cpf')?.valueChanges.subscribe(cpf => {
                this.dataUserCPF = cpf;
                switch (this.faceMatchType) {
                    case 'legitimuz':
                        this.legitimuzService.init();
                        this.legitimuzService.mount();
                        break;
                    case 'docCheck':
                        this.secretHash = this.docCheck.hmacHash(this.dataUserCPF, this.paramsService.getOpcoes().dockCheck_secret_hash);
                        this.docCheck.init();
                        break;
                    default:
                        break;
                }
            })
        }
    }

    getPromocoes(queryParams?: any) {
        this.financeiroService.getPromocoes(queryParams)
            .subscribe(
                response => {
                    this.promocoes = response;
                    this.verificarPromocaoAtiva();
                },
                error => {
                    this.handleError(error);
                }
            );
    }

    verificarPromocaoAtiva(): void {
        if (this.promocoes && this.promocoes.length > 0) {
            const promocaoCassino = this.promocoes.find(promocao =>
                promocao.ativo &&
                promocao.tipo === 'primeiro_deposito_bonus' &&
                promocao.valorBonus > 0.00 &&
                promocao.bonusModalidade === 'cassino'
            );

            const promocaoEsportivo = this.promocoes.find(promocao =>
                promocao.ativo &&
                promocao.tipo === 'primeiro_deposito_bonus' &&
                promocao.valorBonus > 0.00 &&
                promocao.bonusModalidade === 'esportivo'
            );

            if (promocaoCassino) {
                this.promocaoAtiva = promocaoCassino.ativo;
                this.valorPromocao = parseFloat(promocaoCassino.valorBonus);
            } else if(promocaoEsportivo){
                this.promocaoAtiva = promocaoEsportivo.ativo;
                this.valorPromocao = parseFloat(promocaoEsportivo.valorBonus);
            }
        }
    }

    closeModal(){
        this.modalClose = false;
        this.registerCancel = true;
    }

    cancelModal() {
        this.activeModal.dismiss();
    }

    registerOpen(){
        this.registerCancel = false;
        this.modalClose = true;
    }

    createForm() {
        this.form = this.fb.group({
            nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/[a-zA-Z]/)]],
            nascimento: [null, [Validators.required, FormValidations.birthdayValidator]],
            senha: [null, [Validators.required, Validators.minLength(8)]],
            senha_confirmacao: [null, [Validators.required, Validators.minLength(8), FormValidations.equalsTo('senha')]],
            nomeCompleto: [null],
            cpf: [null, [Validators.required, FormValidations.cpfValidator]],
            telefone: [null, [Validators.required]],
            email: [null, [Validators.required, Validators.email]],
            afiliado: [null, [Validators.maxLength(50)]],
            captcha: [null, [Validators.required]],
            check_1: [''],
            check_2: [''],
            googleId: [''],
            googleIdToken: [''],
            btag: [this.route.snapshot.queryParams.btag],
            refId: [this.route.snapshot.queryParams.refId],
            campRef: [this.route.snapshot.queryParams.c],
            campFonte: [this.route.snapshot.queryParams.s],
            dadosCriptografados: [null]
        });

        if (this.isStrengthPassword) {
            this.form.controls.senha.clearValidators();
            this.form.controls.senha.addValidators(FormValidations.strongPasswordValidator())
            this.form.controls.senha.updateValueAndValidity();
        }
        
        if (this.isLoterj) {
            this.form.addControl('termosUso', this.fb.control(null, [
                Validators.requiredTrue,
            ]));

            this.form.controls['nome'].clearValidators();
            this.form.controls['nome'].updateValueAndValidity();

            this.form.controls['nascimento'].clearValidators();
            this.form.controls['nascimento'].updateValueAndValidity();

            this.form.controls['senha_confirmacao'].clearValidators();
            this.form.controls['senha_confirmacao'].updateValueAndValidity();
        }
    }


    ngOnDestroy() {
        this.clearSocialForm();
        this.unsub$.next();
        this.unsub$.complete();
    }

    clearValidators() {
        this.form.controls['senha'].patchValue('');
        this.form.controls['senha'].clearValidators();
        this.form.controls['senha'].updateValueAndValidity();
        this.form.controls['senha_confirmacao'].patchValue('');
        this.form.controls['senha_confirmacao'].clearValidators();
        this.form.controls['senha_confirmacao'].updateValueAndValidity();
    }

    restoreValidators() {
        this.form.controls['senha'].setValidators([Validators.required, Validators.minLength(6)]);
        this.form.controls['senha_confirmacao'].setValidators([Validators.required, Validators.minLength(6), FormValidations.equalsTo('senha')]);

        this.form.updateValueAndValidity();
    }

    onSubmit() {
        super.onSubmit();
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

        if (Object.keys(this.parameters).length) {
            values.parameters = this.parameters;
        }

        this.submitting = true;
       
        this.clientesService.cadastrarCliente(values)
            .subscribe(
                (res) => {
                    sessionStorage.setItem('user', JSON.stringify(res.result.user));

                    this.activeModal.dismiss();

                    localStorage.removeItem('codigoAfiliado');

                    if(this.validacaoEmailObrigatoria) {
                        localStorage.setItem('permissionWelcomePage', JSON.stringify(true));
                        this.messageService.success(this.translate.instant('geral.cadastroSucedido'));
                        let nome = values.nome.split(" ")[0];
                        this.router.navigate(
                            ['/welcome'],
                            { queryParams: { nomeCliente: nome, valid: true }
                        });
                    } else {
                        this.auth.setIsCliente(true);

                        localStorage.setItem('permissionWelcomePage', JSON.stringify(true));
                        localStorage.setItem('promocaoPrimeiroDepositoAtivo', res.dataUser.promocao_primeiro_deposito_ativa);
                        let nome = values.nome.split(" ")[0];
                        this.router.navigate(
                            ['/welcome'],
                            { queryParams: { nomeCliente: nome, valid: false }
                        });
                    }

                    if(this.errorMessage && res.success){
                        this.clearErrorMessage();
                    }
                },
                error => {
                    this.handleError(error);
                    this.form.patchValue({captcha: null});
                    this.submitting = false;
                }
            );
    }

    handleError(error: string) {
        this.errorMessage = error;
    }

    clearErrorMessage() {
        this.errorMessage = '';
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
            this.restoreValidators();
        }

        this.formSocial = false;

        this.form.patchValue({
            googleId: '',
            googleIdToken: '',
        });
    }

    validarCpf() {
        const { cpf } = this.form.value;

        if (this.autoPreenchimento) {
            if (this.form.get('cpf').valid) {
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
                        if (error?.code === 'cpfInformadoNaoExiste') {
                            this.form.controls['cpf'].addValidators(FormValidations.cpfNotExists(cpf));
                            this.form.controls['cpf'].updateValueAndValidity();
                        } else {
                            this.messageService.error(error);
                        }
                    }
                );
            } else {
                this.cpfValidado = false;
                this.menorDeIdade = false;
                this.form.patchValue({
                    nome: '',
                    dadosCriptografados: null
                });
            }
        }

    }

    onBeforeInput(e : InputEvent, inputName){
        FormValidations.blockInvalidCharacters(e, inputName);
    }

    blockPaste(event: ClipboardEvent): void {
        event.preventDefault();
    }

    checkPassword() {
        const passwordValue = this.form.controls.senha.value;
        const lengthCheck = passwordValue.length >= 8;
        const hasUpperCase = /[A-Z]/.test(passwordValue);
        const hasLowerCase = /[a-z]/.test(passwordValue);
        const hasSpecialChar = /[!@#$%^&*]/.test(passwordValue);
        
        this.requirements = {
          minimumCharacters: lengthCheck,
          uppercaseLetter: hasUpperCase,
          lowercaseLetter: hasLowerCase,
          specialChar: hasSpecialChar,
        };

        this.validPassword = Object.values(this.requirements).every(Boolean);
    }

    onBlurGa4Name(event: any): void {
        const value = event.target.value;
        if(value){
            this.ga4Service.triggerGa4Event(EventGa4Types.START_REGISTRATION);
        }
    }
}
