import {Component, OnInit} from '@angular/core';
import {RelatorioService} from '../../shared/services/relatorio.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {UntypedFormBuilder} from '@angular/forms';
import {SidebarService} from 'src/app/services';
import {NgbActiveModal, NgbCalendar, NgbDate, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import moment from 'moment';
import 'moment/min/locales';

@Component({
    selector: 'app-apuracao',
    templateUrl: './apuracao.component.html',
    styleUrls: ['./apuracao.component.css']
})
export class ApuracaoComponent extends BaseFormComponent implements OnInit {
    queryParams;
    relatorio;
    resultado = 0;
    showLoading = true;
    modoContaCorrente;
    loteriasHabilitada;
    acumuladaoHabilitado;
    desafioHabilitado;
    dataSaldoAnterior;
    showEntradas = true;
    showSaidas = true;
    showTotalApostadoDetalhado = false;
    dataInicial;
    dataFinal;
    detalhamentoHabilitado = false;
    hoveredDate: NgbDate | null = null;
    selectedDate = '';
    fromDate: NgbDate | null;
    toDate: NgbDate | null;
    mobileScreen;

    constructor(
        private relatorioService: RelatorioService,
        private messageService: MessageService,
        private params: ParametrosLocaisService,
        private fb: UntypedFormBuilder,
        private calendar: NgbCalendar,
        public formatter: NgbDateParserFormatter,
        private sidebarService: SidebarService,
        public activeModal: NgbActiveModal,
    ) {
        super();

        const monday = moment().clone().isoWeekday(1);

        this.fromDate = NgbDate.from({year: monday.year(), month: monday.month() + 1, day: monday.date()});
        this.toDate = calendar.getNext(this.fromDate, 'd', 6);

        this.queryParams = {
            dataInicial: this.formatDate(this.fromDate, 'us'),
            dataFinal: this.formatDate(this.toDate, 'us')
        };

        this.selectedDate = this.formatDate(this.fromDate) + ' - ' + this.formatDate(this.toDate);
    }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <=1024;
        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cambista'});
        }

        this.modoContaCorrente = this.params.modoContaCorrente();
        this.loteriasHabilitada = this.params.getOpcoes().loterias;
        this.acumuladaoHabilitado = this.params.getOpcoes().acumuladao;
        this.desafioHabilitado = this.params.getOpcoes().desafio;

        this.detalhamentoHabilitado = this.loteriasHabilitada || this.acumuladaoHabilitado || this.desafioHabilitado;
        this.dataSaldoAnterior = moment(this.queryParams.dataInicial).subtract(1, 'day').format('DD/MM');

        this.createForm();
        this.getResultado();
    }

    createForm() {
        // this.form = this.fb.group({
        //     dataInicial: [this.dataInicial.format('YYYY-MM-DD'), Validators.required],
        //     dataFinal: [this.dataFinal.format('YYYY-MM-DD'), Validators.required]
        // });
    }

    submit() {
    }

    onDateSelection(date: NgbDate, datepicker: any) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date && (date.after(this.fromDate) || date.equals(this.fromDate))) {
            this.toDate = date;
            this.selectedDate = this.formatDate(this.fromDate) + " - " + this.formatDate(date);
            datepicker.close();
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
    }

    formatDate(date, lang = 'br') {
        if(lang == 'us') {
            return  date.year + '-' + String(date.month).padStart(2, '0') + "-" + String(date.day).padStart(2, '0');
        }
        return String(date.day).padStart(2, '0') + '/' + String(date.month).padStart(2, '0') + "/" + date.year
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

    getResultado(params?) {
        this.showLoading = true;

        this.queryParams.dataInicial = this.formatDate(this.fromDate, 'us');
        this.queryParams.dataFinal = this.formatDate(this.toDate, 'us');

        const queryParams = {
            'data-inicial': this.queryParams.dataInicial,
            'data-final': this.queryParams.dataFinal
        };

        this.relatorioService.getResultado(queryParams).subscribe(
            result => {
                this.relatorio = result;
                this.resultado = parseFloat(result['total_apostado']) + parseFloat(result['cartao']) - parseFloat(result['saque'])
                    - parseFloat(result['total_comissao']) - parseFloat(result['total_premios']);
                this.showLoading = false;
                this.dataSaldoAnterior = moment(this.queryParams.dataInicial).subtract(1, 'day').format('DD/MM');
            },
            error => {
                this.relatorio = [];
                this.resultado = 0;
                this.showLoading = false;
                this.handleError(error);
            }
        );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    setShowTotalApostadoDetalhado() {
        if (this.detalhamentoHabilitado) {
            this.showTotalApostadoDetalhado = !this.showTotalApostadoDetalhado;
        }
    }

    setShowEntradas() {
        this.showEntradas = !this.showEntradas;
    }

    setShowSaidas() {
        this.showSaidas = !this.showSaidas;
    }
}
