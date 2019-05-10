import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ParametrosLocaisService, CampeonatoService, SidebarService, MessageService } from './../../../../services';
import * as moment from 'moment';

@Component({
    selector: 'app-basquete-default-wrapper',
    templateUrl: 'basquete-default-wrapper.component.html',
    styleUrls: ['basquete-default-wrapper.component.css']
})
export class BasqueteDefaultWrapperComponent implements OnInit, OnDestroy {
    eventoId;
    exibirMaisCotacoes = false;
    mobileScreen = true;
    showLoadingIndicator = true;
    campeonatos;
    odds = ['bkt_casa', 'bkt_fora'];
    aux = [];
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private paramsService: ParametrosLocaisService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        // this.mobileScreen = window.innerWidth <= 668 ? true : false;

        this.sidebarService.itens
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                dados => {
                    if (dados.contexto !== 'basquete') {
                        this.getCampeonatos2Sidebar();
                    }
                }
            );

        const dataLimiteTabela = this.paramsService.getOpcoes().data_limite_tabela;

        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                this.exibirMaisCotacoes = false;
                this.showLoadingIndicator = true;


                if (params['campeonato']) {
                    const campeonatoId = params['campeonato'];
                    const queryParams: any = {
                        odds: this.odds,
                        data_final: dataLimiteTabela
                    };

                    this.campeonatoService.getCampeonato(campeonatoId, queryParams)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            campeonato => {
                                this.campeonatos = [campeonato];

                                this.showLoadingIndicator = false;
                                this.eventoId = this.extrairEventoId(this.campeonatos);
                            },
                            error => this.messageService.error(error)
                        );
                } else {
                    const queryParams: any = {
                        'sport_id': 18,
                        'campeonatos_bloqueados': this.paramsService.getCampeonatosBloqueados(),
                        'odds': this.odds
                    };

                    if (params['data']) {
                        const dt = moment(params['data']);
                        if (dt.isSameOrBefore(dataLimiteTabela, 'day')) {
                            queryParams.data = dt.format('YYYY-MM-DD');
                        } else {
                            queryParams.data = dataLimiteTabela;
                        }
                    } else {
                        queryParams.data = moment().format('YYYY-MM-DD');
                    }

                    this.campeonatoService.getCampeonatos(queryParams)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            campeonatos => {
                                this.campeonatos = campeonatos;
                                this.showLoadingIndicator = false;
                                this.eventoId = this.extrairEventoId(this.campeonatos);
                            },
                            error => this.messageService.error(error)
                        );
                }
            });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    getCampeonatos2Sidebar() {
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados();
        const opcoes = this.paramsService.getOpcoes();
        const params = {
            'sport_id': 18,
            'campeonatos_bloqueados': campeonatosBloqueados,
            'data_final': opcoes.data_limite_tabela,
        };

        this.campeonatoService.getCampeonatos(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => this.sidebarService.changeItens(campeonatos, 'basquete'),
                error => this.messageService.error(error)
            );
    }

    receptorEventoSelecionadoId(eventoId) {
        this.eventoId = eventoId;
    }

    changeExibirMaisCotacoes(exibirMaisCotacoes) {
        this.exibirMaisCotacoes = exibirMaisCotacoes;
    }

    // Extrai id do primeiro evento do primeiro campeonato
    extrairEventoId(campeonatos) {
        let eventoId = null;

        if (campeonatos.length > 1) {
            const jogos = campeonatos[0].jogos;

            let start = 0;
            let stop = false;

            while (!stop) {
                if (jogos.length > 1) {
                    eventoId = jogos[start]._id;
                    stop = true;
                } else if (jogos.length === 1) {
                    eventoId = jogos[start]._id;
                    stop = true;
                }

                start++;
            }
        } else if (campeonatos.length === 1) {
            const jogos = campeonatos[0].jogos;

            if (jogos.length > 1) {
                eventoId = jogos[0]._id;
            } else if (jogos.length === 1) {
                eventoId = jogos[0]._id;
            }
        }

        this.eventoId = eventoId;
        return eventoId;
    }
}
