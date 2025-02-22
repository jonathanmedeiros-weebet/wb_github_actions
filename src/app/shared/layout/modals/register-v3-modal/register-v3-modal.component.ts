import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, ClienteService, FinanceiroService, GeolocationService, MessageService, NavigatorPermissionsService, ParametrosLocaisService } from 'src/app/services';
import { EventGa4Types, Ga4Service } from 'src/app/shared/services/ga4/ga4.service';
import { FormValidations } from 'src/app/shared/utils';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { Subject } from 'rxjs';
import { Usuario } from 'src/app/models';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CampanhaAfiliadoService } from 'src/app/shared/services/campanha-afiliado.service';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { CountriesService } from 'src/app/shared/services/utils/countries.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-register-v3-modal',
  templateUrl: './register-v3-modal.component.html',
  styleUrls: ['./register-v3-modal.component.scss']
})
export class RegisterV3ModalComponent extends BaseFormComponent implements OnInit, OnDestroy{
    @Input() data: any;
    @ViewChild('captchaRef') captcha: RecaptchaComponent;

    cpfValidado = false;
    modalClose = true;
    registerCancel = false;
    form: FormGroup;
    formSocial = false;
    validacaoEmailObrigatoria;
    validPassword: boolean = false;
    faceMatchRequested = false;
    errorMessage = '';
    formInvalid = true;
    unsub$ = new Subject();
    debouncer: any;
    submitting = false;
    afiliadoHabilitado;
    isCliente;
    isLoggedIn;
    modalRef;
    hCaptchaLanguage;
    provedorCaptcha;
    modalTermosRef;
    loginGoogleAtivo = false;
    aplicarCssTermo = false;
    currentLanguage = 'pt';

    user: any;
    usuario = new Usuario();
    dataUserCPF = '';
    beneficiarioProgramaSocial = null;
    validarBeneficioProgramaSocial = '';
    menorDeIdade = false;
    dataNascimento: string;
    
    possuiCodigoAfiliado = false;
    isLoterj;
    
    parameters = {};
    parametersList;
    postbacks = {};
    promocoes: any;
    promocaoAtiva = false;
    valorPromocao: number | null = null;
    bonusModalidade: string | null = null;

    isStrengthPassword: boolean | null;
    lastLocationPermission = null;
    currentLocationPermission = null;

    appMobile;
    isMobile: boolean = false;
    mostrarSenha;
    autoPreenchimento = true;
    showLoading = true;
    sectionLimiteApostas = false;
    isFocused: boolean = false;
    activeEditingCPF: boolean = false;
    LabelCpf = 'CPF';
    passwordRequirements: string[] = [];
    fullRegistration = true;

    requirements = {
        minimumCharacters: false,
        uppercaseLetter: false,
        lowercaseLetter: false,
        specialChar: false,
    };

    countryCodes = this.CountriesService.getDialcodes();

    constructor(
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private ga4Service: Ga4Service,
        private paramsService: ParametrosLocaisService,
        private clientesService: ClienteService,
        private messageService: MessageService,
        private translate: TranslateService,
        private route: ActivatedRoute,
        public activeModal: NgbActiveModal,
        private auth: AuthService,
        private financeiroService: FinanceiroService,
        private location: Location,
        private navigatorPermissionsService: NavigatorPermissionsService,
        private geolocationService: GeolocationService,
        private router: Router,
        private CountriesService: CountriesService,
        private modalService: NgbModal,
    ) {
        super();
    }

