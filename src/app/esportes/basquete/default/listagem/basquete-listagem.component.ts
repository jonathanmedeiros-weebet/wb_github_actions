import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Campeonato, Jogo, ItemBilheteEsportivo } from './../../../../models';
import { ParametrosLocaisService, CampeonatoService, MessageService, BilheteEsportivoService } from './../../../../services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-basquete-listagem',
    templateUrl: 'basquete-listagem.component.html',
    styleUrls: ['basquete-listagem.component.css']
})
export class BasqueteListagemComponent implements OnInit, OnDestroy {
    diaEspecifico = true;
    campeonatos: Campeonato[];
    itens: ItemBilheteEsportivo[] = [];
    showLoadingIndicator = true;
    refreshIntervalId;
    cotacoesFaltando = {};
    cotacoesLocais;
    jogosBloqueados;
    contentSportsEl;
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private messageService: MessageService,
        private bilheteService: BilheteEsportivoService,
        private renderer: Renderer2,
        private el: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit() {
        this.definirAltura();

        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => this.itens = itens);

        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                this.showLoadingIndicator = true;
                this.contentSportsEl.scrollTop = 0;

                this.jogosBloqueados = this.paramsService.getJogosBloqueados();
                this.cotacoesLocais = this.paramsService.getCotacoesLocais();

                if (params['campeonato']) {
                    const campeonatoId = params['campeonato'];
                    const queryParams: any = {
                        'odds': ['bkt_casa', 'bkt_fora']
                    };

                    this.campeonatoService.getCampeonato(campeonatoId, queryParams)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            campeonato => {
                                this.campeonatos = [campeonato];
                                this.showLoadingIndicator = false;
                                sessionStorage.setItem('campeonatos', JSON.stringify(this.campeonatos));
                                sessionStorage.setItem('camp_url', this.router.url);
                            },
                            error => this.messageService.error(error)
                        );
                } else {
                    const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados();
                    const queryParams: any = {
                        'sport_id': 18,
                        'campeonatos_bloqueados': campeonatosBloqueados,
                        'odds': ['bkt_casa', 'bkt_fora']
                    };
                    if (params['data']) {
                        const data = moment(params['data']).format('YYYY-MM-DD');
                        queryParams.data = data;
                    } else {
                        queryParams.data = moment().format('YYYY-MM-DD');
                    }
                    if (params['nome']) {
                        queryParams.nome = params['nome'];
                    }

                    this.campeonatoService.getCampeonatos(queryParams)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            campeonatos => {
                                sessionStorage.setItem('campeonatos', JSON.stringify(campeonatos));
                                sessionStorage.setItem('camp_url', this.router.url);

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

    definirAltura() {
        const altura = window.innerHeight - 69;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-sticky');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura - 60}px`);
        this.contentSportsEl = this.el.nativeElement.querySelector('.content-sports-scroll');
        this.renderer.setStyle(this.contentSportsEl, 'height', `${altura}px`);
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
}
