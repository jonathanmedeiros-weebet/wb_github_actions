import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { AccountVerificationService, AuthService, BannerService, ClienteService, FinanceiroService, GeolocationService, MessageService, NavigatorPermissionsService, ParametrosLocaisService } from 'src/app/services';
import { EventGa4Types, Ga4Service } from 'src/app/shared/services/ga4/ga4.service';
import { FormValidations } from 'src/app/shared/utils';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { CountriesService } from 'src/app/shared/services/utils/countries.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { RecaptchaComponent } from 'ng-recaptcha';
import { finalize } from 'rxjs/operators';
import { CampanhaAfiliadoService } from 'src/app/shared/services/campanha-afiliado.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-register-v3-modal',
  templateUrl: './register-v3-modal.component.html',
  styleUrls: ['./register-v3-modal.component.scss']
})
export class RegisterV3ModalComponent extends BaseFormComponent implements OnInit {
    @ViewChild('documentNumberElement') documentNumberElement: ElementRef<HTMLInputElement>;
    @ViewChild('captchaRef') captchaRef: RecaptchaComponent;

    unsub$ = new Subject();
    public modalClose = true;
    public registerCancel = false;
    public form: FormGroup;
    public errorMessage: string = '';
    public dataNascimento: string = '';
    public submitting: boolean = false;
    public hCaptchaLanguage: string;
    public provedorCaptcha: string;
    public aplicarCssTermo: boolean = false;
    private menorDeIdade: boolean = false;
    public possuiCodigoAfiliado = false;
    private parameters: any = {};
    private parametersList;
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
    public hasRegisterBanner: boolean = false;
    public showNationalitySection: boolean = false;
    public showNationalityOptions: boolean = false;
    public nationalities = this.countriesService.getCountries();
    public cpfSpinner = false;
    private previousUrl: string;

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
        private bannerService: BannerService,
        private accountVerificationService: AccountVerificationService,
        private campanhaService: CampanhaAfiliadoService,
        private location: Location
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
        this.handleRoute();
        this.getPromocoes();
        this.prepareBanner();

        this.isStrengthPassword = this.paramsService.getOpcoes().isStrengthPassword;
        this.provedorCaptcha = this.paramsService.getOpcoes().provedor_captcha;
        this.autoPreenchimento = this.paramsService.getOpcoes().validar_cpf_receita_federal;
        this.countryCodes = this.countriesService.getDialcodes();
        this.parametersList = this.paramsService.getOpcoes().enabledParameters;

        this.createForm();

        this.hCaptchaLanguage = this.translate.currentLang;
        this.translate.onLangChange.subscribe(res => {
            this.hCaptchaLanguage = res.lang;
            this.cd.detectChanges();
        });

        this.handleQueryParams();

