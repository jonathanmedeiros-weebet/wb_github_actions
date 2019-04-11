import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { config } from './../../../config';
import { ParametrosLocaisService, HelperService } from '../../../../services';

import * as html2canvas from 'html2canvas';

@Component({
    selector: 'app-exibir-bilhete-esportivo',
    templateUrl: 'exibir-bilhete-esportivo.component.html',
    styleUrls: ['exibir-bilhete-esportivo.component.css']
})

export class ExibirBilheteEsportivoComponent implements OnInit {
    @ViewChild('cupom') cupom: ElementRef;
    @ViewChild('downloadLink') downloadLink: ElementRef;
    @Input() aposta: any;
    LOGO;
    opcoes;
    cambistaPaga;

    constructor(
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService
    ) { }

    ngOnInit() {
        this.LOGO = config.LOGO;

        this.opcoes = this.paramsService.getOpcoes();

        if (this.opcoes.percentual_premio_cambista > 0) {
            this.cambistaPaga = this.aposta.premio * ((100 - this.opcoes.percentual_premio_cambista) / 100);
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
}
