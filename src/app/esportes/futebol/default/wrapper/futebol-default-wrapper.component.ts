import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import {
    CampeonatoService,
    MessageService,
    ParametrosLocaisService,
    RegioesDestaqueService,
    SidebarService,
    MenuFooterService
} from './../../../../services';
import * as moment from 'moment';

@Component({
    selector: 'app-futebol-default-wrapper',
    templateUrl: 'futebol-default-wrapper.component.html',
    styleUrls: ['futebol-default-wrapper.component.css']
})
export class FutebolDefaultWrapperComponent implements OnInit, OnDestroy {
    jogoId;
    exibirMaisCotacoes = false;
    mobileScreen = true;
    showLoadingIndicator = true;
    campeonatos;
    oddsPrincipais = ['casa_90', 'empate_90', 'fora_90'];
    data;
    campeonato;
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private paramsService: ParametrosLocaisService,
        private regioesDestaqueService: RegioesDestaqueService,
        private menuFooterService: MenuFooterService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        // this.mobileScreen = window.innerWidth <= 668 ? true : false;

        this.sidebarService.itens
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                dados => {
                    if (dados.esporte !== 'futebol') {
                        this.getCampeonatos2Sidebar();
                    }
                }
            );

        const dataLimiteTabela = this.paramsService.getOpcoes().data_limite_tabela;

        if (this.paramsService.getOddsPrincipais()) {
            this.oddsPrincipais = this.paramsService.getOddsPrincipais();
        }

        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                let exibirDestaques = false;
                let queryParams: any;
                this.exibirMaisCotacoes = false;
                this.showLoadingIndicator = true;
                this.data = null;
                let isHoje = false;

                if (params['campeonato']) {
                    const campeonatoId = params['campeonato'];
                    queryParams = {
                        odds: this.oddsPrincipais,
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
                    if (params['regiao_nome']) {
                        queryParams = {
                            odds: this.oddsPrincipais,
                            campeonatos_bloqueados: this.paramsService.getCampeonatosBloqueados(1),
                            data_final: dataLimiteTabela,
                            regiao_nome: params['regiao_nome']
                        };
                    } else {
                        queryParams = {
                            'sport_id': 1,
                            'campeonatos_bloqueados': this.paramsService.getCampeonatosBloqueados(1),
                            'odds': this.oddsPrincipais
                        };

                        if (params['nome']) {
                            queryParams.nome = params['nome'];
                            queryParams.data_final = dataLimiteTabela;
                        }

                        if (params['data']) {
                            const dt = moment(params['data']);

                            if (dt.isSameOrBefore(dataLimiteTabela, 'day')) {
                                queryParams.data = dt.format('YYYY-MM-DD');
                            } else {
                                queryParams.data = dataLimiteTabela;
                            }
                        } else if (!params['nome']) {
                            exibirDestaques = true;
                            queryParams.data = moment().format('YYYY-MM-DD');

                            if (moment().day() !== 0) {
                                isHoje = true;
                            }
                        }

                        if (queryParams.data) {
                            this.data = queryParams.data;
                        }
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
                                this.jogoId = this.extrairJogoId(this.campeonatos);
                            },
                            error => this.messageService.error(error)
                        );
                }

                this.regioesDestaqueService.setExibirDestaques(exibirDestaques);
            });
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);

        this.unsub$.next();
        this.unsub$.complete();
    }

    getCampeonatos2Sidebar() {
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados(1);
        const opcoes = this.paramsService.getOpcoes();
        const params = {
            'sport_id': 1,
            'campeonatos_bloqueados': campeonatosBloqueados,
            'data_final': opcoes.data_limite_tabela,
        };

        this.campeonatoService.getCampeonatosPorRegioes(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => {
                    const dados = {
                        itens: campeonatos,
                        contexto: 'esportes',
                        esporte: 'futebol'
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
        this.menuFooterService.setIsPagina(exibirMaisCotacoes);
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
