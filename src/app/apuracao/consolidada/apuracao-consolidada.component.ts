import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { RelatorioService, MessageService, ParametrosLocaisService } from './../../services';

@Component({
    selector: 'app-apuracao-consolidada',
    templateUrl: './apuracao-consolidada.component.html',
    styleUrls: ['./apuracao-consolidada.component.css']
})
export class ApuracaoConsolidadaComponent implements OnInit, OnDestroy {
    @Input() queryParams;
    relatorio;
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

        this.getResultado();
    }

    ngOnDestroy() { }

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
                this.showLoading = false;
            }
        );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
