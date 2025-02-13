import { ChangeDetectorRef, Component, OnInit, ViewChild, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { Usuario } from 'src/app/models';
import { StepService } from 'src/app/shared/services/step.service';
import { config } from 'src/app/shared/config';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, ClienteService, FinanceiroService, MessageService, ParametrosLocaisService} from 'src/app/services';
import { FormBuilder, Validators } from '@angular/forms';
import { CampanhaAfiliadoService } from 'src/app/shared/services/campanha-afiliado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { EventGa4Types, Ga4Service } from 'src/app/shared/services/ga4/ga4.service';
import { BaseFormComponent } from 'src/app/shared/layout/base-form/base-form.component';
import { Location } from '@angular/common';
import { FormValidations } from 'src/app/shared/utils';
import { LoginModalComponent } from '../../../login-modal/login-modal.component';
import { RecaptchaComponent} from 'ng-recaptcha';
import { skip } from 'rxjs/operators';

@Component({
    selector: 'app-login-data',
    templateUrl: './login-data.component.html',
    styleUrls: ['./login-data.component.scss']
})
export class LoginDataComponent extends BaseFormComponent implements OnInit {
    @ViewChild('ativacaoCadastroModal', { static: true }) ativacaoCadastroModal;
    @Input() data: any;
    @ViewChild('captchaRef') captcha: RecaptchaComponent;

    currentIndex = 0;
    totalSteps = 3;
    formInvalid = true;
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
    possuiCodigoAfiliado = false;
    isLoterj;
    user: any;
    loginGoogleAtivo = false;
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
    currentLanguage = 'pt';
    showLoading = true;
    isStrengthPassword: boolean | null;
    validPassword: boolean = false;
    fullRegistration = true;
    private previousUrl: string;
    passwordRequirements: string[] = [];

    requirements = {
        minimumCharacters: false,
        uppercaseLetter: false,
        lowercaseLetter: false,
        specialChar: false,
    };

    constructor(private stepService: StepService,
        public activeModal: NgbActiveModal,
        private clientesService: ClienteService,
        private fb: FormBuilder,
        private campanhaService: CampanhaAfiliadoService,
        private messageService: MessageService,
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private paramsService: ParametrosLocaisService,
        private modalService: NgbModal,
        private translate: TranslateService,
        private cd: ChangeDetectorRef,
        private financeiroService: FinanceiroService,
        private ga4Service: Ga4Service,
        private location: Location,

    ) {
        super();
        this.stepService.currentIndex$.subscribe((index) => {
            this.currentIndex = index;
        });
        this.stepService.formValid$.subscribe((valid) => {
            this.formInvalid = !valid;
        })
        this.stepService.submitForm$.pipe(skip(1)).subscribe((submit) => {
            if (submit) {
                this.onSubmit();
            }
        });
    }

