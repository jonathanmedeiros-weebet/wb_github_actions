import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, ClienteService, FinanceiroService, MessageService, ParametrosLocaisService } from 'src/app/services';
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

@Component({
  selector: 'app-register-v3-modal',
  templateUrl: './register-v3-modal.component.html',
  styleUrls: ['./register-v3-modal.component.scss']
})
export class RegisterV3ModalComponent extends BaseFormComponent implements OnInit, OnDestroy{
    @Input() data: any;
    @ViewChild('captchaRef') captcha: RecaptchaComponent;

    modalClose = true;
    registerCancel = false;
    form: FormGroup;
    dataUserCPF = '';
    cpfValidado = false;
    showLoading = true;
    formSocial = false;
    faceMatchRequested = false;
    validarBeneficioProgramaSocial = '';
    autoPreenchimento = true;
    errorMessage = '';
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
    postbacks = {};
    promocoes: any;
    promocaoAtiva = false;
    valorPromocao: number | null = null;
    bonusModalidade: string | null = null;
    currentLanguage = 'pt';
    isStrengthPassword: boolean | null;
    validPassword: boolean = false;
    fullRegistration = true;
    passwordRequirements: string[] = [];

    requirements = {
        minimumCharacters: false,
        uppercaseLetter: false,
        lowercaseLetter: false,
        specialChar: false,
    };

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
    ) {
        super();
    }

    onSubmit() {
    }

    async submit() {
    }

    ngOnInit() {
        this.createForm();
        this.getPromocoes();

        this.currentLanguage = this.translate.currentLang;
        this.parametersList = this.paramsService.getOpcoes().enabledParameters;
        this.appMobile = this.auth.isAppMobile();
        this.isMobile = window.innerWidth <= 1024;
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

    createForm() {
        this.form = this.fb.group({
            cpf: [null, [Validators.required, FormValidations.cpfValidator]],
            email: [null, [Validators.required, Validators.email]],
            countryCode: ['55', [Validators.required]],
            telefone: [null, [Validators.required]],
            senha: [null, [Validators.required, Validators.minLength(8)]],
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
            termosUso: [true]
        })
    };

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

    ngOnDestroy() {
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
}
