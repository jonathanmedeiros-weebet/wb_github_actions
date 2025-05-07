import {Component, OnInit, OnDestroy, Input, OnChanges} from '@angular/core';

import {RelatorioService, MessageService, ParametrosLocaisService} from './../../services';
import moment from 'moment';

@Component({
    selector: 'app-apuracao-consolidada',
    templateUrl: './apuracao-consolidada.component.html',
    styleUrls: ['./apuracao-consolidada.component.css']
})
export class ApuracaoConsolidadaComponent implements OnInit, OnChanges {
    @Input() queryParams;
    relatorio;
    resultado = 0;
    showLoading = true;
    modoContaCorrente;
    loteriasHabilitada;
    acumuladaoHabilitado;
    desafioHabilitado;
    dataSaldoAnterior;
    showEntradas = false;
    showSaidas = false;
    showTotalApostadoDetalhado = false;

    constructor(
        private relatorioService: RelatorioService,
        private messageService: MessageService,
        private params: ParametrosLocaisService
    ) {
    }

    ngOnInit() {
        this.modoContaCorrente = this.params.modoContaCorrente();
        this.loteriasHabilitada = this.params.getOpcoes().loterias;
        this.acumuladaoHabilitado = this.params.getOpcoes().acumuladao;
        this.desafioHabilitado = this.params.getOpcoes().desafio;
    }

    ngOnChanges() {
        this.showLoading = true;
        this.resultado = 0;
        this.getResultado();
        this.dataSaldoAnterior = moment(this.queryParams.dataInicial).subtract(1, 'day').format('DD/MM');
    }

    getResultado(params?) {
        let queryParams: any = {
            'data-inicial': this.queryParams.dataInicial,
            'data-final': this.queryParams.dataFinal
        };

        if (params) {
            queryParams = {
                'data-inicial': params.dataInicial,
                'data-final': params.dataFinal
            };
        }

        this.relatorioService.getResultado(queryParams).subscribe(
            result => {
                this.relatorio = result;
                this.resultado = parseFloat(result['total_apostado']) + parseFloat(result['cartao']) - parseFloat(result['saque'])
                    - parseFloat(result['total_comissao']) - parseFloat(result['total_premios']);
                this.showLoading = false;
            },
            error => {
                this.relatorio = [];
                this.resultado = 0;
                this.showLoading = false;
                this.handleError(error);
            }
        );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    setShowTotalApostadoDetalhado() {
        if (this.loteriasHabilitada || this.acumuladaoHabilitado || this.desafioHabilitado) {
            this.showTotalApostadoDetalhado = !this.showTotalApostadoDetalhado;
        }
    }
}
