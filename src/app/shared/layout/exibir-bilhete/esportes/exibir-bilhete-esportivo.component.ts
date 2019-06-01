import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { config } from './../../../config';
import {
    ParametrosLocaisService, HelperService, PrintService
} from '../../../../services';
import * as html2canvas from 'html2canvas';

@Component({
    selector: 'app-exibir-bilhete-esportivo',
    templateUrl: 'exibir-bilhete-esportivo.component.html',
    styleUrls: ['exibir-bilhete-esportivo.component.css']
})

export class ExibirBilheteEsportivoComponent implements OnInit {
    @ViewChild('cupom') cupom: ElementRef;
    @Input() aposta: any;
    modalRef;
    LOGO;
    opcoes;
    cambistaPaga;

    constructor(
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService,
        private printService: PrintService,
    ) { }

    ngOnInit() {
        this.LOGO = config.LOGO;

        this.opcoes = this.paramsService.getOpcoes();

        if (this.aposta.passador.percentualPremio > 0) {
            this.cambistaPaga = this.aposta.premio * ((100 - this.aposta.passador.percentualPremio) / 100);
        }
    }

    resultadoClass(item) {
        return {
            'ganhou': !item.removido ? item.resultado === 'ganhou' : false,
            'perdeu': !item.removido ? item.resultado === 'perdeu' : false,
            'cancelado': item.removido,
        };
    }

    shared() {
        const options = { logging: false };

        html2canvas(this.cupom.nativeElement, options).then((canvas) => {
            this.helperService.sharedSportsTicket(this.aposta, canvas.toDataURL());
        });
    }

    print() {
        if (this.aposta.tipo === 'esportes') {
            this.printService.sportsTicket(this.aposta);
        } else {
            this.printService.lotteryTicket(this.aposta);
        }
    }
}
