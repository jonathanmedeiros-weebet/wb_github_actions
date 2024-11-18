import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {UntypedFormBuilder} from '@angular/forms';
import {MovimentacaoFinanceira} from '../../shared/models/clientes/movimentacao-financeira';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {MessageService} from '../../shared/services/utils/message.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import {curveBumpX} from 'd3-shape';
import {FinanceiroService} from '../../shared/services/financeiro.service';
import {LayoutService, SidebarService } from 'src/app/services';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-financeiro',
    templateUrl: './financeiro.component.html',
    styleUrls: ['./financeiro.component.css']
})
export class FinanceiroComponent extends BaseFormComponent implements OnInit, OnDestroy {
    curveFunction = curveBumpX;

    movimentacoesFinanceiras: MovimentacaoFinanceira[] = [];
    totalMovimentacoes;
    queryParams;
    dataInicial;
    dataFinal;
    showLoading = true;
    smallScreen = false;
    page = 1;
    start;
    offset = 50;
    movimentacoesContent;
    saldo;
    whatsapp;
    mobileScreen;

    graphData;

    multi = [
        {
        'name': 'Depósito',
        'series': [
            {
                'name': 'Seg',
                'value': 25
            },
            {
                'name': 'Ter',
                'value': 100
            },
            {
                'name': 'Quar',
                'value': 80
            }
        ]},
        {
            'name': 'Saque',
            'series': [
                {
                    'name': 'Seg',
                    'value': 60
                },
                {
                    'name': 'Ter',
                    'value': 33
                },
                {
                    'name': 'Quar',
                    'value': 50
                }
            ]}
    ];

    view: any[] = [666];
    loadingScroll = false;

    constructor(
        private clienteService: ClienteService,
        private fb: UntypedFormBuilder,
        private messageService: MessageService,
        private el: ElementRef,
        private renderer: Renderer2,
        private paramsLocais: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private finairoService: FinanceiroService,
        private sidebarService: SidebarService,
        public activeModal: NgbActiveModal,
        public layoutService: LayoutService
    ) {
        super();
    }

    ngOnInit(): void {
        this.mobileScreen = window.innerWidth <= 1024;
        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cliente'});
            this.menuFooterService.setIsPagina(true);
        }

        this.whatsapp = this.paramsLocais.getOpcoes().whatsapp.replace(/\D/g, '');

        this.smallScreen = window.innerWidth < 669;

        this.definirAltura();

        this.createForm();
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    getMovimentacoes(queryParams?: any) {
        if (this.movimentacoesFinanceiras.length === 0) {
            this.showLoading = true;
        }
        this.clienteService.getMovimentacaoFinanceira(queryParams)
            .pipe()
            .subscribe(
                response => {
                    this.movimentacoesFinanceiras = [...this.movimentacoesFinanceiras, ...response.results.movimentacoes];
                    this.totalMovimentacoes = response.pagination.total;
                    this.dataInicial = response.results.data_inicial;
                    this.dataFinal = response.results.data_final;
                    this.page++;
                    this.showLoading = false;
                    this.loadingScroll = false;
                },
                error => {
                    this.handleError(error);
                    this.movimentacoesFinanceiras = [];
                    this.showLoading = false;
                    this.loadingScroll = false;
                }
            );
    }

    definirAltura() {
        const altura = window.innerHeight - 46;
        // this.movimentacoesContent = this.el.nativeElement.querySelector('.content-movimentacoes');
        // this.renderer.setStyle(this.movimentacoesContent, 'height', `${altura}px`);
    }

    exibirMais() {
        if(this.movimentacoesFinanceiras.length < this.totalMovimentacoes && this.loadingScroll === false) {
            this.loadingScroll = true;
            const queryParams: any = {
                'periodo': this.queryParams.periodo,
                'tipo': this.queryParams.tipo,
                'page': this.page
            };
            this.getMovimentacoes(queryParams);
            this.start = (this.page * this.offset);
        }
    }

    createForm() {
        this.form = this.fb.group({
            periodo: ['semana_atual'],
            tipo: [''],
        });
        this.submit();
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    submit() {
        this.page = 1;
        this.movimentacoesFinanceiras = [];
        this.queryParams = this.form.value;
        const queryParams: any = {
            'periodo': this.queryParams.periodo,
            'tipo': this.queryParams.tipo,
            'page': this.page
        };
        this.getMovimentacoes(queryParams);
    }
}
