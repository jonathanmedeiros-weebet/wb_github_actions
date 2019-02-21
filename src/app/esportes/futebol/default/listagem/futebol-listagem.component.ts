import { Component, OnInit, OnDestroy, Renderer2, ElementRef, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Campeonato, Jogo, ItemBilheteEsportivo } from './../../../../models';
import { ParametrosLocaisService, CampeonatoService, MessageService, BilheteEsportivoService } from './../../../../services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-futebol-listagem',
    templateUrl: 'futebol-listagem.component.html',
    styleUrls: ['futebol-listagem.component.css']
})
export class FutebolListagemComponent implements OnInit, OnDestroy {
    @Output() jogoSelecionadoId = new EventEmitter();
    @Output() exibirMaisCotacoes = new EventEmitter();
    jogoIdAtual;
    diaEspecifico = true;
    mobileScreen = true;
    campeonatos: Campeonato[];
    aux = [];
    itens: ItemBilheteEsportivo[] = [];
    showLoadingIndicator = true;
    refreshIntervalId;
    cotacoesFaltando = {};
    cotacoesLocais;
    oddsPrincipais;
    campeonatosPrincipais = ['casa_90', 'empate_90', 'fora_90'];
    jogosBloqueados;
    deixarCampeonatosAbertos;
    contentSportsEl;
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private messageService: MessageService,
        private bilheteService: BilheteEsportivoService,
        private renderer: Renderer2,
        private el: ElementRef,
        private router: Router,
        private route: ActivatedRoute,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit() {
        // this.mobileScreen = window.innerWidth <= 668 ? true : false;
        this.definirAltura();
        if (this.paramsService.getOddsPrincipais()) {
            this.oddsPrincipais = this.paramsService.getOddsPrincipais();
            // oddsPrincipais = oddsPrincipais.slice(0, 5);
        }
        this.campeonatosPrincipais = this.paramsService.getCampeonatosPrincipais();
        this.jogosBloqueados = this.paramsService.getJogosBloqueados();
        this.cotacoesLocais = this.paramsService.getCotacoesLocais();

        // Recebendo os itens atuais do bilhete
        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => this.itens = itens);

        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                this.deixarCampeonatosAbertos = false;
                this.showLoadingIndicator = true;
                this.contentSportsEl.scrollTop = 0;

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

