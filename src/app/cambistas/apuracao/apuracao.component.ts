import {Component, OnInit} from '@angular/core';
import {RelatorioService} from '../../shared/services/relatorio.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import * as moment from 'moment';

@Component({
    selector: 'app-apuracao',
    templateUrl: './apuracao.component.html',
    styleUrls: ['./apuracao.component.css']
})
export class ApuracaoComponent implements OnInit {
    queryParams;
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
    dataInicial;
    dataFinal;
    detalhamentoHabilitado = false;

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

        this.detalhamentoHabilitado = this.loteriasHabilitada || this.acumuladaoHabilitado || this.desafioHabilitado;

        if (moment().day() === 0) {
            const startWeek = moment().startOf('week');
            this.dataInicial = startWeek.subtract(6, 'days');
            this.dataFinal = moment();

        } else {
            this.dataInicial = moment().startOf('week').add('1', 'day');
            this.dataFinal = moment();
        }

        this.queryParams = {
            dataInicial: this.dataInicial.format('YYYY-MM-DD'),
            dataFinal: this.dataFinal.format('YYYY-MM-DD')
        };

        this.dataSaldoAnterior = moment(this.dataInicial.format('YYYY-MM-DD')).subtract(1, 'day').format('DD/MM');

        this.getResultado();
    }

    getResultado(params?) {
        const queryParams = {
            'data-inicial': this.dataInicial.format('YYYY-MM-DD'),
            'data-final': this.dataFinal.format('YYYY-MM-DD')
        };

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
        if (this.detalhamentoHabilitado) {
            this.showTotalApostadoDetalhado = !this.showTotalApostadoDetalhado;
        }
    }
}
