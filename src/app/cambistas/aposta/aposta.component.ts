import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
    AcumuladaoService,
    ApostaEsportivaService,
    ApostaLoteriaService,
    ApostaService,
    DesafioApostaService,
    MessageService,
    ParametrosLocaisService,
    SidebarService
} from 'src/app/services';
import {ApostaEncerramentoModalComponent, ApostaModalComponent, ConfirmModalComponent} from 'src/app/shared/layout/modals';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
import moment from 'moment/moment';

@Component({
  selector: 'app-aposta',
  templateUrl: './aposta.component.html',
  styleUrls: ['./aposta.component.css']
})
export class ApostaComponent implements OnInit {

    apostas = [];
    queryParams;
    loading = false;
    apostador = '';
    status = '';
    codigo = '';
    loteriasHabilitada;
    acumuladaoHabilitado;
    desafioHabilitado;
    cassinoHabilitado;
    habilitar_cancelar_ultima_aposta;
    habilitar_cancelar_aposta;
    encerramentoPermitido;

    modalRef;

    tabSelected = 'esporte';

    hoveredDate: NgbDate | null = null;
    selectedDate = '';

    fromDate: NgbDate | null;
    toDate: NgbDate | null;

    showLoading = false;

    totais = {
        valor: 0,
        premio: 0,
    };
    mobileScreen: boolean;

    unsub$ = new Subject();

    constructor(
        private sidebarService: SidebarService,
        private calendar: NgbCalendar,
        private params: ParametrosLocaisService,
        private apostaEsportivaService: ApostaEsportivaService,
        private acumuladaoService: AcumuladaoService,
        private cassinoService: CasinoApiService,
        private loteriaService: ApostaLoteriaService,
        public desafioApostaService: DesafioApostaService,
        public formatter: NgbDateParserFormatter,
        public messageService: MessageService,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private apostaService: ApostaService,
        public activeModal: NgbActiveModal
    ) {
        const monday = moment().clone().isoWeekday(1);
        this.fromDate = NgbDate.from({year: monday.year(), month: monday.month() + 1, day: monday.date()});
        this.toDate = calendar.getNext(this.fromDate, 'd', 6);

        this.queryParams = {
            dataInicial: this.formatDate(this.fromDate, 'us'),
            dataFinal: this.formatDate(this.toDate, 'us')
        };

        this.selectedDate = this.formatDate(this.fromDate) + ' - ' + this.formatDate(this.toDate);
    }

    ngOnInit(): void {
        this.mobileScreen = window.innerWidth <= 1024;
        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cambista'});
        }

        this.loteriasHabilitada = this.params.getOpcoes().loterias;
        this.acumuladaoHabilitado = this.params.getOpcoes().acumuladao;
        this.desafioHabilitado = this.params.getOpcoes().desafio;
        this.cassinoHabilitado = this.params.getOpcoes().casino;
        this.habilitar_cancelar_aposta = this.params.getOpcoes().habilitar_cancelar_aposta;
        this.habilitar_cancelar_ultima_aposta = this.params.getOpcoes().habilitar_cancelar_ultima_aposta;
        this.encerramentoPermitido = (['cambista', 'todos'].includes(this.params.getOpcoes().permitir_encerrar_aposta));