        setTimeout(() => this.documentNumberElement.nativeElement.focus(), 500);
    }

    ngOnDestroy() {
        this.location.replaceState(this.previousUrl);

        this.unsub$.next();
        this.unsub$.complete();
    }

    private prepareBanner() {
        const page = 'cadastro';
        this.bannerService
            .banners
            .subscribe((banners) => {
                if(Boolean(banners) && Boolean(banners.length)) {
                    this.registerBanner = banners.find(banner => banner.pagina == page);
                    this.hasRegisterBanner = Boolean(this.registerBanner);
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

    private handleRoute(): void {
        let queryString = '';

        if (this.router.url.includes('/cadastro')) {
            const pages = {
                esporte: 'esportes/futebol',
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
    }

    private handleQueryParams(): void {
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
                    this.showAfiliateSection = true;
                }

                this.parametersList.forEach(param => {
                    if (params[param]) {
                        this.parameters[param] = params[param];
                    }
                });
            });
    }

    createForm() {
        this.form = this.fb.group({
            nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/[a-zA-Z]/)]],
            cpf: [null, [Validators.required, FormValidations.cpfValidator]],
            email: [null, [Validators.required, Validators.email]],
            country: ['+55', [Validators.required]],
            telefone: [null, [Validators.required]],
            senha: [null, [Validators.required, Validators.minLength(8)]],
            nationality: ['Brasil', Validators.required],

            captcha: [null, this.provedorCaptcha  ? Validators.required : null],
            check_1: [''],
            check_2: [''],
            googleId: [''],
            googleIdToken: [''],

            afiliado: [null, [Validators.maxLength(50)]],

            btag: [this.route.snapshot.queryParams.btag],
            refId: [this.route.snapshot.queryParams.ref],
            campRef: [this.route.snapshot.queryParams.c],
            campFonte: [this.route.snapshot.queryParams.s],
            dadosCriptografados: [null],
            termosUso: [true],
        });

        if (this.isStrengthPassword) {
            this.form.controls.senha.clearValidators();
            this.form.controls.senha.addValidators(FormValidations.strongPasswordValidator())
            this.form.controls.senha.updateValueAndValidity();
        }

        if (this.provedorCaptcha == 'recaptcha') {
            this.form.valueChanges.subscribe(() => {
                if (this.form.controls.senha.valid && !this.submitting) {
                    this.captchaRef.execute();
                }
            });
        }
    }

    resolved(token: string) {
        token ? true : false ;
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
        if (!this.autoPreenchimento) {
            values.nomeCompleto = values.nome;
        }

        if (Object.keys(this.parameters).length) {
            values.parameters = this.parameters;
        }

        values = {
            ...values,
            senha_confirmacao: values.senha,
        }

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
                    this.activeModal.dismiss();

                    this.auth.setIsCliente(true);

                    const user = res.result.user;
                    sessionStorage.setItem('user', JSON.stringify(user));
                    localStorage.removeItem('codigoAfiliado');
                    localStorage.setItem('permissionWelcomePage', JSON.stringify(true));

                    if (Boolean(res.dataUser.promocao_primeiro_deposito_ativa)) {
                        localStorage.setItem('promocaoPrimeiroDepositoAtivo', res.dataUser.promocao_primeiro_deposito_ativa);
                    }

                    this.messageService.success(this.translate.instant('geral.cadastroSucedido'));
                    this.accountVerificationService.getAccountVerificationDetail().toPromise();
                    this.router.navigate(['/welcome']);

                    if (this.errorMessage  && res.success) {
                        this.errorMessage  = '';
                    }
                    this.submitting = false;
                },
                error => {
                    this.handleError(error);
                    this.form.patchValue({ captcha: null });
                    this.submitting = false;
                }
            );
    }

    public validarCpf() {
        this.cpfSpinner = true;
        const { cpf } = this.form.value;
        
        if (this.autoPreenchimento) {
            if (this.form.get('cpf').valid) {
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

                this.clientesService.validarCpf(cpf).pipe(
                    finalize(() => {
                        this.cpfSpinner = false;
                    })
                ).subscribe( 
                    res => {
                        if (res.validarCpfAtivado) {
                            const threeMonthsAgo = new Date();
                            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                            if (res.menorDeIdade) {
                                this.messageService.error(this.translate.instant('geral.cadastroMenorDeIdade'));
                                return;
                            }
                            if (Boolean(res.beneficios) && res.beneficios.DataRecebimentoMaisRecente >= threeMonthsAgo.toISOString()) {
                                this.messageService.error(this.translate.instant('register.registrationBeneficiariesSocialPrograms'));
                                return;
                            }

                            this.LabelCpf = res.nome;
                            this.onBlurGa4Name(res.nome);
                            const dadosDescriptografados: any = jwtDecode(res.dados);

                            this.form.patchValue({
                                nome: dadosDescriptografados.nome,
                                dadosCriptografados: res.dados,
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
                this.cpfSpinner = false;
            }
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
            this.isFocused = true;
            setTimeout(() => this.documentNumberElement.nativeElement.focus(), 500);
            this.form.controls.cpf.removeValidators(FormValidations.cpfAlreadyExists)
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
