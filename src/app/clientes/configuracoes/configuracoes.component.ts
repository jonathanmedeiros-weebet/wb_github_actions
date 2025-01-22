import { ChangeDetectorRef, Component, ElementRef, Injectable, OnDestroy, OnInit, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import {FormControl, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {MessageService} from '../../shared/services/utils/message.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import { SidebarService } from 'src/app/services';
import {NgbActiveModal, NgbDateParserFormatter, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from 'src/app/shared/services/clientes/cliente.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { MultifactorConfirmationModalComponent } from 'src/app/shared/layout/modals/multifactor-confirmation-modal/multifactor-confirmation-modal.component';
import { IdleDetectService } from 'src/app/shared/services/idle-detect.service';
import { ActivityDetectService } from '../../shared/services/activity-detect.service';
import { LegitimuzService } from 'src/app/shared/services/legitimuz.service';
import { FaceMatchService } from 'src/app/shared/services/face-match.service';
import { LegitimuzFacialService } from 'src/app/shared/services/legitimuz-facial.service';
import { takeUntil } from 'rxjs/operators';
import { Cliente } from 'src/app/shared/models/clientes/cliente';
import { DocCheckService } from 'src/app/shared/services/doc-check.service';

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
	readonly DELIMITER = '/';

	parse(value: string): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	format(date: NgbDateStruct | null): string {
		return date ? String(date.day).padStart(2, '0') + this.DELIMITER + String(date.month).padStart(2, '0') + this.DELIMITER + date.year : '';
	}
}

declare global {
    interface Window {
      ex_partner: any;
      exDocCheck: any;
      exDocCheckAction: any;
    }
  }

@Component({
    selector: 'app-configuracoes',
    templateUrl: './configuracoes.component.html',
    styleUrls: ['./configuracoes.component.css'],
    providers: [
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
	],
})
export class ConfiguracoesComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;
    @ViewChildren('legitimuzLiveness') private legitimuzLiveness: QueryList<ElementRef>;
    @ViewChildren('docCheck') private docCheck: QueryList<ElementRef>;

    queryParams: any;
    showLoading = true;
    blocked = false;
    opcaoExclusao = '';
    cliente: Cliente;
    sectionLimiteApostas = false;
    sectionLimiteDeposito = false;
    sectionLimitePerdas = false;
    sectionTemporizadorSessao = false;
    sectionPeriodoPausa = false;
    sectionExclusaoConta = false;
    sectionLimiteTempoAtividade = false;

    showConfirmarExclusao = false;
    showMotivoExclusaoConta = false;
    showDataFinalPausa = false;

    formLimiteApostas: UntypedFormGroup;
    formLimiteDeposito: UntypedFormGroup;
    formLimitePerda: UntypedFormGroup;
    formPeriodoPausa: UntypedFormGroup;
    formExclusaoConta: UntypedFormGroup;
    formLimiteTempoAtividade: UntypedFormGroup;

    infoPeriodoPausa = '';
    configuracoes: any;

    faceMatchEnabled = false;
    faceMatchAccountDeletion = false;
    faceMatchAccountDeletionValidated = false;
    legitimuzToken = "";
    verifiedIdentity = null;
    disapprovedIdentity = false;
    docCheckToken = "";
    secretHash = "";
    faceMatchType = null;
    dataUserCPF = "";

    public mostrarSenha: boolean = false;
    private tokenMultifator: string;
    private codigoMultifator: string;
    public senhaAtual: FormControl;

    constructor(
        private fb: UntypedFormBuilder,
        private messageService: MessageService,
        private authService: AuthService,
        private clienteService: ClienteService,
        private paramsLocais: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private activityDetectService: ActivityDetectService,
        private translate: TranslateService,
        private legitimuzService: LegitimuzService,
        private legitimuzFacialService: LegitimuzFacialService,
        private faceMatchService: FaceMatchService,
        private cd : ChangeDetectorRef,
        private docCheckService: DocCheckService
    ) {}

    get twoFactorInProfileChangeEnabled(): boolean {
        return Boolean(this.paramsLocais.getOpcoes()?.enable_two_factor_in_profile_change);
    }

    get mobileScreen(): boolean {
        return window.innerWidth <= 1024;
    }

    ngOnInit(): void {
        this.faceMatchType = this.paramsLocais.getOpcoes().faceMatchType;
        this.cd.detectChanges();
        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cliente'});
            this.menuFooterService.setIsPagina(true);
        }

        this.getClientConfigs();
        this.createForms();
        switch(this.faceMatchType) {
            case 'legitimuz':
                this.legitimuzToken = this.paramsLocais.getOpcoes().legitimuz_token;
                this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.legitimuzToken && this.paramsLocais.getOpcoes().faceMatchAccountDeletion);
                break;
            case 'docCheck':
                this.docCheckToken = this.paramsLocais.getOpcoes().dockCheck_token;
                this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.docCheckToken && this.paramsLocais.getOpcoes().faceMatchAccountDeletion);
                this.docCheckService.iframeMessage$.subscribe(message => {
                    if (message.StatusPostMessage.Status == 'APROVACAO_AUTOMATICA' || message.StatusPostMessage.Status == 'APROVACAO_MANUAL') {
                        this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, last_change_password: true }).subscribe()
                        this.faceMatchAccountDeletionValidated = true;
                    }
                })
                break;
            default:
                break;            
        }  
        if (!this.faceMatchEnabled) {
            this.faceMatchAccountDeletionValidated = true;
        }
        const user = JSON.parse(localStorage.getItem('user'));
        this.clienteService.getCliente(user.id)
            .subscribe(
                res => {
                    this.cliente = res;
                    this.dataUserCPF = String(this.cliente.cpf).replace(/[.\-]/g, '');
                    if(this.faceMatchType == 'docCheck') {
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
        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            this.legitimuzService.curCustomerIsVerified
                .subscribe(curCustomerIsVerified => {
                    this.verifiedIdentity = curCustomerIsVerified;
                    if (this.verifiedIdentity) {
                        this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, account_deletion: true }).subscribe({
                            next: (res) => {
                                this.legitimuzService.closeModal();
                                this.messageService.success(this.translate.instant('face_match.verified_identity'));
                                this.faceMatchAccountDeletionValidated = true;
                                this.cd.detectChanges();
                            }, error: (error) => {
                                this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                                this.faceMatchAccountDeletionValidated = false;
                            }
                        })
                    }
                });
            this.legitimuzFacialService.faceIndex
                .subscribe(faceIndex => {
                    if (faceIndex) {
                        this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, account_deletion: true }).subscribe({
                            next: (res) => {
                                this.legitimuzFacialService.closeModal();
                                this.messageService.success(this.translate.instant('face_match.verified_identity'));
                                this.faceMatchAccountDeletionValidated = true;
                                this.cd.detectChanges();
                            }, error: (error) => {
                                this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                                this.faceMatchAccountDeletionValidated = false;
                            }
                        })
                    }
                })
        }
    }

    private getClientConfigs() {
        this.clienteService.getConfigs().subscribe(
            resp => {
                this.formLimiteApostas.setValue({
                    limiteDiario: resp.limiteApostaDiario ?? 0,
                    limiteSemanal: resp.limiteApostaSemanal ?? 0,
                    limiteMensal: resp.limiteApostaMensal ?? 0,
                });

                this.formLimiteDeposito.setValue({
                    limiteDiario: resp.limiteDepositoDiario ?? 0,
                    limiteSemanal: resp.limiteDepositoSemanal ?? 0,
                    limiteMensal: resp.limiteDepositoMensal ?? 0,
                });

                this.formLimitePerda.setValue({
                    limiteDiario: resp.limitePerdaDiario ?? 0,
                    limiteSemanal: resp.limitePerdaSemanal ?? 0,
                    limiteMensal: resp.limitePerdaMensal ?? 0,
                });

                this.formLimiteTempoAtividade.setValue({
                    limiteTempoAtividade: this.formatterLimiteTempoAtividade(resp.limiteTempoAtividade) ?? ''
                });

                if(resp.infoPeriodoPausa) {
                    this.infoPeriodoPausa = resp.infoPeriodoPausa;
                }
            },
            error =>  {
                this.handleError(error);
            }
        )
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    createForms() {
        this.senhaAtual = new FormControl('', [Validators.required]);

        this.formLimiteApostas = this.fb.group({
            limiteDiario: [''],
            limiteSemanal: [''],
            limiteMensal: [''],
        });

        this.formLimiteDeposito = this.fb.group({
            limiteDiario: [''],
            limiteSemanal: [''],
            limiteMensal: [''],
        });

        this.formLimitePerda = this.fb.group({
            limiteDiario: [''],
            limiteSemanal: [''],
            limiteMensal: [''],
        });

        this.formLimiteTempoAtividade = this.fb.group({
            limiteTempoAtividade: ['']
        });

        this.formPeriodoPausa = this.fb.group({
            opcaoPausa: [''],
            dataFinalPausa: [''],
        });

        this.formExclusaoConta = this.fb.group({
            exclusionPeriod: [''],
            motivoExclusao: [''],
            opcao: [''],
            confirmarExclusao: [''],
        });

    }

    handleSubmit(submitFunctionName: string) {
        if(this.twoFactorInProfileChangeEnabled) {
            this.validacaoMultifator(submitFunctionName)
        } else {
            this[submitFunctionName]();
        }
    }

    validacaoMultifator(submitFunctionName: string) {
        const modalRef = this.modalService.open(
            MultifactorConfirmationModalComponent, {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350',
                centered: true,
                backdrop: 'static'
            }
        );

        modalRef.componentInstance.senha = this.senhaAtual.value;

        modalRef.result.then(
            (result) => {
                this.tokenMultifator = result.token;
                this.codigoMultifator = result.codigo;

                if (result.checked) {
                    this[submitFunctionName]();
                }
            },
        );
    }

    onSubmitLimiteApostas() {
        let data = this.formLimiteApostas.value;

        if(this.twoFactorInProfileChangeEnabled){
            data = {
                ...data,
                token: this.tokenMultifator,
                codigo: this.codigoMultifator
            }
        }

        this.clienteService.configLimiteAposta(data).subscribe(
            result => {
                this.messageService.success(result.message);
                this.senhaAtual.patchValue('');
            },
            error => this.handleError(error)
        )
    }

    onSubmitLimiteDeposito() {
        let data = this.formLimiteDeposito.value;

        if(this.twoFactorInProfileChangeEnabled){
            data = {
                ...data,
                token: this.tokenMultifator,
                codigo: this.codigoMultifator
            }
        }

        this.clienteService.configLimiteDesposito(data).subscribe(
            result => {
                this.messageService.success(result.message);
                this.senhaAtual.patchValue('');
            },
            error => this.handleError(error)
        )
    }
    onSubmitLimitePerda() {
        let data = this.formLimitePerda.value;
        if(this.twoFactorInProfileChangeEnabled){
            data = {
                ...data,
                token: this.tokenMultifator,
                codigo: this.codigoMultifator
            }
        }
        this.clienteService.configLimitePerda(data).subscribe(
            result => {
                this.messageService.success(result.message);
                this.senhaAtual.patchValue('');
            },
            error => this.handleError(error)
        )
    }


    onSubmitLimiteTempoAtividade() {
        let data = this.formLimiteTempoAtividade.value;

        if (this.twoFactorInProfileChangeEnabled) {
            data = {
                ...data,
                token: this.tokenMultifator,
                codigo: this.codigoMultifator
            }
        }

        this.clienteService.configLimiteTempoAtividade(data).subscribe(
            result => {
                this.activityDetectService.resetActivity();

                this.activityDetectService.loadDailyActivityTime();
                this.activityDetectService.initializeActivityConfig();

                this.messageService.success(result.message);
            },
            error => {
                this.handleError(error)
            }
        )
    }

    onSubmitPeriodoPausa() {
        let data = this.formPeriodoPausa.value;

        if(this.twoFactorInProfileChangeEnabled){
            data = {
                ...data,
                token: this.tokenMultifator,
                codigo: this.codigoMultifator
            }
        }

        this.clienteService.configPeriodoPausa(data).subscribe(
            result => {
                this.messageService.success(result.message)
                this.senhaAtual.patchValue('');
                this.getClientConfigs();
            },
            error => this.handleError(error)
        )
    }

    onSubmitExclusaoConta() {
        const { exclusionPeriod, motivoExclusao, confirmarExclusao, opcao } = this.formExclusaoConta.value;

        const sanitizedExclusionConfirmation = confirmarExclusao.trim();

        const multifator = this.twoFactorInProfileChangeEnabled
            ? {codigo: this.codigoMultifator, token: this.tokenMultifator}
            : {};

        if (exclusionPeriod == '') {
            this.handleError(this.translate.instant('jogo_responsavel.exclusao_conta.periodIsMissing'));
            return;
        }

        if (this.validarExclusao(sanitizedExclusionConfirmation) || opcao == '') {
            this.clienteService.excluirConta(exclusionPeriod, motivoExclusao, sanitizedExclusionConfirmation, multifator).subscribe(
                result => {
                    this.messageService.success(result.message);
                    this.authService.logout();
                },
                error => {
                    this.handleError(error);
                }
            )
        } else {
            this.handleError(this.translate.instant('jogo_responsavel.exclusao_conta.exclusionConfirmationError'));
            return;
        }
    }

    toggleSections(section: string) {
        if(this.sectionLimiteApostas && section != 'limiteApostas') {
            this.sectionLimiteApostas = false;
        }
        if(this.sectionLimiteDeposito && section != 'limiteDeposito') {
            this.sectionLimiteDeposito = false;
        }
        if(this.sectionLimitePerdas && section != 'limitePerdas') {
            this.sectionLimitePerdas = false;
        }
        if(this.sectionTemporizadorSessao && section != 'temporizadorSessao') {
            this.sectionTemporizadorSessao = false;
        }
        if(this.sectionPeriodoPausa && section != 'periodoPausa') {
            this.sectionPeriodoPausa = false;
        }
        if(this.sectionExclusaoConta && section != 'exclusaoConta') {
            this.sectionExclusaoConta = false;
        }
        if(this.sectionLimiteTempoAtividade && section != 'limiteTempoAtividade') {
            this.sectionLimiteTempoAtividade = false;
        }

        switch (section) {
            case 'limiteApostas':
                this.sectionLimiteApostas = !this.sectionLimiteApostas;
                break;
            case 'limiteDeposito':
                this.sectionLimiteDeposito = !this.sectionLimiteDeposito;
                break;
            case 'limitePerdas':
                    this.sectionLimitePerdas = !this.sectionLimitePerdas;
                    break;
            case 'temporizadorSessao':
                this.sectionTemporizadorSessao = !this.sectionTemporizadorSessao;
                break;
            case 'periodoPausa':
                this.sectionPeriodoPausa = !this.sectionPeriodoPausa;
                break;
            case 'exclusaoConta':
                this.sectionExclusaoConta = !this.sectionExclusaoConta;
                break;
            case 'limiteTempoAtividade':
                this.sectionLimiteTempoAtividade = !this.sectionLimiteTempoAtividade;
                break;
            default:
                break;
        }
    }

    changeOpcaoPausa() {
        const { opcaoPausa } = this.formPeriodoPausa.value;

        if(opcaoPausa == 'custom') {
            this.showDataFinalPausa = true;
        } else {
            this.showDataFinalPausa = false;
        }
    }

    changeOpcaoExclusao() {
        const { exclusionPeriod, opcao } = this.formExclusaoConta.value;
        this.showConfirmarExclusao = true;

        if(opcao == '6') {
            this.formExclusaoConta.setValue({ exclusionPeriod: exclusionPeriod, motivoExclusao: "", opcao: opcao, confirmarExclusao: ""});
            this.showMotivoExclusaoConta = true;
        } else {
            this.showMotivoExclusaoConta = false;
            switch (opcao) {
                case '1':
                    this.formExclusaoConta.setValue({ exclusionPeriod: exclusionPeriod, motivoExclusao: "Uma segunda conta foi criada", opcao: opcao, confirmarExclusao: ""});
                    break;
                case '2':
                    this.formExclusaoConta.setValue({ exclusionPeriod: exclusionPeriod, motivoExclusao: "Ocupa muito meu tempo/desvia muito minha atenção", opcao: opcao, confirmarExclusao: ""});
                    break;
                case '3':
                    this.formExclusaoConta.setValue({ exclusionPeriod: exclusionPeriod, motivoExclusao: "Não tenho mais interesse em realizar apostas neste site", opcao: opcao, confirmarExclusao: ""});
                    break;
                case '4':
                    this.formExclusaoConta.setValue({ exclusionPeriod: exclusionPeriod, motivoExclusao: "Não estou mais usando está conta", opcao: opcao, confirmarExclusao: ""});
                    break;
                case '5':
                    this.formExclusaoConta.setValue({ exclusionPeriod: exclusionPeriod, motivoExclusao: "Problemas ao utilizar o sistema", opcao: opcao, confirmarExclusao: ""});
                    break;
                default:
                    this.showConfirmarExclusao = false;
                    break;
            }
        }
    }

    validarExclusao(input: string): boolean {
        const textoEsperado = ['EXCLUIR CONTA', 'DELETE ACCOUNT', 'ELIMINAR CUENTA'];
        return textoEsperado.includes(input);
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    toClose() {
        this.activeModal.dismiss('Cross click');
    }

    formatterLimiteTempoAtividade = (input: string) => {
        switch(input){
            case '00:30':
                return '30minutos';
            case '00:45':
                return '45minutos';
            case '01:00':
                return '1hora';
            case '02:00':
                return '2horas';
            case '03:00':
                return '3horas';
            case '04:00':
                return '4horas';
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
}
