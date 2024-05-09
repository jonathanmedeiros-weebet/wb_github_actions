import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import {
    CampeonatoService,
    MessageService,
    ParametrosLocaisService,
    SidebarService,
    MenuFooterService
} from '../../../services';
import * as moment from 'moment';

import * as sportsIds from '../../../shared/constants/sports-ids';

@Component({
    selector: 'app-generico-wrapper',
    templateUrl: 'generico-wrapper.component.html',
    styleUrls: ['generico-wrapper.component.css']
})
export class GenericoWrapperComponent implements OnInit, OnDestroy {
    campeonatosBloqueados = [];
    contexto = null;
    sportId;
    pagina;
    jogoId;
    exibirMaisCotacoes = false;
    mobileScreen = false;
    showLoadingIndicator = true;
    campeonatos;
    odds = [];
    data;
    esporte = '';
    campeonatoSelecionado = false;
    ligasPopulares = '';
    ordemExibicaoCampeonatos = 'alfabetica';
    unsub$ = new Subject();

    basketballId = sportsIds.BASKETBALL_ID;

    constructor(
        private campeonatoService: CampeonatoService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private paramsService: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        // this.mobileScreen = window.innerWidth <= 668 ? true : false;
        const dataLimiteTabela = this.paramsService.getOpcoes().data_limite_tabela;

        this.ordemExibicaoCampeonatos = this.paramsService.getOpcoes().ordem_exibicao_campeonatos;

        if (this.ordemExibicaoCampeonatos === 'populares') {
            this.ligasPopulares = this.paramsService.getLigasPopulares().map((ligaPopular) => {
                return ligaPopular.api_id;
            });
        }

        this.route.data
            .pipe(
                switchMap((data: any) => {
                    this.setContextoPorEsporte(data.sportId);
                    this.sportId = data.sportId;
                    this.campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados(this.sportId);
                    this.getCampeonatos2Sidebar();

                    return this.route.queryParams;
                }),
                takeUntil(this.unsub$)
            )
            .subscribe((params: any) => {
                this.showLoadingIndicator = true;

                if (params['campeonato']) {
                    this.campeonatoSelecionado = true;

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
                            },
                            error => this.messageService.error(error)
                        );
                } else {
                    this.campeonatoSelecionado = false;

                    const queryParams: any = {
                        'sport_id': this.sportId,
                        'campeonatos_bloqueados': this.campeonatosBloqueados,
                        'ligas_populares': this.ligasPopulares,
                        'odds': this.odds
                    };

                    let addDay = false;
                    const dt = params['data'] ? moment(params['data']) : moment();

                    if (dt.isSameOrBefore(dataLimiteTabela, 'day')) {
                        queryParams.data = dt.format('YYYY-MM-DD');
                    } else {
                        queryParams.data = dataLimiteTabela;
                    }

                    this.data = queryParams.data;

                    if (dt.isBefore(dataLimiteTabela, 'day')) {
                        addDay = true;
                    }

                    this.campeonatoService.getCampeonatos(queryParams)
                        .pipe(
                            switchMap(campeonatos => {
                                if (campeonatos.length === 0 && addDay) {
                                    queryParams.data = moment().add(1, 'd').format('YYYY-MM-DD');
                                    this.data = queryParams.data;
                                    return this.campeonatoService.getCampeonatos(queryParams);
                                } else {
                                    const observable = new Observable(subscriber => {
                                        subscriber.next(campeonatos);
                                        subscriber.complete();
                                    });
                                    return observable;
                                }
                            }),
                            takeUntil(this.unsub$)
                        )
                        .subscribe(
                            campeonatos => {
                                this.campeonatos = campeonatos;
                                this.showLoadingIndicator = false;
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


        if (this.sportId == 48242) {
            this.campeonatoService.getCampeonatosPorRegioes(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => {
                    const dados = {
                        itens: campeonatos,
                        contexto: this.contexto,
                        esporte: this.esporte
                    };

                    this.sidebarService.changeItens(dados);
                },
                error => this.messageService.error(error)
            );
        } else {
            this.campeonatoService.getCampeonatos(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => {
                    const dados = {
                        itens: campeonatos,
                        contexto: this.contexto,
                        esporte: this.esporte
                    };
                    this.sidebarService.changeItens(dados);
                },
                error => this.messageService.error(error)
            );
        }
    }

    receptorJogoSelecionadoId(jogoId) {
        this.jogoId = jogoId;
    }

    changeExibirMaisCotacoes(exibirMaisCotacoes) {
        this.setIsPagina(exibirMaisCotacoes);
        this.exibirMaisCotacoes = exibirMaisCotacoes;
    }

    setIsPagina(isPage) {
        if (this.mobileScreen) {
            this.menuFooterService.setIsPagina(isPage);
        }
    }

    setContextoPorEsporte(sportId) {
        this.contexto = 'esportes';

        switch (sportId) {
            case sportsIds.BOXING_ID:
                this.esporte = 'combate';
                this.odds = ['cmbt_casa', 'cmbt_fora'];
                break;
            case sportsIds.FOOTBALL_ID:
                this.esporte = 'futebol-americano';
                this.odds = ['futebol_americano_casa', 'futebol_americano_fora'];
                break;
            case sportsIds.TENNIS_ID:
                this.esporte = 'tenis';
                this.odds = ['tenis_casa', 'tenis_fora'];
                break;
            case sportsIds.ICE_HOCKEY_ID:
                this.esporte = 'hoquei-gelo';
                this.odds = ['hoquei_gelo_casa', 'hoquei_gelo_fora'];
                break;
            case sportsIds.BASKETBALL_ID:
                this.esporte = 'basquete';
                this.odds = ['bkt_casa', 'bkt_fora'];
                break;
            case sportsIds.FUTSAL_ID:
                this.esporte = 'futsal';
                this.odds = ['futsal_casa', 'futsal_empate', 'futsal_fora'];
                break;
            case sportsIds.VOLLEYBALL_ID:
                this.esporte = 'volei';
                this.odds = ['volei_casa', 'volei_fora'];
                break;
            case sportsIds.TABLE_TENNIS_ID:
                this.esporte = 'tenis-mesa';
                this.odds = ['tenis_mesa_casa', 'tenis_mesa_fora'];
                break;
            case sportsIds.E_SPORTS_ID:
                this.esporte = 'esports';
                this.odds = ['esports_casa', 'esports_fora'];
                break;
            default:
                break;
        }
    }
}
