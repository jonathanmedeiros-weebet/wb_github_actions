import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services';
import {CambistaService} from '../../shared/services/cambistas/cambista.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {NgbActiveModal, NgbCalendar, NgbDate, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import 'moment/min/locales';
@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.css']
})

export class FinanceiroComponent{
    loading = false;
    status = '';
    periodo = '';

    movimentacoes: [];
    hoveredDate: NgbDate | null = null;
    selectedDate = '';
    fromDate: NgbDate | null;
    toDate: NgbDate | null;
    dataInicial;
    dataFinal;
    queryParams;
    relatorio;
    resultado = 0;
    showLoading = true;
    dataSaldoAnterior;
    cambista = '';

    constructor(
        private sidebarService: SidebarService,
        public activeModal: NgbActiveModal,
        private calendar: NgbCalendar,
        private cambistaService: CambistaService,
        private messageService: MessageService,
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
        this.sidebarService.changeItens({contexto: 'cambista'});
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    handleFiltrar() {
        
        this.loading = true;
        const queryParams: any = {
            'data-inicial': this.queryParams.dataInicial,
            'data-final': this.queryParams.dataFinal,
        };

        this.cambistaService.movimentacao(this.queryParams).subscribe(
            result => {
                this.relatorio = result;
                this.movimentacoes = this.relatorio['movimentacoes'];
            },
            error => {
             
                this.relatorio = [];
                this.resultado = 0;
                this.showLoading = false;
                this.handleError(error);
            }
        );

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

    classNameCorTipoMovimentacao(tipo) {
        if (tipo == 'D') {
            return 'red';
        } else if (tipo == 'C') {
            return 'green';
        } else {
            return 'default';
        }
    }

    classNameDescricaoMovimentacao(tipo) {
        if (tipo == 'D') {
            return 'Débito';
        } else if (tipo == 'C') {
            return 'Crédito';
        } else {
            return 'default';
        }
    }
}
