import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { SidebarService } from 'src/app/services';

@Component({
  selector: 'app-aposta',
  templateUrl: './aposta.component.html',
  styleUrls: ['./aposta.component.css']
})
export class ApostaComponent implements OnInit {

    apostas = [];

    hoveredDate: NgbDate | null = null;
    selectedDate: string = '';

    fromDate: NgbDate | null;
    toDate: NgbDate | null;


    constructor(
        private sidebarService: SidebarService,
        private calendar: NgbCalendar,
        public formatter: NgbDateParserFormatter
    ) {
        this.fromDate = calendar.getToday();
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);

        this.selectedDate = this.fromDate.day + '/' + this.fromDate.month + "/" + this.fromDate.year + " - " + this.toDate.day + '/' + this.toDate.month + "/" + this.toDate.year;
    }

    ngOnInit(): void {
        this.sidebarService.changeItens({contexto: 'cambista'});

        this.apostas.push({
            status: "green",
            codigo: "134-f23",
            horario: "20/02/2022 10:10:01",
            apostador: "Joao Paulo",
            valor: "200",
            comissao: "300",
            premio: "Aguardando",
            pagamento: "",
        });

        this.apostas.push({
            status: "",
            codigo: "134-f23",
            horario: "20/02/2022 10:10:01",
            apostador: "Joao Paulo",
            valor: "200",
            comissao: "300",
            premio: "Aguardando",
            pagamento: "",
        });

        this.apostas.push({
            status: "red",
            codigo: "134-f23",
            horario: "20/02/2022 10:10:01",
            apostador: "Joao Paulo",
            valor: "200",
            comissao: "300",
            premio: "Aguardando",
            pagamento: "",
        });

        this.apostas.push({
            status: "green",
            codigo: "134-f23",
            horario: "20/02/2022 10:10:01",
            apostador: "Joao Paulo",
            valor: "200",
            comissao: "300",
            premio: "Aguardando",
            pagamento: "",
        });
    }

    onDateSelection(date: NgbDate, datepicker: any) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
            this.toDate = date;
            this.selectedDate = this.fromDate.day + '/' + this.fromDate.month + "/" + this.fromDate.year + " - " + date.day + '/' + date.month + "/" + date.year;
            datepicker.close();
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
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
}
