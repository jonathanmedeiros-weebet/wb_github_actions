import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, switchMap, mergeMap, tap } from 'rxjs/operators';
import { ParametrosLocaisService, CampeonatoService, SidebarService, MessageService } from '../../../services';
import * as moment from 'moment';

@Component({
    selector: 'app-generico-wrapper',
    templateUrl: 'generico-wrapper.component.html',
    styleUrls: ['generico-wrapper.component.css']
})
export class GenericoWrapperComponent implements OnInit, OnDestroy {
    campeonatosBloqueados = [];
    contexto = null;
    sportId;
    mobileScreen = true;
    showLoadingIndicator = true;
    campeonatos;
    odds = [];
    aux = [];
    data;
    jogoId;
    exibirMaisCotacoes = false;
    deixarCampeonatosAbertos;
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private paramsService: ParametrosLocaisService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        // this.mobileScreen = window.innerWidth <= 668 ? true : false;
        const dataLimiteTabela = this.paramsService.getOpcoes().data_limite_tabela;
        this.campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados();

        this.route.data
            .pipe(
                switchMap((data: any) => {
                    this.sportId = data.sportId;
                    this.setContextoPorEsporte(data.sportId);

                    return this.route.queryParams;
                }),
                takeUntil(this.unsub$)
            )
            .subscribe((params: any) => {
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
                                this.jogoId = this.extrairJogoId(this.campeonatos);
                            },
                            error => this.messageService.error(error)
                        );
                } else {
                    const queryParams: any = {
                        'sport_id': this.sportId,
                        'campeonatos_bloqueados': this.campeonatosBloqueados,
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
                        if (!params['nome']) {
                            // queryParams.data = moment().format('YYYY-MM-DD');
                            queryParams.data_final = dataLimiteTabela;

                            const primeiraPagina = this.paramsService.getPrimeiraPagina();
                            if (primeiraPagina === 'principais') {
                                queryParams.campeonatos = this.paramsService.getCampeonatosPrincipais();
                            }
                        }
                    }

                    if (queryParams.data) {
                        this.data = queryParams.data;
                    }

                    this.campeonatoService.getCampeonatos(queryParams)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            campeonatos => {
                                this.campeonatos = campeonatos;
                                this.showLoadingIndicator = false;

                                this.jogoId = this.extrairJogoId(this.campeonatos);
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
        const opcoes = this.paramsService.getOpcoes();
        const params = {
            'sport_id': this.sportId,
            'campeonatos_bloqueados': this.campeonatosBloqueados,
            'data_final': opcoes.data_limite_tabela,
        };

        this.campeonatoService.getCampeonatos(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => this.sidebarService.changeItens(campeonatos, this.contexto),
                error => this.messageService.error(error)
            );
    }

    setContextoPorEsporte(sportId) {
        switch (sportId) {
            case '1':
                this.contexto = 'futebol';
                this.odds = ['casa_90', 'empate_90', 'fora_90'];;
                if (this.paramsService.getOddsPrincipais()) {
                    this.odds = this.paramsService.getOddsPrincipais();
                }
                break;
            case '9':
                this.contexto = 'combate';
                this.odds = ['cmbt_casa', 'cmbt_fora'];
                break;
            case '12':
                this.contexto = 'futebol-americano';
                this.odds = ['futebol_americano_casa', 'futebol_americano_fora'];
                break;
            case '13':
                this.contexto = 'tenis';
                this.odds = ['tenis_casa', 'tenis_fora'];
                break;
            default:
                break;
        }
    }

    receptorJogoSelecionadoId(jogoId) {
        this.jogoId = jogoId;
    }

    changeExibirMaisCotacoes(exibirMaisCotacoes) {
        this.exibirMaisCotacoes = exibirMaisCotacoes;
    }

    // Extrai id do primeiro jogo do primeiro campeonato
    extrairJogoId(campeonatos) {
        let jogoId = null;

        if (campeonatos.length > 1) {
            const jogos = campeonatos[0].jogos;

            let start = 0;
            let stop = false;

            while (!stop) {
                if (jogos.length > 1) {
                    jogoId = jogos[start]._id;
                    stop = true;
                } else if (jogos.length === 1) {
                    jogoId = jogos[start]._id;
                    stop = true;
                }

                start++;
            }
        } else if (campeonatos.length === 1) {
            const jogos = campeonatos[0].jogos;

            if (jogos.length > 1) {
                jogoId = jogos[0]._id;
            } else if (jogos.length === 1) {
                jogoId = jogos[0]._id;
            }
        }

        this.jogoId = jogoId;

        return jogoId;
    }
}
