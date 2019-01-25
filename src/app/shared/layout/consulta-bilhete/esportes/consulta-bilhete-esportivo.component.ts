import { Component, OnInit, Input } from '@angular/core';

import { config } from './../../../config';

@Component({
    selector: 'app-consulta-bilhete-esportivo',
    templateUrl: 'consulta-bilhete-esportivo.component.html',
    styleUrls: ['consulta-bilhete-esportivo.component.css']
})

export class ConsultaBilheteEsportivoComponent implements OnInit {
    @Input() aposta: any;
    LOGO;
    opcoes;
    cambistaPaga;

    constructor() { }

    ngOnInit() {
        this.LOGO = config.LOGO;

        this.opcoes = JSON.parse(localStorage.getItem('opcoes'));

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
}
