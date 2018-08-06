import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Campeonato, Jogo } from './../../models';
import { JogoService, CampeonatoService, MessageService } from './../../services';

import { Subscription } from 'rxjs';
import * as moment from 'moment';


@Component({
    selector: 'futebol-jogos',
    templateUrl: 'jogos.component.html',
    styleUrls: ['jogos.component.css']
})

export class JogosComponent implements OnInit {
    diaEspecifico = true;
    campeonato: Campeonato = new Campeonato();
    campeonatos: Campeonato[];
    sub: Subscription;

    constructor(
        private jogoService: JogoService,
        private campeonatoService: CampeonatoService,
        private messageService: MessageService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.sub = this.route.queryParams.subscribe((params: any) => {
            if (params['campeonato']) {
                const campeonatoId = +params['campeonato'];

                this.campeonatoService.getCampeonato(campeonatoId).subscribe(
                    campeonato => {
                        this.diaEspecifico = false;
                        this.campeonato = campeonato;
                    },
                    error => this.messageService.error(error)
                );
            } else {
                let queryParams = {};

                if (params['data']) {
                    const data = moment(params['data']).format('YYYY-MM-DD');
                    queryParams = { data: data };
                } else {
                    queryParams = { data: moment().format('YYYY-MM-DD') };
                }

                this.jogoService.getJogos(queryParams).subscribe(
                    campeonatos => {
                        this.diaEspecifico = true;
                        this.campeonatos = campeonatos;
                    },
                    error => this.messageService.error(error)
                );
            }

        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