        this.getApostas();
    }

    getApostas() {
        this.loading = true;

        let dataSeparadas = this.selectedDate.split(" - ");
        this.queryParams.dataFinal = this.formateDate(dataSeparadas[1]) ;
        this.queryParams.dataInicial = this.formateDate(dataSeparadas[0]);

        const queryParams: any = {
            'codigo': this.codigo,
            'data-inicial': this.queryParams.dataInicial,
            'data-final': this.queryParams.dataFinal,
            'status': this.status,
            'apostador': this.apostador,
            'sort': '-horario',
            'otimizado': true
        };

        switch (this.tabSelected) {
            case 'esporte':
                this.apostaEsportivaService.getApostas(queryParams)
                .subscribe(
                    apostas => this.handleResponse(apostas),
                    error => this.handleError(error)
                );
                break;
            case 'acumuladao':
                this.acumuladaoService.getApostas(queryParams)
                .subscribe(
                    apostas => this.handleResponse(apostas),
                    error => this.handleError(error)
                );
                break;
            case 'desafio':
                this.desafioApostaService.getApostas(queryParams)
                .subscribe(
                    apostas => this.handleResponse(apostas),
                    error => this.handleError(error)
                );
                break;
            case 'cassino':
                this.cassinoService.getApostas(queryParams)
                .subscribe(
                    apostas => this.handleResponse(apostas),
                    error => this.handleError(error)
                );
                break;
            case 'loteria':
                this.loteriaService.getApostas(queryParams)
                    .subscribe(
                        apostas => this.handleResponse(apostas),
                        error => this.handleError(error)
                    );
                break;
            default:
                this.handleResponse([]);
                break;
        }
    }

    handleResponse(response) {
        this.apostas = response;

        this.totais.valor = 0;
        this.totais.premio = 0;

        response.forEach(aposta => {
            if (!aposta.cartao_aposta) {
                this.totais.valor += aposta.valor;
                if (aposta.tipo === 'loteria') {
                    aposta.itens.forEach(lotteryItem => {
                        if (lotteryItem.status === 'ganhou') {
                            this.totais.premio += lotteryItem.premio;
                        }
                    });
                } else {
                    if (aposta.resultado === 'ganhou') {
                        this.totais.premio += aposta.premio;
                    }
                }
            }
        });

        this.loading = false;
    }

    onDateSelection(date: NgbDate, datepicker: any) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
            this.queryParams.dataInicial = this.formatDate(date, 'us');
        } else if (this.fromDate && !this.toDate && date && (date.after(this.fromDate) || date.equals(this.fromDate))) {
            this.toDate = date;
            this.queryParams.dataFinal = this.formatDate(date, 'us');
            this.selectedDate = this.formatDate(this.fromDate) + ' - ' + this.formatDate(date);
            datepicker.close();
        } else {
            this.toDate = null;
            this.queryParams.dataFinal = null;
            this.fromDate = date;
            this.queryParams.dataInicial = this.formatDate(date, 'us');
        }
    }

    formatDate(date, lang = 'br') {
        if (lang == 'us') {
            return  date.year + '-' + String(date.month).padStart(2, '0') + '-' + String(date.day).padStart(2, '0');
        }
        return String(date.day).padStart(2, '0') + '/' + String(date.month).padStart(2, '0') + '/' + date.year;
    }

    isHovered(date: NgbDate) {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
            date.before(this.hoveredDate);
    }

    isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

    isRange(date: NgbDate) {
        return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
        this.isHovered(date);
    }

    validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
        const parsed = this.formatter.parse(input);
        return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    }

    classNameAposta(aposta) {
        let resultado;

        if (['seninha', 'quininha'].includes(aposta.modalidade)) {
            if (aposta.itens.some(loteriaItem => loteriaItem.status == 'ganhou')) {
                resultado = 'ganhou';
            } else if (aposta.itens.some(loteriaItem => loteriaItem.status == 'perdeu')) {
                resultado = 'perdeu';
            }
        } else {
            resultado = aposta.resultado;
        }

        switch (resultado) {
            case 'ganhou':
                return 'green';
            case 'perdeu':
                return 'red';
            default:
                return 'default';
        }
    }

    handleFiltrar() {
        this.getApostas();
    }

    changeTab(tab) {
        this.tabSelected = tab;
        this.getApostas();
    }

    handleError(error: string) {
        this.loading = false;
        this.messageService.error(error);
    }

    openModal(aposta) {
        this.showLoading = true;
        const params = {};

        if (aposta.id === this.apostas[0].id) {
            params['verificar-ultima-aposta'] = 1;
        }

        let modalAposta;
        if (this.encerramentoPermitido && aposta.tipo == 'esportes') {
            modalAposta = ApostaEncerramentoModalComponent;
        } else {
            modalAposta = ApostaModalComponent;
        }

        this.apostaService.getAposta(aposta.id, params)
            .subscribe(
                apostaLocalizada => {
                    this.modalRef = this.modalService.open(modalAposta, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true,
                        scrollable: true
                    });
                    this.modalRef.componentInstance.aposta = apostaLocalizada;
                    this.modalRef.componentInstance.showCancel = true;
                    if (params['verificar-ultima-aposta']) {
                        this.modalRef.componentInstance.isUltimaAposta = apostaLocalizada.is_ultima_aposta;
                    }

                    this.modalRef.result.then(
                        (result) => {
                            switch (result) {
                                case 'pagamento':
                                    this.pagarAposta(apostaLocalizada);
                                    break;
                                default:
                                    break;
                            }
                        },
                        (reason) => {
                        }
                    );

                    this.showLoading = false;
                    this.cd.detectChanges();
                },
                error => this.handleError(error)
            );
    }

    handleCancel(aposta) {
        this.showLoading = true;
        const params = {};

        if (aposta.id === this.apostas[0].id) {
            params['verificar-ultima-aposta'] = 1;
        }

        this.apostaService.getAposta(aposta.id, params)
            .subscribe(
                apostaLocalizada => {
                    this.cancelar(apostaLocalizada);

                    this.showLoading = false;
                    this.cd.detectChanges();
                },
                error => this.handleError(error)
            );
    }

    cancelar(aposta) {
        this.modalRef = this.modalService.open(ConfirmModalComponent, {centered: true});
        this.modalRef.componentInstance.title = 'Cancelar Aposta';
        this.modalRef.componentInstance.msg = 'Tem certeza que deseja cancelar a aposta?';

        this.modalRef.result.then(
            (result) => {
                this.apostaService.cancelar({id: aposta.id, version: aposta.version})
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        () => this.getApostas(),
                        error => this.handleError(error)
                    );
            },
            (reason) => {
            }
        );
    }

    pagarAposta(aposta) {
        this.modalRef = this.modalService.open(ConfirmModalComponent, {centered: true});
        this.modalRef.componentInstance.title = 'Pagar Aposta';
        this.modalRef.componentInstance.msg = 'Tem certeza que deseja pagar a aposta?';

        this.modalRef.result.then(
            () => {
                this.apostaService.pagar(aposta.id)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        result => {
                            aposta.pago = result.pago;
                            this.cd.detectChanges();

                            if (result.pago) {
                                this.messageService.success('Pagamento Registrado com Sucesso!');
                            } else {
                                this.messageService.success('Pagamento Cancelado!');
                            }
                        },
                        error => this.handleError(error)
                    );
            },
            reason => {
            }
        );
    }

    getDataFormatada(value, format) {
        return moment(value).format(format);
    }

    formateDate(data) {
        let partes = data.split("/");
        let dataFormatada = partes[2] + "-" + partes[1] + "-" + partes[0];

        return dataFormatada;
    }
}
