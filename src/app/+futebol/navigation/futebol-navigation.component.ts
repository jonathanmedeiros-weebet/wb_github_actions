import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Rx';
import { MessageService, JogoService } from '../../services';
import { Campeonato } from '../../models';

import * as moment from 'moment';

@Component({
    selector: 'futebol-navigation',
    templateUrl: 'futebol-navigation.component.html',
    styleUrls: ['futebol-navigation.component.css']
})
export class FutebolNavigationComponent implements OnInit, OnDestroy {
    amanha = moment().add(1, 'd').format('YYYY-MM-DD');
    campeonatos: Campeonato[];
    sub: Subscription;

    constructor(
        private jogoService: JogoService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.getJogos();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getJogos() {
        const params = { fields: ['_id', 'nome'] };

        this.sub = this.jogoService.getJogos(params).subscribe(
            campeonatos => this.campeonatos = campeonatos,
            error => this.messageService.error(error)
        );
    }
}
