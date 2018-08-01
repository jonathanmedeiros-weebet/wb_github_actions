import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Rx';
import { MessageService, JogoService, CampeonatoService } from '../services';
import { Jogo, Campeonato, Cotacao } from '../models';

import * as _ from 'lodash';
import * as clone from 'clone';
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
    campeonatoAtual: Campeonato;
    diaEspecifico = true;
    jogos: Jogo[] = [];
    sub: Subscription;

    constructor(
        private jogoService: JogoService,
        private campeonatoService: CampeonatoService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.getJogosPorData(this.hoje);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    success(msg) {
        this.messageService.success(msg);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    getJogosPorData(data) {
        this.diaEspecifico = true;
        const params = { data: data };

        this.jogoService.getJogosPorData(params).subscribe(
            campeonatos => this.campeonatos = campeonatos,
            error => this.messageService.error(error)
        );
    }

    getJogosPorCampeonato(campeonato) {
        this.diaEspecifico = false;
        this.campeonatoAtual = campeonato;

        const params = { dataInicial: moment().format('YYYY-MM-DD') };
        this.campeonatoService.getJogos(campeonato._id, params).subscribe(
            jogos => this.jogos = jogos,
            error => this.messageService.error(error)
        );
    }
}
