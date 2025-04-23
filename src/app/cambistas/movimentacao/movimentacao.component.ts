import {Component} from '@angular/core';

import {SidebarService } from 'src/app/services';
import {CambistaService} from '../../shared/services/cambistas/cambista.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {NgbActiveModal, NgbModal, NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {InformativoModalComponent } from '../../shared/layout/modals/informativo-modal/informativo-modal.component';
import moment from 'moment';
import 'moment/min/locales';
@Component({
  selector: 'app-movimentacao',
  templateUrl: './movimentacao.component.html',
  styleUrls: ['./movimentacao.component.css']
})

export class MovimentacaoComponent{
    status = '';
    periodo = '';
    movimentacoes: [];
    hoveredDate: NgbDate | null = null;
    selectedDate = '';
    fromDate: NgbDate | null;
    toDate: NgbDate | null;
    periodoDe;
    periodoAte;
    queryParams;
    relatorio;
    resultado = 0;
    showLoading = false;
    dataSaldoAnterior;
    cambista = '';
    modalRef;
    params;
    mobileScreen: boolean;

    constructor(
        private sidebarService: SidebarService,
        public activeModal: NgbActiveModal,
        private calendar: NgbCalendar,
        private cambistaService: CambistaService,
        private messageService: MessageService,
        private modalService: NgbModal,
    ) { 
        const monday = moment().clone().isoWeekday(1);
        this.fromDate = NgbDate.from({year: monday.year(), month: monday.month() + 1, day: monday.date()});
        this.toDate = calendar.getNext(this.fromDate, 'd', 6);

        this.queryParams = {
            periodoDe: this.formatDate(this.fromDate, 'us'),
            periodoAte: this.formatDate(this.toDate, 'us')
        };

        this.selectedDate = this.formatDate(this.fromDate) + ' - ' + this.formatDate(this.toDate);
    
        this.handleFiltrar();        
    }

    ngOnInit(): void {
        this.mobileScreen = window.innerWidth <=1024;
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    handleFiltrar() {
        this.showLoading = true;
        const queryParams: any = {
            'periodoDe': this.queryParams.periodoDe,
            'periodoAte': this.queryParams.periodoAte,
        };

        this.cambistaService.listarMovimentacoes(this.queryParams).subscribe(
            result => {
                this.relatorio = result;
                this.movimentacoes = this.relatorio['movimentacoes'];
                this.showLoading = false;
            },
            error => {
                this.movimentacoes = [];
                this.showLoading = false;
                this.handleError(error);
            }
        );
    }

    onDateSelection(date: NgbDate, datepicker: any) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
            this.queryParams.periodoDe = this.formatDate(date, 'us');
        } else if (this.fromDate && !this.toDate && date && (date.after(this.fromDate) || date.equals(this.fromDate))) {
            this.toDate = date;
            this.queryParams.periodoAte = this.formatDate(date, 'us');
            this.selectedDate = this.formatDate(this.fromDate) + ' - ' + this.formatDate(date);
            datepicker.close();
        } else {
            this.toDate = null;
            this.queryParams.periodoAte = null;
            this.fromDate = date;
            this.queryParams.periodoDe = this.formatDate(date, 'us');
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

    openModal(movimentacao) {
        const params = {};

        let modalInformativo = InformativoModalComponent;

        this.params = {
            'movimentacaoId': movimentacao
        };
    
        this.cambistaService.buscarMovimentacaoId(this.params).subscribe(
                movimentacaoLocalizada => {
                    this.modalRef = this.modalService.open(modalInformativo, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true,
                        scrollable: true
                    });
                    this.modalRef.componentInstance.movimentacao = movimentacaoLocalizada;
                    this.modalRef.componentInstance.showCancel = true;

                    this.modalRef.result.then(
                        (result) => {
                            switch (result) {
                                default:
                                    break;
                            }
                        },
                        (reason) => {
                        }
                    );
                },
                error => {
                    this.handleError(error)
                }
            );
    }
}
