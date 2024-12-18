import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SidebarService, CartaoService, MessageService } from 'src/app/services';
import { ConfirmModalComponent } from 'src/app/shared/layout/modals';

@Component({
  selector: 'app-solicitacao-saque',
  templateUrl: './solicitacao-saque.component.html',
  styleUrls: ['./solicitacao-saque.component.css']
})
export class SolicitacaoSaqueComponent implements OnInit {

    isMobile = false;

    loading = false;
    solicitacoes = [];
    status = '1';
    queryParams;

    modalRef;

    hoveredDate: NgbDate | null = null;
    selectedDate: string = '';

    fromDate: NgbDate | null;
    toDate: NgbDate | null;

    constructor(
        private calendar: NgbCalendar,
        public formatter: NgbDateParserFormatter,
        private cartaoService: CartaoService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
    ) {
        if (window.innerWidth <= 1024) {
            this.isMobile = true;
        }

        this.fromDate = calendar.getNext(calendar.getToday(), 'd', -7);
        this.toDate = calendar.getToday();

        this.selectedDate = this.formatDate(this.fromDate) + ' - ' + this.formatDate(this.toDate);
    }

    ngOnInit(): void {
        if (window.innerWidth >= 1025) {
            this.sidebarService.changeItens({contexto: 'cambista'});
        }

        this.getSolicitacoesSaque();
    }

    getSolicitacoesSaque(params?) {
        let queryParams: any = {
            'data-inicial': this.formatDate(this.fromDate, 'us'),
            'data-final': this.formatDate(this.toDate, 'us'),
            'aprovado': this.status
        };

        if (params) {
            queryParams = {
                'data-inicial': params.dataInicial,
                'data-final': params.dataFinal,
                'aprovado': params.aprovado
            };
        }

        this.cartaoService.getSolicitacoesSaque(queryParams)
            .subscribe(
                solicitacoes => {
                    this.solicitacoes = solicitacoes;
                    this.loading = false;
                },
                error => this.handleError(error)
            );
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

    setPagamento(solicitacao) {
        this.modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
        this.modalRef.componentInstance.title = 'Pagamento';
        this.modalRef.componentInstance.msg = 'Tem certeza que deseja confirma o pagamento?';

        this.modalRef.result.then(
            (result) => {
                this.cartaoService.setPagamento({ id: solicitacao.id, version: solicitacao.version })
                    .subscribe(
                        () => {
                            this.messageService.success('PAGAMENTO REGISTRADO COM SUCESSO!');
                            this.getSolicitacoesSaque();
                        },
                        error => this.handleError(error)
                    );
            },
            (reason) => { }
        );
    }

    statusSolicitacao(solicitacao) : string {
        if(solicitacao.pago) {
            return "PAGO";
        }

        if(solicitacao.aprovado) {
            return "APROVADO";
        }

        return "PENDENTE";
    }

    handleFiltrar() {
        this.getSolicitacoesSaque();
    }

    handleError(error) {
        console.log(error)
    }
}
