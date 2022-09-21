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
    unsub$ = new Subject();

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
                    const queryParams: any = {
                        'sport_id': this.sportId,
                        'campeonatos_bloqueados': this.campeonatosBloqueados,
                        'odds': this.odds
                    };
                    let isHoje = false;

                    if (params['data']) {
                        const dt = moment(params['data']);
                        if (dt.isSameOrBefore(dataLimiteTabela, 'day')) {
                            queryParams.data = dt.format('YYYY-MM-DD');
                        } else {
                            queryParams.data = dataLimiteTabela;
                        }
                    } else {
                        queryParams.data = moment().format('YYYY-MM-DD');

                        if (moment().day() !== 0) {
                            isHoje = true;
                        }
                    }

                    if (queryParams.data) {
                        this.data = queryParams.data;
                    }

                    this.campeonatoService.getCampeonatos(queryParams)
                        .pipe(
                            switchMap(campeonatos => {
                                if (campeonatos.length === 0 && isHoje) {
                                    queryParams.data = moment().add(1, 'd').format('YYYY-MM-DD');
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
            case '9':
                this.esporte = 'combate';
                this.odds = ['cmbt_casa', 'cmbt_fora'];
                break;
            case '12':
                this.esporte = 'futebol-americano';
                this.odds = ['futebol_americano_casa', 'futebol_americano_fora'];
                break;
            case '13':
                this.esporte = 'tenis';
                this.odds = ['tenis_casa', 'tenis_fora'];
                break;
            case '17':
                this.esporte = 'hoquei-gelo';
                this.odds = ['hoquei_gelo_casa', 'hoquei_gelo_fora'];
                break;
            case '18':
                this.esporte = 'basquete';
                this.odds = ['bkt_casa', 'bkt_fora'];
                break;
            case '83':
                this.esporte = 'futsal';
                this.odds = ['futsal_casa', 'futsal_empate', 'futsal_fora'];
                break;
            case '91':
                this.esporte = 'volei';
                this.odds = ['volei_casa', 'volei_fora'];
                break;
            case '92':
                this.esporte = 'tenis-mesa';
                this.odds = ['tenis_mesa_casa', 'tenis_mesa_fora'];
                break;
            case '151':
                this.esporte = 'esports';
                this.odds = ['esports_casa', 'esports_fora'];
                break;
            default:
                break;
        }
    }
}
