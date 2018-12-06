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
    informativoRodape;

    constructor() { }

    ngOnInit() {
        this.LOGO = config.LOGO;

        const opcoes = JSON.parse(localStorage.getItem('opcoes'));
        this.informativoRodape = opcoes.informativoRodape;
    }
}
