import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { SidebarService, MessageService, ApostaEsportivaService, AcumuladaoService, DesafioApostaService, ParametrosLocaisService } from 'src/app/services';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';

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

    loteriasHabilitada;
    acumuladaoHabilitado;
    desafioHabilitado;
    cassinoHabilitado;

    tabSelected = 'esporte';

    hoveredDate: NgbDate | null = null;
    selectedDate: string = '';

    fromDate: NgbDate | null;
    toDate: NgbDate | null;

    totais = {
        valor: 0,
        premio: 0,
    }

    unsub$ = new Subject();

    constructor(
        private sidebarService: SidebarService,
        private calendar: NgbCalendar,
        private params: ParametrosLocaisService,
        private apostaEsportivaService: ApostaEsportivaService,
        private acumuladaoService: AcumuladaoService,
        private cassinoService: CasinoApiService,
        public desafioApostaService: DesafioApostaService,
        public formatter: NgbDateParserFormatter,
        public messageService: MessageService,
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

        this.loteriasHabilitada = this.params.getOpcoes().loterias;
        this.acumuladaoHabilitado = this.params.getOpcoes().acumuladao;
        this.desafioHabilitado = this.params.getOpcoes().desafio;
        this.cassinoHabilitado = this.params.getOpcoes().casino;

        this.getApostas();
    }

    getApostas() {
        this.loading = true;
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
                if (aposta.resultado === 'ganhou') {
                    this.totais.premio += aposta.premio;
                }
            }
        });

        this.loading = false;
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
}
