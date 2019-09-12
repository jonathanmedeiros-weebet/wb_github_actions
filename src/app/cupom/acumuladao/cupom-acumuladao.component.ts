import { Component, OnInit, Input } from '@angular/core';

import { AcumuladaoAposta } from './../../models';

@Component({
    selector: 'app-cupom-acumuladao',
    templateUrl: 'cupom-acumuladao.component.html',
    styleUrls: ['cupom-acumuladao.component.css']
})
export class CupomAcumuladaoComponent implements OnInit {
    @Input() aposta: AcumuladaoAposta;

    constructor() { }

    ngOnInit() { }

    resultadoClass(resultado) {
        return {
            'ganhou': resultado === 'ganhou' || resultado === 'acertou',
            'perdeu': resultado === 'perdeu' || resultado === 'errou'
        };
    }
}
