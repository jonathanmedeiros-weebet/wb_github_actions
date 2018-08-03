import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Rx';
import { MessageService, JogoService, BilheteEsportivoService } from '../../services';
import { Campeonato, BilheteEsportivo } from '../../models';

import * as moment from 'moment';

@Component({
    selector: 'app-futebol',
    templateUrl: 'futebol.component.html',
    styleUrls: ['futebol.component.css']
})
export class FutebolComponent implements OnInit, OnDestroy {
    amanha = moment().add(1, 'd').format('YYYY-MM-DD');
    campeonatos: Campeonato[];
    bilhete: BilheteEsportivo;
    bilheteSub: Subscription;
    sub: Subscription;

    constructor(
        private jogoService: JogoService,
        private bilheteService: BilheteEsportivoService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.getJogos();

        this.bilhete = this.bilheteService.getBilhete();
        this.bilheteSub = this.bilheteService.emitirBilhete.subscribe(bilhete => this.bilhete = bilhete);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.bilheteSub.unsubscribe();
    }

    getJogos() {
        const params = { fields: ['_id', 'nome'] };

        this.sub = this.jogoService.getJogos(params).subscribe(
            campeonatos => this.campeonatos = campeonatos,
            error => this.messageService.error(error)
        );
    }
}