    ngOnInit(): void {
        this.createForm();
        let queryString = '';
        if (this.router.url.includes('/cadastro')) {
            const pages = {
                esporte: 'esportes',
                cassino: 'casino',
                virtual: 'vitual-sports',
                desafio: 'desafios',
                acumuladao: 'acumuladao',
                loteria: 'loterias',
                cassino_ao_vivo: 'live-casino',
                rifas: 'rifas/wall'
            }

            const queryParams = this.route.snapshot.queryParams;
            queryString = "?" + new URLSearchParams(queryParams).toString();

            const { pagina_inicial, betby } = this.paramsService.getOpcoes();

            if (betby) {
                pages.esporte = 'sports';
            }

            this.previousUrl = '/' + (pages[pagina_inicial] ?? '');
        } else {
            this.previousUrl = this.router.url;
        }

        this.location.replaceState(`/cadastro${queryString}`);
        this.currentLanguage = this.translate.currentLang;
        this.parametersList = this.paramsService.getOpcoes().enabledParameters;
        this.getPromocoes();
        this.appMobile = this.auth.isAppMobile();
        this.isMobile = window.innerWidth <= 1024;
        this.validacaoEmailObrigatoria = this.paramsService.getOpcoes().validacao_email_obrigatoria;
        this.isLoterj = this.paramsService.getOpcoes().casaLoterj;
        this.isStrengthPassword = this.paramsService.getOpcoes().isStrengthPassword;
        this.provedorCaptcha = this.paramsService.getOpcoes().provedor_captcha;
        this.fullRegistration = this.paramsService.getOpcoes().enable_full_registration;

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
            
            if (this.form.valid) {
                this.stepService.changeFormValid(true);
            } else {
                this.stepService.changeFormValid(false);
            }
        })

        this.hCaptchaLanguage = this.translate.currentLang;

        this.translate.onLangChange.subscribe(res => {
            this.hCaptchaLanguage = res.lang;
            this.cd.detectChanges();
        });

        this.afiliadoHabilitado = this.paramsService.getOpcoes().afiliado;

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
                        this.form.patchValue({ btag: storagedBtag });
                    }
                }

                if (params.refId) {
                    localStorage.setItem('refId', params.refId);
                } else {
                    const storagedRefId = localStorage.getItem('refId');
                    if (storagedRefId) {
                        this.form.patchValue({ refId: storagedRefId });
                    }
                }

                if (params.c) {
                    this.campanhaService.computarAcesso({ campRef: params.c, fonte: params.s }).subscribe();
                    localStorage.setItem('campRef', params.c);
                    localStorage.setItem('campFonte', params.s);
                } else {
                    const campRef = localStorage.getItem('campRef');
                    const campFonte = localStorage.getItem('campFonte');

                    if (campRef) {
                        this.form.patchValue({ campRef: campRef, campFonte: campFonte });
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
            } else if (promocaoEsportivo) {
                this.promocaoAtiva = promocaoEsportivo.ativo;
                this.valorPromocao = parseFloat(promocaoEsportivo.valorBonus);
            }
        }
    }

    closeModal() {
        this.modalClose = false;
        this.registerCancel = true;
    }

    cancelModal() {
        this.activeModal.dismiss();
    }

    registerOpen() {
        this.registerCancel = false;
        this.modalClose = true;
    }

    createForm() {
        this.form = this.fb.group({
            senha: [null, [Validators.required, Validators.minLength(8)]],
            senha_confirmacao: [null, [Validators.required, Validators.minLength(8), FormValidations.equalsTo('senha')]],
            email: [null, [Validators.required, Validators.email]],
            telefone: [null, [Validators.required]],
            countryCode: ['55', [Validators.required]],
            afiliado: [null, [Validators.maxLength(50)]],
            captcha: [null],
            check_1: [''],
            check_2: [''],
            googleId: [''],
            googleIdToken: [''],
            btag: [this.route.snapshot.queryParams.btag],
            refId: [this.route.snapshot.queryParams.refId],
            campRef: [this.route.snapshot.queryParams.c],
            campFonte: [this.route.snapshot.queryParams.s],
            dadosCriptografados: [null],
            nome: [null],
            nascimento: [null],
            nomeCompleto: [null],
            cpf: [null],
            genero: [''],
            nationality: ['Brasil'],
            documentNumber: [''],
            logradouro: [''],
            numero: [''],
            bairro: [''],
            cidade: [''],
            estado: [''],
            cep: [''],
            termosUso: [true]
        });

        this.form.patchValue(this.data)
        if (this.isStrengthPassword) {
            this.form.controls.senha.clearValidators();
            this.form.controls.senha.addValidators(FormValidations.strongPasswordValidator())
            this.form.controls.senha.updateValueAndValidity();
        }

        if (this.provedorCaptcha == 'recaptcha') {
            this.form.valueChanges.subscribe((value) => {
                if (this.form.valid && !this.submitting) {
                    this.captcha.execute();
                }
            });
        }
    }

    ngOnDestroy() {
        this.location.replaceState(this.previousUrl);
        this.unsub$.next();
        this.unsub$.complete();
    }

    resolved(token: string) {
        token ? true : false ;
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

    private async prepareSubmitData() {
        this.form.get('nomeCompleto').patchValue(this.form.get('nome').value);
        let values = this.form.value;
        if (Object.keys(this.parameters).length) {
            values.parameters = this.parameters;
        }

        values = {
            ...values,
            endereco: {
                logradouro: values.logradouro,
                numero: values.numero,
                bairro: values.bairro,
                cidadeId: values.cidade,
                estadoId: values.estado,
                cep: values.cep
            }
        }

        delete values.logradouro;
        delete values.numero;
        delete values.bairro;
        delete values.cidade;
        delete values.estado;
        delete values.cep;

        return values;
    }

    async submit() {
        const values = await this.prepareSubmitData();
        this.submitting = true;
        this.stepService.changeFormValid(false);
        this.clientesService
            .cadastrarCliente(values)
            .subscribe(
                (res) => {
                    sessionStorage.setItem('user', JSON.stringify(res.result.user));

                    this.activeModal.dismiss();

                    localStorage.removeItem('codigoAfiliado');

                    if (this.validacaoEmailObrigatoria) {
                        localStorage.setItem('permissionWelcomePage', JSON.stringify(true));
                        this.messageService.success(this.translate.instant('geral.cadastroSucedido'));
                        let nome = values.nome.split(" ")[0];
                        this.router.navigate(
                            ['/welcome'],
                            {
                                queryParams: { nomeCliente: nome, valid: true }
                            });
                    } else {
                        this.auth.setIsCliente(true);

                        localStorage.setItem('permissionWelcomePage', JSON.stringify(true));
                        localStorage.setItem('promocaoPrimeiroDepositoAtivo', res.dataUser.promocao_primeiro_deposito_ativa);
                        let nome = values.nome.split(" ")[0];
                        this.router.navigate(
                            ['/welcome'],
                            {
                                queryParams: { nomeCliente: nome, valid: false }
                            });
                    }

                    if (this.errorMessage && res.success) {
                        this.clearErrorMessage();
                    }
                },
                error => {
                    this.handleError(error);
                    this.form.patchValue({ captcha: null });
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

    onBeforeInput(e: InputEvent, inputName) {
        FormValidations.blockInvalidCharacters(e, inputName);
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
        if (value) {
            this.ga4Service.triggerGa4Event(EventGa4Types.START_REGISTRATION);
        }
    }

    returnRequirementsValue() {
        return Object.values(this.requirements).filter(value => value).length;
    }
}
