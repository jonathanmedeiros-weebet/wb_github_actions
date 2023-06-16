import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {
    AcumuladaoService,
    ApostaEsportivaService,
    ApostaLoteriaService,
    ApostaService,
    AuthService,
    DesafioApostaService,
    MenuFooterService,
    MessageService,
    ParametrosLocaisService,
    SidebarService
} from 'src/app/services';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
import {NgbActiveModal, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApostaEncerramentoModalComponent, ApostaModalComponent, ConfirmModalComponent} from 'src/app/shared/layout/modals';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {BaseFormComponent} from '../../base-form/base-form.component';
import * as moment from 'moment/moment';
import { config } from '../../../../shared/config';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-cliente-apostas-modal',
    templateUrl: './cliente-apostas-modal.component.html',
    styleUrls: ['./cliente-apostas-modal.component.css']
})
export class ClienteApostasModalComponent extends BaseFormComponent implements OnInit, OnDestroy {
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
    };

    loading = false;

    tabSelected = 'esporte';

    hoveredDate: NgbDate | null = null;
    selectedDate: string = '';

    fromDate: NgbDate | null;
    toDate: NgbDate | null;

    apostas = [];
    mobileScreen: boolean;
    slug;

    pronomesCliente = {'pt': 'Você ', 'en': 'You '};
    pronomeCliente;

    origin;
    appMobile;

    constructor(
        private messageService: MessageService,
        private fb: UntypedFormBuilder,
        private params: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
        private apostaEsportivaService: ApostaEsportivaService,
        public formatter: NgbDateParserFormatter,
        private calendar: NgbCalendar,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private apostaService: ApostaService,
        public activeModal: NgbActiveModal,
        private acumuladaoService: AcumuladaoService,
        private desafioApostaService: DesafioApostaService,
        private cassinoService: CasinoApiService,
        private loteriaService: ApostaLoteriaService,
        private translate: TranslateService,
        private auth: AuthService
    ) {
        super();

        this.fromDate = calendar.getNext(calendar.getToday(), 'd', -6);
        this.toDate = calendar.getToday();

        this.queryParams = {
            dataInicial: this.formatDate(this.fromDate, 'us'),
            dataFinal: this.formatDate(this.toDate, 'us')
        };

        this.selectedDate = this.formatDate(this.fromDate) + ' - ' + this.formatDate(this.toDate);
    }

    ngOnInit() {
        this.slug = config.SLUG;
        this.mobileScreen = window.innerWidth <= 1024;
        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cliente'});
            this.menuFooterService.setIsPagina(true);
        }

        this.loteriasHabilitada = this.params.getOpcoes().loterias;
        this.acumuladaoHabilitado = this.params.getOpcoes().acumuladao;
        this.desafioHabilitado = this.params.getOpcoes().desafio;

        this.casinoHabilitado = this.params.getOpcoes().casino;

        this.encerramentoPermitido = (['cliente', 'todos'].includes(this.params.getOpcoes().permitir_encerrar_aposta));
        this.createForm();

        this.getApostas();

        this.pronomeCliente = this.pronomesCliente[this.translate.currentLang];
        this.translate.onLangChange.subscribe(change => this.pronomeCliente = this.pronomesCliente[change.lang]);

        this.appMobile = this.auth.isAppMobile();
        this.origin = this.appMobile ? '?origin=app':'';
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

        switch (this.queryParams.tipo) {
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

    createForm() {
        this.form = this.fb.group({
            dataInicial: [this.formatDate(this.fromDate, 'us'), Validators.required],
            dataFinal: [this.formatDate(this.toDate, 'us'), Validators.required],
            status: [''],
            tipo: ['esporte'],
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
        this.tabSelected = this.queryParams.tipo;
        this.getApostas();
    }

    changeTab(tab) {
        this.tabSelected = tab;
        this.getApostas();
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

    onDateSelection(date: NgbDate, datepicker: any) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
            this.queryParams.dataInicial = this.formatDate(date, 'us');
        } else if (this.fromDate && !this.toDate && date && (date.after(this.fromDate) || date.equals(this.fromDate))) {
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
        if (this.encerramentoPermitido && aposta.tipo == 'esportes' && !aposta.is_bonus) {
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

    getDataFormatada(value, format) {
        return moment(value).format(format);;
    }
}
