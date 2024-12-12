import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
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

@Component({
    selector: 'app-configuracoes',
    templateUrl: './configuracoes.component.html',
    styleUrls: ['./configuracoes.component.css'],
    providers: [
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
	],
})
export class ConfiguracoesComponent implements OnInit, OnDestroy {
    queryParams: any;
    showLoading = true;
    blocked = false;
    opcaoExclusao = '';

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
    ) {}

    get twoFactorInProfileChangeEnabled(): boolean {
        return Boolean(this.paramsLocais.getOpcoes()?.enable_two_factor_in_profile_change);
    }

    get mobileScreen(): boolean {
        return window.innerWidth <= 1024;
    }

    ngOnInit(): void {
        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cliente'});
            this.menuFooterService.setIsPagina(true);
        }

        this.getClientConfigs();
        this.createForms();
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

        const multifator = this.twoFactorInProfileChangeEnabled
            ? {codigo: this.codigoMultifator, token: this.tokenMultifator}
            : {};

        if (exclusionPeriod == '') {
            this.handleError(this.translate.instant('jogo_responsavel.exclusao_conta.periodIsMissing'));
            return;
        }

        if (this.validarExclusao(confirmarExclusao) || opcao == '') {
            this.clienteService.excluirConta(exclusionPeriod, motivoExclusao, confirmarExclusao, multifator).subscribe(
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
}