    ngOnInit() {
        if (window.innerWidth <= 767) {
            this.isMobile = true;
        }

        this.createForm();
        this.getPromocoes();

        this.currentLanguage = this.translate.currentLang;
        this.parametersList = this.paramsService.getOpcoes().enabledParameters;
        this.appMobile = this.auth.isAppMobile();
        this.validacaoEmailObrigatoria = this.paramsService.getOpcoes().validacao_email_obrigatoria;
        this.isLoterj = this.paramsService.getOpcoes().casaLoterj;
        this.isStrengthPassword = this.paramsService.getOpcoes().isStrengthPassword;
        this.provedorCaptcha = this.paramsService.getOpcoes().provedor_captcha;
        this.fullRegistration = this.paramsService.getOpcoes().enable_full_registration;
        this.autoPreenchimento = this.paramsService.getOpcoes().validar_cpf_receita_federal;

        if (this.data.cpf && this.data.nome) {
            this.cpfValidado = true;
        }

        this.form.valueChanges.subscribe(form => {
            if ((form.cpf != null && form.cpf.length == 14)) {
                this.showLoading = false;
                this.cd.detectChanges();
            } else {
                this.showLoading = true;
            }
        })

        if (this.data.cpf) {
            this.form.patchValue(this.data);
        };

        if (this.isLoterj) {
            this.aplicarCssTermo = true;
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
            } else if (promocaoEsportivo) {
                this.promocaoAtiva = promocaoEsportivo.ativo;
                this.valorPromocao = parseFloat(promocaoEsportivo.valorBonus);
            }
        }
    }

    createForm() {
        this.form = this.fb.group({
            nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/[a-zA-Z]/)]],
            nascimento: [null, [Validators.required, FormValidations.birthdayValidator]],
            nomeCompleto: [null],
            cpf: [null, [Validators.required, FormValidations.cpfValidator]],
            email: [null, [Validators.required, Validators.email]],
            country: ['+55', [Validators.required]],
            telefone: [null, [Validators.required]],
            senha: [null, [Validators.required, Validators.minLength(8)]],
            // genero: ['', this.fullRegistration ? Validators.required : null],
            // nationality: ['Brasil', this.fullRegistration ? Validators.required : null],

            captcha: [null, this.provedorCaptcha ? Validators.required : null],
            check_1: [''],
            check_2: [''],
            googleId: [''],
            googleIdToken: [''],

            documentNumber: ['', this.fullRegistration ? Validators.required : null],
            afiliado: [null, [Validators.maxLength(50)]],

            btag: [this.route.snapshot.queryParams.btag],
            refId: [this.route.snapshot.queryParams.refId],
            campRef: [this.route.snapshot.queryParams.c],
            campFonte: [this.route.snapshot.queryParams.s],

            // logradouro: ['', this.fullRegistration ? Validators.required : null],
            // numero: ['', this.fullRegistration ? Validators.required : null],
            // bairro: ['', this.fullRegistration ? Validators.required : null],
            // cidade: ['', this.fullRegistration ? Validators.required : null],
            // estado: ['', this.fullRegistration ? Validators.required : null],
            // cep: ['', this.fullRegistration ? Validators.required : null],

            // dadosCriptografados: [null],
            // termosUso: [true],
        });

        if (this.isStrengthPassword) {
            this.form.controls.senha.clearValidators();
            this.form.controls.senha.addValidators(FormValidations.strongPasswordValidator())
            this.form.controls.senha.updateValueAndValidity();
        }

        // if (this.isLoterj) {
        //     this.form.addControl('termosUso', this.fb.control(null, [
        //         Validators.requiredTrue,
        //     ]));

        //     this.form.controls['nome'].clearValidators();
        //     this.form.controls['nome'].updateValueAndValidity();

        //     this.form.controls['nascimento'].clearValidators();
        //     this.form.controls['nascimento'].updateValueAndValidity();
        // }
    }

    onSubmit() {
        super.onSubmit();
    }

    private async prepareSubmitData() {
        if (this.menorDeIdade) {
            this.messageService.error(this.translate.instant('geral.cadastroMenorDeIdade'));
            return;
        }
        if (this.validarBeneficioProgramaSocial && this.beneficiarioProgramaSocial) {
            this.messageService.error(this.translate.instant('register.registrationBeneficiariesSocialPrograms'));
            return;
        }

        let values = this.form.value;

        values.nascimento = moment(values.nascimento, 'DDMMYYYY', true).format('YYYY-MM-DD');
        if (!this.autoPreenchimento) {
            values.nomeCompleto = values.nome;
        }

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
        const restrictionStateBet = this.paramsService.getRestrictionStateBet();

        if (restrictionStateBet != 'Todos') {
            let allowed = true;
            this.lastLocationPermission = this.currentLocationPermission;
            this.currentLocationPermission = await this.navigatorPermissionsService.checkLocationPermission();

            if (this.currentLocationPermission == 'granted') {
                if (this.lastLocationPermission == 'denied') {
                    allowed = false;
                    location.reload();
                } else if (!this.geolocationService.checkGeolocation()) {
                    allowed = await this.geolocationService.saveLocalStorageLocation();
                }
            } else if (this.currentLocationPermission == 'denied') {
                allowed = false;
            } else if (this.currentLocationPermission == 'prompt') {
                allowed = await this.geolocationService.saveLocalStorageLocation();
            }

            if (allowed) {
                let localeState = localStorage.getItem('locale_state');

                if (restrictionStateBet != localeState) {
                    this.messageService.error(this.translate.instant('geral.stateRestriction'));
                    return;
                }
            } else {
                this.messageService.error(this.translate.instant('geral.locationPermission'));
                return;
            }
        }

        if (this.menorDeIdade) {
            this.messageService.error(this.translate.instant('geral.cadastroMenorDeIdade'));
            return;
        }

        const values = await this.prepareSubmitData();
        this.submitting = true;

        this.clientesService
            .createRegistrationV3(values)
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

    clearErrorMessage() {
        this.errorMessage = '';
    }

    validarCpf() {
        const { cpf } = this.form.value;
        if (this.validarBeneficioProgramaSocial || this.autoPreenchimento) {
            if (this.form.get('cpf').valid) {
                this.clientesService.validarCpf(cpf).subscribe(
                    res => {
                        if (res.validarCpfAtivado) {
                            const threeMonthsAgo = new Date();
                            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                            if (res.menorDeIdade) {
                                this.messageService.error(this.translate.instant('geral.cadastroMenorDeIdade'));
                                return;
                            }
                            if (res.beneficios.DataRecebimentoMaisRecente >= threeMonthsAgo.toISOString()) {
                                this.messageService.error(this.translate.instant('register.registrationBeneficiariesSocialPrograms'));
                                return;
                            }
                            this.autoPreenchimento = true;
                            this.cpfValidado = true;
                            this.form.patchValue({
                                nome: res.nome,
                                nomeCompleto: res.nome,
                                dadosCriptografados: res.dados
                            });
                            this.autoPreenchimento = false;
                            this.LabelCpf = res.nome;

                            const dadosDescriptografados: any = jwtDecode(res.dados);
                            this.dataNascimento = this.formatarDataComAsterisco(dadosDescriptografados.nascimento);
                            this.activeEditingCPF = true
                        } else {
                            if (!this.formSocial) {
                                this.form.patchValue({ nome: '' });
                            }
                            this.autoPreenchimento = false;
                            this.cpfValidado = false;
                        }
                    },
                    error => {
                        this.cpfValidado = false;
                        this.form.patchValue({ nome: '' });
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
                this.form.patchValue({
                    nome: '',
                    dadosCriptografados: null
                });
            }
        }

        if (cpf) {
            this.clientesService.validateCpfAlreadyExists(cpf).subscribe(
                res => {
                },
                error => {
                    this.cpfValidado = false;
                    this.form.patchValue({ nome: '' });
                    if (error?.code === 'cpfInformadoJaExiste'){
                        this.form.controls['cpf'].addValidators(FormValidations.cpfAlreadyExists);
                        this.form.controls['cpf'].updateValueAndValidity();
                    }
                }
            );
        }
    }

    handleError(error: string) {
        this.errorMessage = error;
    }

    handleActiveEditingCPF(){
        this.LabelCpf = 'CPF';
        this.activeEditingCPF = !this.activeEditingCPF;
    }

    ngOnDestroy() {
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

    registerOpen() {
        this.registerCancel = false;
        this.modalClose = true;
    }

    onClose() {
        this.registerCancel = true;
        this.modalClose = false;
    }

    cancelModal() {
        this.activeModal.dismiss();
    }

    openLogin() {
        this.activeModal.dismiss();

        this.modalRef = this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-400 modal-h-350 modal-login',
                centered: true,
            }
        );
    }

    formatarDataComAsterisco (data: string) {
        const [ano, mes, dia] = data.split('-');

        return `${dia[0]}*/${mes[0]}*/${ano[0]}***`;
    }

    toggleSections(section: string) {
        if(this.sectionLimiteApostas && section != 'limiteApostas') {
            this.sectionLimiteApostas = false;
        }

        switch (section) {
            case 'limiteApostas':
                this.sectionLimiteApostas = !this.sectionLimiteApostas;
                break;
            default:
                break;
        }
    }
}
