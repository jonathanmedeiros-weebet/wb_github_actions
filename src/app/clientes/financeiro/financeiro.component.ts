import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MovimentacaoFinanceira} from '../../shared/models/clientes/movimentacao-financeira';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {MessageService} from '../../shared/services/utils/message.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';

@Component({
    selector: 'app-financeiro',
    templateUrl: './financeiro.component.html',
    styleUrls: ['./financeiro.component.css']
})
export class FinanceiroComponent extends BaseFormComponent implements OnInit {
    movimentacoesFinanceiras: MovimentacaoFinanceira[] = [];
    totalMovimentacoes;
    queryParams;
    dataInicial;
    dataFinal;
    showLoading = true;
    smallScreen = false;
    page = 1;
    movimentacoesContent;
    saldo;
    whatsapp;

    constructor(
        private clienteService: ClienteService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private el: ElementRef,
        private renderer: Renderer2,
        private paramsLocais: ParametrosLocaisService
    ) {
        super();
    }

    ngOnInit(): void {
        this.whatsapp = this.paramsLocais.getOpcoes().whatsapp.replace(/\D/g, '');

        if (window.innerWidth < 669) {
            this.smallScreen = true;
        } else {
            this.smallScreen = false;
        }

        this.definirAltura();

        this.createForm();
    }

    getMovimentacoes(queryParams?: any) {
        this.showLoading = true;
        this.clienteService.getMovimentacaoFinanceira(queryParams)
            .pipe()
            .subscribe(
                response => {
                    this.movimentacoesFinanceiras = response.results.movimentacoes;
                    this.totalMovimentacoes = response.pagination.total;
                    this.dataInicial = response.results.data_inicial;
                    this.dataFinal = response.results.data_final;
                    this.showLoading = false;
                },
                error => {
                    this.handleError(error);
                    this.movimentacoesFinanceiras = [];
                    this.showLoading = false;
                }
            );
    }

    definirAltura() {
        const altura = window.innerHeight - 69;
        this.movimentacoesContent = this.el.nativeElement.querySelector('.content-movimentacoes');
        this.renderer.setStyle(this.movimentacoesContent, 'height', `${altura}px`);
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
        this.queryParams = this.form.value;
        const queryParams: any = {
            'periodo': this.queryParams.periodo,
            'tipo': this.queryParams.tipo,
            'page': this.page
        };
        this.getMovimentacoes(queryParams);
    }
}
