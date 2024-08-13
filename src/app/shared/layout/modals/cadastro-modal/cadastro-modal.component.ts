import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
    isLoterj;
    user: any;
    loginGoogleAtivo = false;
    formSocial = false;
    aplicarCssTermo: boolean = false;
    parameters = {};
    parametersList;
    parameters = {};
    parametersList;
    postbacks = {};
    registerCancel = false;
    modalClose = true;
    promocoes: any;
    promocaoAtiva = true;
    valorPromocao: number | null = null;
    bonusModalidade: string | null = null;

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
    ) {
        super();
    }

    ngOnInit() {
        this.parametersList = this.paramsService.getOpcoes().enabledParameters;
        this.parametersList = this.paramsService.getOpcoes().enabledParameters;
        this.getPromocoes();
        this.appMobile = this.auth.isAppMobile();
        this.isMobile = window.innerWidth <= 1024;
        this.validacaoEmailObrigatoria = this.paramsService.getOpcoes().validacao_email_obrigatoria;
        this.isLoterj = this.paramsService.getOpcoes().casaLoterj;

        if (this.isLoterj) {
            this.aplicarCssTermo = true;
        }

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
            const promocaoEsportivo = this.promocoes.find(promocoesExistentes => promocoesExistentes.ativo && promocoesExistentes.bonusModalidade === 'esportivo')
            const promocaoCassino = this.promocoes.find(promocoesExistentes => promocoesExistentes.ativo && promocoesExistentes.bonusModalidade === 'cassino')

            if (promocaoCassino) {
                this.promocaoAtiva = true;
                this.valorPromocao = parseFloat(promocaoCassino.valorBonus);
                this.bonusModalidade = 'cassino';
            } else if (promocaoEsportivo) {
                this.promocaoAtiva = true;
                this.valorPromocao = parseFloat(promocaoEsportivo.valorBonus);
                this,this.bonusModalidade = 'esportivo';
            } else {
                this.promocaoAtiva = false;
                this.valorPromocao = null;
            }
        } else {
            this.promocaoAtiva = false;
            this.valorPromocao = null;
        }
    }
  
    descricaoParagrafo(): string {
        if (this.promocaoAtiva && this.valorPromocao) {
            if (this.bonusModalidade === 'cassino') {
                return `Não perca essa oportunidade! Cadastre-se e deposite agora que dobraremos o seu depósito até R$ ${this.valorPromocao}`;
            } else if (this.bonusModalidade === 'esportivo') {
                return `Não perca essa oportunidade! Cadastre-se e deposite agora que dobraremos o seu depósito até R$ ${this.valorPromocao}.`;
            }
        } else {
            return 'Você está quase lá! Cadastre-se e deposite agora e experimente o melhor do entretenimento na palma da sua mão.';
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
            senha: [null, [Validators.required, Validators.minLength(6)]],
            senha_confirmacao: [null, [Validators.required, Validators.minLength(6), FormValidations.equalsTo('senha')]],
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

        if (this.isLoterj) {
            this.form.addControl('confirmarEmail', this.fb.control(null, [
                Validators.required,
                Validators.email,
                FormValidations.equalsTo('email')
            ]));
            this.form.addControl('termosUso', this.fb.control(null, [
                Validators.requiredTrue,
            ]));
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
}
