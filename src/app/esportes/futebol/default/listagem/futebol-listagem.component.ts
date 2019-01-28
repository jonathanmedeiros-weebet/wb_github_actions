import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Campeonato, Jogo, ItemBilheteEsportivo } from './../../../../models';
import { CampeonatoService, MessageService, BilheteEsportivoService } from './../../../../services';

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
    diaEspecifico = true;
    campeonatos: Campeonato[];
    camps = [];
    itens: ItemBilheteEsportivo[] = [];
    showLoadingIndicator = true;
    refreshIntervalId;
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private messageService: MessageService,
        private bilheteService: BilheteEsportivoService,
        private renderer: Renderer2,
        private el: ElementRef,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.showLoadingIndicator = true;

        let oddsPrincipais = ['casa_90', 'empate_90', 'fora_90'];

        if (localStorage.getItem('odds_principais') !== 'undefined') {
            oddsPrincipais = JSON.parse(localStorage.getItem('odds_principais'));
        }

        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                let campeonatosStorage;
                const campUrl = sessionStorage.getItem('camp_url');
                if (sessionStorage.getItem('campeonatos')) {
                    campeonatosStorage = JSON.parse(sessionStorage.getItem('campeonatos'));
                }

                if (campeonatosStorage && this.router.url === campUrl) {
                    this.campeonatos = campeonatosStorage;
                    this.showLoadingIndicator = false;
                } else {
                    if (params['campeonato']) {
                        const campeonatoId = +params['campeonato'];
                        const queryParams: any = {
                            'odds': oddsPrincipais
                        };

                        this.campeonatoService.getCampeonato(campeonatoId, queryParams)
                            .pipe(takeUntil(this.unsub$))
                            .subscribe(
                                campeonato => {
                                    this.showLoadingIndicator = false;
                                    clearInterval(this.refreshIntervalId);
                                    this.campeonatos = [campeonato];

                                    sessionStorage.setItem('campeonatos', JSON.stringify(this.campeonatos));
                                    sessionStorage.setItem('camp_url', this.router.url);
                                },
                                error => this.messageService.error(error)
                            );
                    } else {
                        const campeonatosBloqueados = JSON.parse(localStorage.getItem('campeonatos_bloqueados'));
                        const campeonatosPrincipais = JSON.parse(localStorage.getItem('campeonatos_principais'));

                        const queryParams: any = {
                            'sport_id': 1,
                            'campeonatos_bloqueados': campeonatosBloqueados,
                            'odds': oddsPrincipais
                        };

                        if (_.isEmpty(params)) {
                            queryParams.campeonatos = campeonatosPrincipais;
                        }

                        if (params['data']) {
                            const data = moment(params['data']).format('YYYY-MM-DD');
                            queryParams.data = data;
                        } else {
                            const opcoes = JSON.parse(localStorage.getItem('opcoes'));
                            queryParams.data_final = opcoes.data_limite_tabela;
                        }

                        if (params['nome']) {
                            queryParams.nome = params['nome'];
                        }

                        this.campeonatoService.getCampeonatos(queryParams)
                            .pipe(takeUntil(this.unsub$))
                            .subscribe(
                                campeonatos => {
                                    this.camps = campeonatos;
                                    this.paginacao();

                                    sessionStorage.setItem('campeonatos', JSON.stringify(campeonatos));
                                    sessionStorage.setItem('camp_url', this.router.url);
                                },
                                error => this.messageService.error(error)
                            );
                    }
                }
            });

        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => this.itens = itens);

        const altura = window.innerHeight - 69;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-sticky');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura - 60}px`);
        const contentSportsEl = this.el.nativeElement.querySelector('.content-sports-scroll');
        this.renderer.setStyle(contentSportsEl, 'height', `${altura}px`);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    paginacao() {
        let start = 0;
        const sum = 5;
        const total = Math.ceil(this.camps.length / sum);

        this.campeonatos = [];
        this.campeonatos = this.campeonatos.concat(this.camps.splice(0, sum));
        start++;

        this.showLoadingIndicator = false;

        if (total > 1) {
            this.refreshIntervalId = setInterval(() => {
                const c = this.camps.splice(0, sum);
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
}
