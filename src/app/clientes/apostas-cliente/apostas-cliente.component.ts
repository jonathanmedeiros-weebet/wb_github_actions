import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MessageService } from '../../shared/services/utils/message.service';
import * as moment from 'moment';
import { ParametrosLocaisService } from '../../shared/services/parametros-locais.service';
import { MenuFooterService } from '../../shared/services/utils/menu-footer.service';
import { SidebarService, ApostaEsportivaService, AcumuladaoService, DesafioApostaService, ApostaService, ApostaLoteriaService, LoteriaPopularService } from 'src/app/services';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import { forEach } from 'lodash';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApostaEncerramentoModalComponent, ApostaModalComponent, ConfirmModalComponent } from 'src/app/shared/layout/modals';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../services'
import { config } from '../../shared/config';

@Component({
    selector: 'app-apostas-cliente',
    templateUrl: './apostas-cliente.component.html',
    styleUrls: ['./apostas-cliente.component.css']
})
export class ApostasClienteComponent extends BaseFormComponent implements OnInit, OnDestroy {
    queryParams;
    dataInicial;
    dataFinal;
    esporteHabilitado;
    loteriasHabilitada;
    acumuladaoHabilitado;
    desafioHabilitado;
    casinoHabilitado;
    loteriaPopularHabilitada;
    activeId = 'esporte';
    paginaPrincipal: string;

    showLoading = true;
    showLoadingModal = true;
    encerramentoPermitido;

    modalRef;
    unsub$ = new Subject();

    totais = {
        valor: 0,
        premio: 0,
    };

    loading = false;

    tabSelected: string;

    hoveredDate: NgbDate | null = null;
    selectedDate: string = '';

    fromDate: NgbDate | null;
    toDate: NgbDate | null;

    apostas = [];

    isCliente;
    slug;

    appMobile;
    origin;

    constructor(
        private messageService: MessageService,
        private fb: UntypedFormBuilder,
        private params: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
        private apostaEsportivaService: ApostaEsportivaService,
        private acumuladaoService: AcumuladaoService,
        private cassinoService: CasinoApiService,
        private loteriaServie: ApostaLoteriaService,
        public desafioApostaService: DesafioApostaService,
        private loteriaPopularService: LoteriaPopularService,
        public formatter: NgbDateParserFormatter,
        private calendar: NgbCalendar,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private apostaService: ApostaService,
        public activeModal: NgbActiveModal,
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
        this.sidebarService.changeItens({ contexto: 'cliente' });

        this.esporteHabilitado = this.params.getOpcoes().esporte;
        this.loteriasHabilitada = this.params.getOpcoes().loterias;
        this.acumuladaoHabilitado = this.params.getOpcoes().acumuladao;
        this.desafioHabilitado = this.params.getOpcoes().desafio;
        this.casinoHabilitado = this.params.getOpcoes().casino;
        this.loteriaPopularHabilitada = this.params.getOpcoes().loteriaPopular;

        this.encerramentoPermitido = (['cliente', 'todos'].includes(this.params.getOpcoes().permitir_encerrar_aposta));

        this.createForm();
        this.menuFooterService.setIsPagina(true);

        this.paginaPrincipal = this.params.getOpcoes().pagina_inicial;

        if (this.paginaPrincipal == 'home' || this.paginaPrincipal == 'cassino_ao_vivo') {
            this.tabSelected = 'cassino';
        } else {
            this.tabSelected = this.paginaPrincipal;
        }

        this.getApostas();

        this.isCliente = this.auth.isCliente();
        this.slug = config.SLUG;

        this.appMobile = this.auth.isAppMobile();
        this.origin = this.appMobile ? '?origin=app' : '';
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    getTabs(): any[] {
        const tabs: any[] = [
            { id: 'esporte', label: 'geral.esporte', habilitado: this.esporteHabilitado },
            { id: 'cassino', label: 'geral.cassino', habilitado: this.casinoHabilitado },
            { id: 'acumuladao', label: 'geral.acumuladao', habilitado: this.acumuladaoHabilitado },
            { id: 'desafio', label: 'geral.desafio', habilitado: this.desafioHabilitado },
            { id: 'loteria', label: 'geral.loteria', habilitado: this.loteriasHabilitada },
            { id: 'loteria-popular', label: 'submenu.loteriaPopular', habilitado: this.loteriaPopularHabilitada }
        ];

        const sortedTabs = tabs.slice();
        let principalIndex = sortedTabs.findIndex(tab => tab.id === this.paginaPrincipal);

        if (this.paginaPrincipal === 'cassino' || this.paginaPrincipal === 'cassino_ao_vivo' || this.paginaPrincipal === 'home') {
            principalIndex = sortedTabs.findIndex(tab => tab.id === 'cassino');
        }

        if (principalIndex !== -1) {
            const principalTab = sortedTabs.splice(principalIndex, 1)[0];
            sortedTabs.unshift(principalTab);
        }

        return sortedTabs.filter(tab => tab.habilitado);
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
            case 'loteria':
                this.loteriaServie.getApostas(queryParams)
                    .subscribe(
                        apostas => this.handleResponse(apostas),
                        error => this.handleError(error)
                    );
                break;
            case 'loteria-popular':
                this.loteriaPopularService.getApostas(queryParams)
                    .subscribe(
                        apostas => this.handleResponse(apostas),
                        error => this.handleError(error)
                    );
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
                if (aposta.tipo === 'loteria') {
                    aposta.itens.forEach(lotteryItem => {
                        if (lotteryItem.status === 'ganhou') {
                            this.totais.premio += lotteryItem.premio;
                        }
                    });
                } else {
                    if (aposta.resultado === 'ganhou') {
                        this.totais.premio += aposta.premio;
                    }
                }
            }
        });

        this.loading = false;
        this.showLoading = false;
    }

    handleError(error: string) {
        this.messageService.error(error);
        this.loading = false;
        this.showLoading = false;
    }

    submit() {
        this.queryParams = this.form.value;

        let dataSeparadas = this.selectedDate.split(" - ");
        this.queryParams.dataFinal = this.formateDate(dataSeparadas[1]);
        this.queryParams.dataInicial = this.formateDate(dataSeparadas[0]);

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
        if (lang == 'us') {
            return date.year + '-' + String(date.month).padStart(2, '0') + "-" + String(date.day).padStart(2, '0');
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
        if (this.encerramentoPermitido && aposta.tipo == 'esportes') {
            modalAposta = ApostaEncerramentoModalComponent;
        } else {
            modalAposta = ApostaModalComponent;
        }

        let size = aposta.tipo == 'esportes' ? 'lg' : '';
        let typeWindow = aposta.tipo == 'esportes' ? 'modal-700' : '';

        this.apostaService.getAposta(aposta.id, params)
            .subscribe(
                apostaLocalizada => {
                    this.modalRef = this.modalService.open(modalAposta, {
                        ariaLabelledBy: 'modal-basic-title',
                        size: size,
                        centered: true,
                        windowClass: typeWindow
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

    formateDate(data) {
        let partes = data.split("/");
        let dataFormatada = partes[2] + "-" + partes[1] + "-" + partes[0];

        return dataFormatada;
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
