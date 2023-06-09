import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MessageService} from '../../shared/services/utils/message.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import { SidebarService } from 'src/app/services';
import {NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from 'src/app/shared/services/clientes/cliente.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

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

    smallScreen = false;
    mobileScreen = false;

    sectionLimiteApostas = false;
    sectionLimiteDeposito = false;
    sectionTemporizadorSessao = false;
    sectionPeriodoPausa = false;
    sectionExclusaoConta = false;

    showMotivoExclusaoConta = false;
    showDataFinalPausa = false;

    formLimiteApostas: FormGroup;
    formLimiteDeposito: FormGroup;
    formPeriodoPausa: FormGroup;
    formExclusaoConta: FormGroup;

    configuracoes: any;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private authService: AuthService,
        private clienteService: ClienteService,
        private paramsLocais: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit(): void {
        this.smallScreen = window.innerWidth < 669;
        this.mobileScreen = window.innerWidth <= 1024;
        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cliente'});
            this.menuFooterService.setIsPagina(true);
        }

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
            },
            error =>  {
                this.handleError(error);
            }
        )
        this.createForms();
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    createForms() {
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

        this.formPeriodoPausa = this.fb.group({
            opcaoPausa: [''],
            dataFinalPausa: [''],
        });

        this.formExclusaoConta = this.fb.group({
            motivoExclusao: [''],
            opcao: [''],
        });

    }

    onSubmitLimiteApostas() {
        this.clienteService.configLimiteAposta(this.formLimiteApostas.value).subscribe(
            result => {
                this.messageService.success(result.message)
            },
            error => {
                this.handleError(error);
            }
        )
    }

    onSubmitLimiteDeposito() {
        this.clienteService.configLimiteDesposito(this.formLimiteDeposito.value).subscribe(
            result => {
                this.messageService.success(result.message)
            },
            error => {
                this.handleError(error);
            }
        )
    }

    onSubmitPeriodoPausa() {
        this.clienteService.configPeriodoPausa(this.formPeriodoPausa.value).subscribe(
            result => {
                this.messageService.success(result.message)
            },
            error => {
                this.handleError(error);
            }
        )
    }

    onSubmitExclusaoConta() {
        const { motivoExclusao } = this.formExclusaoConta.value;

        this.clienteService.excluirConta(motivoExclusao).subscribe(
            result => {
                this.messageService.success(result.message);
                this.authService.logout();
            },
            error => {
                this.handleError(error);
            }
        )
    }

    toggleSections(section: string) {
        if(this.sectionLimiteApostas && section != 'limiteApostas') {
            this.sectionLimiteApostas = false;
        }
        if(this.sectionLimiteDeposito && section != 'limiteDeposito') {
            this.sectionLimiteDeposito = false;
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

        switch (section) {
            case 'limiteApostas':
                this.sectionLimiteApostas = !this.sectionLimiteApostas;
                break;
            case 'limiteDeposito':
                this.sectionLimiteDeposito = !this.sectionLimiteDeposito;
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
        const { opcao } = this.formExclusaoConta.value;

        if(opcao == '6') {
            this.formExclusaoConta.setValue({ motivoExclusao: "", opcao: opcao});
            this.showMotivoExclusaoConta = true;
        } else {
            this.showMotivoExclusaoConta = false;
            switch (opcao) {
                case '1':
                    this.formExclusaoConta.setValue({ motivoExclusao: "Uma segunda conta foi criada", opcao: opcao});
                    break;
                case '2':
                    this.formExclusaoConta.setValue({ motivoExclusao: "Ocupa muito meu tempo/desvia muito minha atenção", opcao: opcao});
                    break;
                case '3':
                    this.formExclusaoConta.setValue({ motivoExclusao: "Não tenho mais interesse em realizar apostas nesta banca", opcao: opcao});
                    break;
                case '4':
                    this.formExclusaoConta.setValue({ motivoExclusao: "Não estou mais usando está conta", opcao: opcao});
                    break;
                case '5':
                    this.formExclusaoConta.setValue({ motivoExclusao: "Problemas ao utilizar o sistema", opcao: opcao});
                    break;
                default:
                    break;
            }
        }
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
