import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Campeonato, Jogo } from './../../models';
import { JogoService, CampeonatoService, MessageService } from './../../services';

import { Subscription } from 'rxjs';
import * as moment from 'moment';


@Component({
    selector: 'app-futebol-jogos',
    templateUrl: 'jogos.component.html',
    styleUrls: ['jogos.component.css']
})

export class JogosComponent implements OnInit {
    diaEspecifico = true;
    campeonato: Campeonato = new Campeonato();
    campeonatos: Campeonato[];
    jogos: Jogo[];
    sub: Subscription;

    constructor(
        private jogoService: JogoService,
        private campeonatoService: CampeonatoService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {

        this.sub = this.route.queryParams.subscribe((params: any) => {
            if (params['campeonato']) {
                this.diaEspecifico = false;
                this.campeonato.nome = "TESTE";

                const campeonatoId = +params['campeonato'];
                const queryParams = { dataInicial: moment().format('YYYY-MM-DD') };

                this.campeonatoService.getJogos(campeonatoId, queryParams).subscribe(
                    jogos => {
                        this.jogos = jogos;
                    },
                    error => this.messageService.error(error)
                );
            } else {
                console.log('xd');
                let data = moment().format('YYYY-MM-DD');

                if (params['data']) {
                    data = moment(params['data']).format('YYYY-MM-DD');
                }

                this.diaEspecifico = true;
                const queryParams = { data: data };

                this.jogoService.getJogosPorData(queryParams).subscribe(
                    campeonatos => {
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
