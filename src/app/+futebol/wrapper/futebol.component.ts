import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Rx';
import { MessageService, JogoService } from '../../services';
import { Campeonato } from '../../models';

import * as moment from 'moment';

@Component({
    selector: 'app-futebol',
    templateUrl: 'futebol.component.html',
    styleUrls: ['futebol.component.css']
})
export class FutebolComponent implements OnInit, OnDestroy {
    hoje = moment().format('YYYY-MM-DD');
    amanha = moment().add(1, 'd').format('YYYY-MM-DD');
    campeonatos: Campeonato[];
    sub: Subscription;

    constructor(
        private jogoService: JogoService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.getJogosPorData(this.hoje);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getJogosPorData(data) {
        const params = { data: data };

        this.jogoService.getJogosPorData(params).subscribe(
            campeonatos => this.campeonatos = campeonatos,
            error => this.messageService.error(error)
        );
    }
}
