import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ParametrosLocaisService, CampeonatoService, SidebarService, MessageService } from './../../../../services';
import * as moment from 'moment';
import * as isEmpty from 'lodash.isempty';

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
    campeonatosPrincipais;
    deixarCampeonatosAbertos;
    oddsPrincipais = ['casa_90', 'empate_90', 'fora_90'];
    refreshIntervalId;
    aux = [];
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private paramsService: ParametrosLocaisService,
        private route: ActivatedRoute,
        private router: Router,
        private el: ElementRef,
        private renderer: Renderer2,
    ) { }

    ngOnInit() {
        // this.mobileScreen = window.innerWidth <= 668 ? true : false;

        this.sidebarService.itens
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                dados => {
                    if (dados.contexto !== 'futebol') {
                        this.getCampeonatos2Sidebar();
                    }
                }
            );

        const dataLimiteTabela = this.paramsService.getOpcoes().data_limite_tabela;
        if (this.paramsService.getOddsPrincipais()) {
            this.oddsPrincipais = this.paramsService.getOddsPrincipais();
            // oddsPrincipais = oddsPrincipais.slice(0, 5);
        }

        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                this.exibirMaisCotacoes = false;
                this.showLoadingIndicator = true;
                this.campeonatosPrincipais = this.paramsService.getCampeonatosPrincipais();

                // Cache Campeonatos
                let campeonatosStorage;
                const campUrl = sessionStorage.getItem('camp_url');
                if (sessionStorage.getItem('campeonatos')) {
                    campeonatosStorage = JSON.parse(sessionStorage.getItem('campeonatos'));
                }

                if (campeonatosStorage && campeonatosStorage.length > 0 && this.router.url === campUrl) {
                    if (campeonatosStorage.length === 1) {
                        this.deixarCampeonatosAbertos = true;
                    }
                    this.campeonatos = campeonatosStorage;

                    this.showLoadingIndicator = false;
                    this.jogoId = this.extrairJogoId(this.campeonatos);
                } else {
                    // Sem Cache
                    if (params['campeonato']) {
                        this.deixarCampeonatosAbertos = true;
                        const campeonatoId = params['campeonato'];
                        const queryParams: any = {
                            odds: this.oddsPrincipais,
                            data_final: dataLimiteTabela
                        };

                        this.campeonatoService.getCampeonato(campeonatoId, queryParams)
                            .pipe(takeUntil(this.unsub$))
                            .subscribe(
                                campeonato => {
                                    this.campeonatos = [campeonato];

                                    sessionStorage.setItem('campeonatos', JSON.stringify(this.campeonatos));
                                    sessionStorage.setItem('camp_url', this.router.url);

                                    this.showLoadingIndicator = false;
                                    this.jogoId = this.extrairJogoId(this.campeonatos);
                                },
                                error => this.messageService.error(error)
                            );
                    } else {
                        const queryParams: any = {
                            'sport_id': 1,
                            'campeonatos_bloqueados': this.paramsService.getCampeonatosBloqueados(),
                            'odds': this.oddsPrincipais
                        };

                        if (params['nome']) {
                            this.deixarCampeonatosAbertos = true;
                            queryParams.nome = params['nome'];
                        } else {
                            this.deixarCampeonatosAbertos = false;
                        }

                        if (params['data']) {
                            const dt = moment(params['data']);
                            if (dt.isSameOrBefore(dataLimiteTabela, 'day')) {
                                queryParams.data = dt.format('YYYY-MM-DD');
                            } else {
                                queryParams.data = dataLimiteTabela;
                            }
                        } else {
                            // Verifica se os campeonatos de hoje devem vim abertos
                            if (!params['nome']) {
                                this.deixarCampeonatosAbertos = this.paramsService.getExibirCampeonatosHojeExpandido();
                            }

                            queryParams.data = moment().format('YYYY-MM-DD');
                        }

                        this.campeonatoService.getCampeonatos(queryParams)
                            .pipe(takeUntil(this.unsub$))
                            .subscribe(
                                campeonatos => {
                                    sessionStorage.setItem('campeonatos', JSON.stringify(campeonatos));
                                    sessionStorage.setItem('camp_url', this.router.url);

                                    this.campeonatos = campeonatos;
                                    this.showLoadingIndicator = false;
                                    this.jogoId = this.extrairJogoId(this.campeonatos);
                                },
                                error => this.messageService.error(error)
                            );
                    }
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
            'sport_id': 1,
            'campeonatos_bloqueados': campeonatosBloqueados,
            'data_final': opcoes.data_limite_tabela,
        };

        this.campeonatoService.getCampeonatosPorRegioes(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => this.sidebarService.changeItens(campeonatos, 'futebol'),
                error => this.messageService.error(error)
            );
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