                    this.enviandoJogoId();
                } else {
                    if (params['campeonato']) {
                        this.deixarCampeonatosAbertos = true;
                        const campeonatoId = params['campeonato'];
                        const queryParams: any = {
                            'odds': this.oddsPrincipais
                        };

                        this.campeonatoService.getCampeonato(campeonatoId, queryParams)
                            .pipe(takeUntil(this.unsub$))
                            .subscribe(
                                campeonato => {
                                    clearInterval(this.refreshIntervalId);
                                    this.campeonatos = [campeonato];
                                    this.showLoadingIndicator = false;

                                    sessionStorage.setItem('campeonatos', JSON.stringify(this.campeonatos));
                                    sessionStorage.setItem('camp_url', this.router.url);

                                    this.enviandoJogoId();
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

                            if (_.isEmpty(params) || !params['data']) {
                                queryParams.campeonatos = this.campeonatosPrincipais;
                            }
                        }

                        const dataLimiteTabela = this.paramsService.getOpcoes().data_limite_tabela;
                        if (params['data']) {
                            const dt = moment(params['data']);
                            if (dt.isSameOrBefore(dataLimiteTabela, 'day')) {
                                queryParams.data = dt.format('YYYY-MM-DD');
                            } else {
                                queryParams.data = dataLimiteTabela;
                            }
                        } else {
                            queryParams.data_final = dataLimiteTabela;
                        }

                        this.campeonatoService.getCampeonatos(queryParams)
                            .pipe(takeUntil(this.unsub$))
                            .subscribe(
                                campeonatos => {
                                    sessionStorage.setItem('campeonatos', JSON.stringify(campeonatos));
                                    sessionStorage.setItem('camp_url', this.router.url);

                                    this.aux = campeonatos;
                                    this.paginacao();

                                    this.enviandoJogoId();
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

    definirAltura() {
        const altura = window.innerHeight - 69;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-sticky');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura - 60}px`);
        this.contentSportsEl = this.el.nativeElement.querySelector('.content-sports-scroll');
        this.renderer.setStyle(this.contentSportsEl, 'height', `${altura}px`);
    }

    paginacao() {
        let start = 0;
        const sum = 10;
        const total = Math.ceil(this.aux.length / sum);

        this.campeonatos = [];
        this.campeonatos = this.campeonatos.concat(this.aux.splice(0, sum));
        start++;

        this.showLoadingIndicator = false;

        if (total > 1) {
            this.refreshIntervalId = setInterval(() => {
                const c = this.aux.splice(0, sum);
                this.campeonatos = this.campeonatos.concat(c);
                start++;

                if (start >= total) {
                    clearInterval(this.refreshIntervalId);
                }
            }, 500);
        }
    }

    oddSelecionada(jogoId, chave) {
        let result = false;
        this.itens.forEach(item => {
            if (item.jogo_id === jogoId && item.cotacao.chave === chave) {
                result = true;
            }
        });
        return result;
    }

    addCotacao(jogo: Jogo, cotacao) {
        let modificado = false;
        const indexGame = this.itens.findIndex(i => i.jogo._id === jogo._id);
        const indexOdd = this.itens.findIndex(i => (i.jogo._id === jogo._id) && (i.cotacao.chave === cotacao.chave));

        const item = {
            aoVivo: jogo.ao_vivo,
            jogo_id: jogo._id,
            jogo_nome: jogo.nome,
            cotacao: cotacao,
            jogo: jogo
        };

        if (indexGame >= 0) {
            if (indexOdd >= 0) {
                this.itens.splice(indexOdd, 1);
            } else {
                this.itens.splice(indexGame, 1, item);
            }

            modificado = true;
        } else {
            this.itens.push(item);

            modificado = true;
        }

        if (modificado) {
            this.bilheteService.atualizarItens(this.itens);
        }
    }

    // Coloca as cotações faltando nos jogos
    cotacaoManualFaltando(jogoId, cotacoes) {
        let result = false;
        const cotacoesLocais = this.cotacoesLocais[jogoId];

        if (cotacoesLocais) {
            cotacoes.forEach(cotacao => {
                for (const chave in cotacoesLocais) {
                    if (chave === cotacao.chave) {
                        cotacoesLocais[chave].usou = true;
                    }
                }
            });

            for (const chave in cotacoesLocais) {
                if (cotacoesLocais.hasOwnProperty(chave)) {
                    const cotacaoLocal = cotacoesLocais[chave];

                    if (!cotacaoLocal.usou && parseInt(cotacaoLocal.principal, 10)) {
                        if (!this.cotacoesFaltando[jogoId]) {
                            this.cotacoesFaltando[jogoId] = [];
                        }

                        if (!this.cotacoesFaltando[jogoId].filter(cotacao => cotacao.chave === chave).length) {
                            this.cotacoesFaltando[jogoId].push({
                                chave: chave,
                                valor: cotacaoLocal.valor
                            });
                        }
                    }
                }
            }

            result = true;
        }

        return result;
    }

    jogoBloqueado(id) {
        return this.jogosBloqueados ? (this.jogosBloqueados.includes(id) ? true : false) : false;
    }

    setPrincipal(campeonatoId) {
        const index = this.campeonatosPrincipais.findIndex(id => id === campeonatoId);
        if (index >= 0) {
            this.campeonatosPrincipais.splice(index, 1);
        } else {
            this.campeonatosPrincipais.push(campeonatoId);
        }
    }

    campeonatoPrincipal(campeonatoId) {
        let result;
        if (this.deixarCampeonatosAbertos) {
            result = true;
        } else {
            result = this.campeonatosPrincipais.includes(campeonatoId);
        }
        return result;
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

        this.jogoIdAtual = jogoId;
        return jogoId;
    }

    // Enviando jogoId para o component pai
    enviandoJogoId() {
        const jogoId = this.extrairJogoId(this.campeonatos);
        this.jogoSelecionadoId.emit(jogoId);
    }

    selecionarJogo(jogoId) {
        this.jogoIdAtual = jogoId;
        if (!this.mobileScreen) {
            this.jogoSelecionadoId.emit(jogoId);
        }
    }

    // Exibindo todas as cotações daquele jogo selecionado
    maisCotacoes(jogoId) {
        if (this.mobileScreen) {
            this.jogoIdAtual = jogoId;
            this.jogoSelecionadoId.emit(jogoId);
        }
        this.exibirMaisCotacoes.emit(true);
    }

    aplicarCssJogo(jogoId) {
        return { 'jogo-selecionado': this.jogoIdAtual === jogoId };
    }
}
