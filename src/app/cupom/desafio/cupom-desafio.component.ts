import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subject } from 'rxjs';
import { config } from '../../shared/config';
import { ParametrosLocaisService } from 'src/app/services';

@Component({
    selector: 'app-cupom-desafio',
    templateUrl: 'cupom-desafio.component.html',
    styleUrls: ['cupom-desafio.component.css']
})
export class CupomDesafioComponent implements OnInit, OnDestroy {
    @Input() aposta;
    cambistaPaga;
    enabledBookie;
    LOGO = config.LOGO;
    unsub$ = new Subject();

    constructor( private paramsLocais: ParametrosLocaisService ) { }

    ngOnInit() {
        this.enabledBookie = this.paramsLocais.getOpcoes().modo_cambista;
        if (this.aposta.passador.percentualPremio > 0) {
            if (this.aposta.resultado) {
                this.cambistaPaga = this.aposta.premio * ((100 - this.aposta.passador.percentualPremio) / 100);
            } else {
                this.cambistaPaga = this.aposta.possibilidade_ganho * ((100 - this.aposta.passador.percentualPremio) / 100);
            }
        }
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    resultadoClass(resultado) {
        return {
            'ganhou': resultado === 'ganhou' || resultado === 'ganhando',
            'perdeu': resultado === 'perdeu' || resultado === 'perdendo'
        };
    }
}
