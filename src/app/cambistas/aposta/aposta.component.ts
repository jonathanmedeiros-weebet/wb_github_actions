import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { SidebarService, ApostaEsportivaService, AcumuladaoService, DesafioApostaService } from 'src/app/services';

@Component({
  selector: 'app-aposta',
  templateUrl: './aposta.component.html',
  styleUrls: ['./aposta.component.css']
})
export class ApostaComponent implements OnInit {

    apostas = [];

    queryParams;

    loading = false;
    apostador = "";
    status = "";

    tabSelected = 'esporte';

    hoveredDate: NgbDate | null = null;
    selectedDate: string = '';

    fromDate: NgbDate | null;
    toDate: NgbDate | null;

    unsub$ = new Subject();

    constructor(
        private sidebarService: SidebarService,
        private calendar: NgbCalendar,
        private apostaEsportivaService: ApostaEsportivaService,
        private acumuladaoService: AcumuladaoService,
        public desafioApostaService: DesafioApostaService,
        public formatter: NgbDateParserFormatter,
    ) {
        this.fromDate = calendar.getNext(calendar.getToday(), 'd', -60);
        this.toDate = calendar.getToday();

        this.queryParams = {
            dataInicial: this.formatDate(this.fromDate, 'us'),
            dataFinal: this.formatDate(this.toDate, 'us')
        }

        this.selectedDate = this.formatDate(this.fromDate) + " - " + this.formatDate(this.toDate);
    }

    ngOnInit(): void {
        this.sidebarService.changeItens({contexto: 'cambista'});

        this.getApostas();
    }

    getApostas() {
        this.loading = true;
        console.log('pegar apostas');
        const queryParams: any = {
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
                    apostas => {
                        this.apostas = apostas;
                        this.loading = false;
                    },
                    error => {
                        console.log(error);
                    }
                );
                break;
            case 'acumuladao':
                this.acumuladaoService.getApostas(queryParams)
                .subscribe(
                    apostas => {
                        this.apostas = apostas;
                        this.loading = false;
                    },
                    error => {
                        console.log(error);
                    }
                );
                break;
            case 'desafio':
                this.desafioApostaService.getApostas(queryParams)
                .subscribe(
                    apostas => {
                        this.apostas = apostas;
                        this.loading = false;
                    },
                    error => {
                        console.log(error);
                    }
                );
                break;
            case 'cassino':
                break;
            default:
                this.apostas = [];
                this.loading = false;
                break;
        }
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

    classNameAposta(resultado) {
        if(resultado == 'perdeu') {
            return 'red';
        } else if (resultado == 'ganhou') {
            return 'green';
        } else {
            return 'default';
        }
    }

    handleFiltrar() {
        console.log('teste');
        this.getApostas();
    }

    changeTab(tab) {
        this.tabSelected = tab;

        this.getApostas();
    }
}
