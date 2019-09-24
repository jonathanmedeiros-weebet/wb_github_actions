import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';

import { RelatorioService, MessageService, ParametrosLocaisService } from './../../services';

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
    controlarCreditoCambista;
    loteriasHabilitada;

    constructor(
        private relatorioService: RelatorioService,
        private messageService: MessageService,
        private params: ParametrosLocaisService
    ) { }

    ngOnInit() {
        this.controlarCreditoCambista = this.params.controlarCreditoCambista();
        this.loteriasHabilitada = this.params.getOpcoes().loterias;
    }

    ngOnChanges() {
        this.showLoading = true;
        this.resultado = 0;
        this.getResultado();
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
                this.resultado = result['total_apostado'] + result['cartao'] - result['saque'] - result['total_comissao'] - result['total_premios'];
                this.showLoading = false;
            }
        );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
