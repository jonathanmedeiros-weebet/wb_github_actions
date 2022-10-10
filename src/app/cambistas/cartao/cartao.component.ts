import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { SidebarService, CartaoService } from 'src/app/services';

@Component({
  selector: 'app-cartao',
  templateUrl: './cartao.component.html',
  styleUrls: ['./cartao.component.css']
})
export class CartaoComponent implements OnInit {

    loading = false;
    cartoes = [];
    apostador = '';
    queryParams;

    hoveredDate: NgbDate | null = null;
    selectedDate: string = '';

    fromDate: NgbDate | null;
    toDate: NgbDate | null;


    constructor(
        private cartaoService: CartaoService,
        private calendar: NgbCalendar,
        public formatter: NgbDateParserFormatter,
        private sidebarService: SidebarService,
    ) {
        this.fromDate = calendar.getNext(calendar.getToday(), 'd', -60);
        this.toDate = calendar.getToday();

        this.selectedDate = this.formatDate(this.fromDate) + " - " + this.formatDate(this.toDate);
    }

    ngOnInit(): void {
        this.sidebarService.changeItens({contexto: 'cambista'});

        this.getCartoes();
    }

    getCartoes(params?) {
        let queryParams: any = {
            'data-inicial': this.formatDate(this.fromDate, 'us'),
            'data-final': this.formatDate(this.toDate, 'us'),
            'sort': '-id'
        };

        if (params) {
            queryParams = {
                'data-inicial': params.dataInicial,
                'data-final': params.dataFinal,
                'apostador': params.apostador,
                'sort': '-id'
            };
        }

        this.cartaoService.getCartoes(queryParams)
            .subscribe(
                cartoes => {
                    this.cartoes = cartoes;
                    this.loading = false;
                },
                error => this.handleError(error)
            );
    }

    onDateSelection(date: NgbDate, datepicker: any) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
            this.queryParams.dataInicial = this.formatDate(date, 'us');
        } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
            this.toDate = date;
            this.queryParams.dataFinal = this.formatDate(date, 'us');
            this.selectedDate = this.formatDate(this.fromDate) + " - " + this.formatDate(date);
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

    validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
        const parsed = this.formatter.parse(input);
        return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    }

    handleFiltrar() {
        const params = {
            dataInicial: this.formatDate(this.fromDate, 'us'),
            dataFinal: this.formatDate(this.toDate, 'us'),
            apostador: this.apostador,
        }

        this.getCartoes(params);
    }

    handleError(error) {
        console.log(error);
    }
}
