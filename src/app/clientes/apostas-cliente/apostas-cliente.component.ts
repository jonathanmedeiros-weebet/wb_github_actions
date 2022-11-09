import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from '../../shared/services/utils/message.service';
import * as moment from 'moment';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import { SidebarService, ApostaEsportivaService, AcumuladaoService, DesafioApostaService, ApostaService } from 'src/app/services';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import { forEach } from 'lodash';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApostaEncerramentoModalComponent, ApostaModalComponent, ConfirmModalComponent } from 'src/app/shared/layout/modals';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-apostas-cliente',
    templateUrl: './apostas-cliente.component.html',
    styleUrls: ['./apostas-cliente.component.css']
})
export class ApostasClienteComponent extends BaseFormComponent implements OnInit, OnDestroy {
    queryParams;
    dataInicial;
    dataFinal;
    loteriasHabilitada;
    acumuladaoHabilitado;
    desafioHabilitado;
    casinoHabilitado;
    activeId = 'esporte';

    showLoading = false;
    encerramentoPermitido;

    modalRef;
    unsub$ = new Subject();

    totais = {
        valor: 0,
        premio: 0,
    }

    loading = false;

    tabSelected = 'esporte';

    hoveredDate: NgbDate | null = null;
    selectedDate: string = '';

    fromDate: NgbDate | null;
    toDate: NgbDate | null;

    apostas = [];

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        private params: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
        private apostaEsportivaService: ApostaEsportivaService,
        private acumuladaoService: AcumuladaoService,
        private cassinoService: CasinoApiService,
        public desafioApostaService: DesafioApostaService,
        public formatter: NgbDateParserFormatter,
        private calendar: NgbCalendar,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private apostaService: ApostaService
    ) {
        super();

        this.fromDate = calendar.getNext(calendar.getToday(), 'd', -6);
        this.toDate = calendar.getToday();

        this.queryParams = {
            dataInicial: this.formatDate(this.fromDate, 'us'),
            dataFinal: this.formatDate(this.toDate, 'us')
        }

        this.selectedDate = this.formatDate(this.fromDate) + " - " + this.formatDate(this.toDate);
    }

    ngOnInit() {
        this.sidebarService.changeItens({contexto: 'cliente'});

        this.loteriasHabilitada = this.params.getOpcoes().loterias;
        this.acumuladaoHabilitado = this.params.getOpcoes().acumuladao;
        this.desafioHabilitado = this.params.getOpcoes().desafio;
        this.casinoHabilitado = this.params.getOpcoes().casino;

        this.encerramentoPermitido = this.params.getOpcoes().permitir_encerrar_aposta;

        this.createForm();
        this.menuFooterService.setIsPagina(true);

        this.getApostas();
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    getApostas() {
        this.loading = true;

        const queryParams: any = {
            'data-inicial': this.queryParams.dataInicial,
            'data-final': this.queryParams.dataFinal,
            'status': this.queryParams.status,
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

    createForm() {
        this.form = this.fb.group({
            dataInicial: [this.formatDate(this.fromDate, 'us'), Validators.required],
            dataFinal: [this.formatDate(this.toDate, 'us'), Validators.required],
            status: [''],
        });

        this.submit();
    }

    handleResponse(response: any) {
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

    handleError(error: string) {
        this.messageService.error(error);
        this.loading = false;
    }

    submit() {
        this.queryParams = this.form.value;
        this.getApostas();
    }

    changeTab(tab) {
        this.tabSelected = tab;
        this.getApostas();
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

    openModal(aposta) {
        this.showLoading = true;
        const params = {};

        if (aposta.id === this.apostas[0].id) {
            params['verificar-ultima-aposta'] = 1;
        }

        let modalAposta;
        if (this.encerramentoPermitido) {
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

    /*handleCancel(aposta) {
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

        console.log("APOSTA", aposta);

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
    }*/
}
