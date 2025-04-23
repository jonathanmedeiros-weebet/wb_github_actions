import {ActivatedRoute} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';

import {Observable, Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {CampeonatoService, MenuFooterService, MessageService, ParametrosLocaisService, SidebarService, SportIdService} from './../../../../services';
import {Campeonato} from '../../../../models';
import moment from 'moment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FutebolJogoComponent} from '../jogo/futebol-jogo.component';

@Component({
    selector: 'app-futebol-default-wrapper',
    templateUrl: 'futebol-default-wrapper.component.html',
    styleUrls: ['futebol-default-wrapper.component.css']
})
export class FutebolDefaultWrapperComponent implements OnInit, OnDestroy {
    jogoId;
    exibirMaisCotacoes = false;
    mobileScreen = false;
    showLoadingIndicator = true;
    campeonatos;
    oddsPrincipais = ['casa_90', 'empate_90', 'fora_90'];
    data;
    campeonato;
    campeonatoSelecionado = false;
    modalRef;
    unsub$ = new Subject();
    regiaoDestaqueSelecionada = false;
    ligasPopulares = '';
    ordemExibicaoCampeonatos = 'alfabetica';
    jogosBloqueados;

    constructor(
        private campeonatoService: CampeonatoService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private paramsService: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private modalService: NgbModal,
        private route: ActivatedRoute,
        private sportIdService: SportIdService
    ) {
    }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;

        this.jogosBloqueados = this.paramsService.getJogosBloqueados();

        this.ordemExibicaoCampeonatos = this.paramsService.getOpcoes().ordem_exibicao_campeonatos;

        if (this.ordemExibicaoCampeonatos === 'populares') {
            this.ligasPopulares = this.paramsService.getLigasPopulares().map((ligaPopular) => {
                return ligaPopular.api_id;
            });
        }

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
                let addDay = false;

                if (params['campeonato']) {
                    this.campeonatoSelecionado = true;
                    const campeonatoId = params['campeonato'];

                    queryParams = {
                        odds: this.oddsPrincipais,
                        data_final: dataLimiteTabela
                    };

                    this.campeonatoService.getCampeonato(campeonatoId, queryParams)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            (campeonato: Campeonato) => {
                                if (campeonato instanceof Array) {
                                    this.campeonatos = [];
                                } else {
                                    this.campeonatos = [campeonato];
                                }

                                this.showLoadingIndicator = false;
                                this.jogoId = this.extrairJogoId(this.campeonatos);
                            },
                            error => this.messageService.error(error)
                        );
                } else {
                    this.campeonatoSelecionado = false;
                    if (params['regiao_nome']) {
                        queryParams = {
                            odds: this.oddsPrincipais,
                            campeonatos_bloqueados: this.paramsService.getCampeonatosBloqueados(this.sportIdService.footballId),
                            data_final: dataLimiteTabela,
                            regiao_nome: params['regiao_nome']
                        };
                    } else {
                        queryParams = {
                            'sport_id': this.sportIdService.footballId,
                            'campeonatos_bloqueados': this.paramsService.getCampeonatosBloqueados(this.sportIdService.footballId),
                            'ligas_populares': this.ligasPopulares,
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

                            if (moment().isBefore(dataLimiteTabela, 'day')) {
                                addDay = true;
                            }
                        }

                        if (queryParams.data) {
                            this.data = queryParams.data;
                        }
                    }

                    this.regiaoDestaqueSelecionada = params['regiao_nome'];

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

                                this.campeonatos = this.campeonatos.filter(campeonato => {
                                    const jogosAtivos = campeonato.jogos.filter(jogo => !this.jogosBloqueados.includes(jogo.event_id));
                                    const jogosComOdds = campeonato.jogos.filter(jogo => jogo.cotacoes.length > 0);
                                    if (jogosAtivos.length > 0 && jogosComOdds.length > 0) {
                                        return campeonato;
                                    }
                                });
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
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados(this.sportIdService.footballId);
        const opcoes = this.paramsService.getOpcoes();
        const params = {
            'sport_id': this.sportIdService.footballId,
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
        if (this.mobileScreen) {
            this.modalRef = this.modalService.open(FutebolJogoComponent);
            this.modalRef.componentInstance.jogoId = this.jogoId;
        } else {
            this.exibirMaisCotacoes = exibirMaisCotacoes;
        }
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
