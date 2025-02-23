import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, BannerService, ClienteService, FinanceiroService, GeolocationService, MessageService, NavigatorPermissionsService, ParametrosLocaisService } from 'src/app/services';
import { EventGa4Types, Ga4Service } from 'src/app/shared/services/ga4/ga4.service';
import { FormValidations } from 'src/app/shared/utils';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { CountriesService } from 'src/app/shared/services/utils/countries.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-register-v3-modal',
  templateUrl: './register-v3-modal.component.html',
  styleUrls: ['./register-v3-modal.component.scss']
})
export class RegisterV3ModalComponent extends BaseFormComponent implements OnInit {
    @ViewChild('documentNumberElement') documentNumberElement: ElementRef<HTMLInputElement>;

    public modalClose = true;
    public registerCancel = false;
    public form: FormGroup;
    private validacaoEmailObrigatoria: boolean = false;
    public errorMessage: string = '';
    public dataNascimento: string = '';
    public submitting: boolean = false;
    public hCaptchaLanguage: string;
    private provedorCaptcha: boolean = false;
    public aplicarCssTermo: boolean = false;
    private menorDeIdade: boolean = false;
    public possuiCodigoAfiliado = false;
    public isLoterj: boolean = false;
    private parameters: any = {};
    private promocoes: any;
    public promocaoAtiva: boolean = false;
    public valorPromocao: number | null = null;
    public isStrengthPassword: boolean | null;
    private lastLocationPermission = null;
    private currentLocationPermission = null;
    public mostrarSenha: boolean = false;
    public autoPreenchimento: boolean = true;
    public showAfiliateSection: boolean = false;
    public isFocused: boolean = true;
    public activeEditingCPF: boolean = true;
    public LabelCpf: string = 'CPF';
    public requirements: any = {
        minimumCharacters: false,
        uppercaseLetter: false,
        lowercaseLetter: false,
        specialChar: false,
    };
    public countryCodes: any[] = [];
    private registerBanner: any;

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
        private navigatorPermissionsService: NavigatorPermissionsService,
        private geolocationService: GeolocationService,
        private router: Router,
        private countriesService: CountriesService,
        private modalService: NgbModal,
        private bannerService: BannerService
    ) {
        super();
    }

    get returnRequirementsValue() {
        return Object.values(this.requirements ).filter(value => value).length;
    }

    get registerBannerDesktop() {
        return Boolean(this.registerBanner) ? this.registerBanner?.src : null;
    }

    get registerBannerMobile() {
        return Boolean(this.registerBanner) ? this.registerBanner?.src_mobile : null;
    }

    ngOnInit() {
        this.createForm();
        this.getPromocoes();
        this.prepareBanner();

        this.validacaoEmailObrigatoria = this.paramsService.getOpcoes().validacao_email_obrigatoria;
        this.isLoterj = this.paramsService.getOpcoes().casaLoterj;
        this.isStrengthPassword = this.paramsService.getOpcoes().isStrengthPassword;
        this.provedorCaptcha  = this.paramsService.getOpcoes().provedor_captcha;
        this.autoPreenchimento = this.paramsService.getOpcoes().validar_cpf_receita_federal;
        this.countryCodes = this.countriesService.getDialcodes();

        if (this.isLoterj) {
            this.aplicarCssTermo = true;
        }

        this.hCaptchaLanguage = this.translate.currentLang;
        this.translate.onLangChange.subscribe(res => {
            this.hCaptchaLanguage = res.lang;
            this.cd.detectChanges();
        });

        setTimeout(() => this.documentNumberElement.nativeElement.focus(), 500);
    }

    private prepareBanner() {
        const page = 'cadastro';
        this.bannerService
            .requestBanners()
            .toPromise()
            .then((banners) => {
                if(Boolean(banners)) {
                    this.registerBanner = banners.find(banner => banner.pagina == page);
                }
            })
    }

    private getPromocoes(queryParams?: any) {
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

    private verificarPromocaoAtiva(): void {
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
            cpf: [null, [Validators.required, FormValidations.cpfValidator]],
            email: [null, [Validators.required, Validators.email]],
            country: ['+55', [Validators.required]],
            telefone: [null, [Validators.required]],
            senha: [null, [Validators.required, Validators.minLength(8)]],
            genero: ['Homem', Validators.required],
            nationality: ['Brasil', Validators.required],

            captcha: [null, this.provedorCaptcha  ? Validators.required : null],
            check_1: [''],
            check_2: [''],
            googleId: [''],
            googleIdToken: [''],

            afiliado: [null, [Validators.maxLength(50)]],

            btag: [this.route.snapshot.queryParams.btag],
            refId: [this.route.snapshot.queryParams.refId],
            campRef: [this.route.snapshot.queryParams.c],
            campFonte: [this.route.snapshot.queryParams.s],

            logradouro: ['Travessa da rua do fulano', Validators.required],
            numero: ['123', Validators.required],
            bairro: ['Universitário', Validators.required],
            cidade: ['Vitória de Santo Antão', Validators.required],
            estado: ['Pernambuco', Validators.required],
            cep: ['55612271', Validators.required],

            dadosCriptografados: [null],
            termosUso: [true],
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
        }
    }

    public onSubmit() {
        super.onSubmit();
    }

    private async prepareSubmitData() {
        if (this.menorDeIdade) {
            this.messageService.error(this.translate.instant('geral.cadastroMenorDeIdade'));
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
            registerV3: true,
            ...values,
            senha_confirmacao: values.senha,
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

    public async submit() {
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

                    if (this.errorMessage  && res.success) {
                        this.errorMessage  = '';
                    }
                },
                error => {
                    this.handleError(error);
                    this.form.patchValue({ captcha: null });
                    this.submitting = false;
                }
            );
    }

    public validarCpf() {
        const { cpf } = this.form.value;
        if (this.autoPreenchimento) {
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

                            this.LabelCpf = res.nome;
                            this.onBlurGa4Name(res.nome);
                            const dadosDescriptografados: any = jwtDecode(res.dados);

                            this.form.patchValue({
                                nome: dadosDescriptografados.nome,
                                dadosCriptografados: res.dados,
                                nascimento: dadosDescriptografados.nascimento
                            });

                            this.dataNascimento = this.formatarDataComAsterisco(dadosDescriptografados.nascimento);
                            this.activeEditingCPF = false;
                        } 
                    },
                    error => {
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
        this.errorMessage  = error;
    }

    public handleActiveEditingCPF(){
        this.LabelCpf = 'CPF';
        this.activeEditingCPF = !this.activeEditingCPF;

        this.form.patchValue({
            nome: '',
            nomeCompleto: '',
            dadosCriptografados: null,
            nascimento: ''
        });

        this.dataNascimento = '';

        if(this.activeEditingCPF) {
            console.log('entrou')
            this.isFocused = true;
            setTimeout(() => this.documentNumberElement.nativeElement.focus(), 500);
        }
    }

    public onBeforeInput(e: InputEvent, inputName) {
        FormValidations.blockInvalidCharacters(e, inputName);
    }

    public checkPassword() {
        const passwordValue = this.form.controls.senha.value;
        const lengthCheck = passwordValue.length >= 8;
        const hasUpperCase = /[A-Z]/.test(passwordValue);
        const hasLowerCase = /[a-z]/.test(passwordValue);
        const hasmustContainOneUppercaseAndOneLowercaseLetter = hasUpperCase && hasLowerCase;
        const hasSpecialChar = /[!@#$%^&*]/.test(passwordValue);

        this.requirements  = {
            minimumCharacters: lengthCheck,
            mustContainOneUppercaseAndOneLowercaseLetter: hasmustContainOneUppercaseAndOneLowercaseLetter,
            specialChar: hasSpecialChar,
        };
    }

    private onBlurGa4Name(value: any): void {
        if (value) {
            this.ga4Service.triggerGa4Event(EventGa4Types.START_REGISTRATION);
        }
    }

    public registerOpen() {
        this.registerCancel = false;
        this.modalClose = true;
    }

    public onClose() {
        this.registerCancel = true;
        this.modalClose = false;
    }

    public cancelModal() {
        this.activeModal.dismiss();
    }

    public openLogin() {
        this.activeModal.dismiss();
        this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-400 modal-h-350 modal-login',
                centered: true,
            }
        );
    }

    private formatarDataComAsterisco (data: string) {
        const [ano, mes, dia] = data.split('-');
        return `${dia[0]}*/${mes[0]}*/${ano[0]}***`;
    }
}
