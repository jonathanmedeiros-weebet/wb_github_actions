import {
    Component, OnInit, OnDestroy, Renderer2, ElementRef,
    EventEmitter, Output, Input, OnChanges, ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Jogo, Cotacao, ItemBilheteEsportivo } from './../../../../models';
import { ParametrosLocaisService, JogoService, MessageService, BilheteEsportivoService } from './../../../../services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-futebol-jogo',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'futebol-jogo.component.html',
    styleUrls: ['futebol-jogo.component.css']
})
export class FutebolJogoComponent implements OnInit, OnChanges, OnDestroy {
    jogo: Jogo;
    @Input() jogoId;
    @Output() exibirMaisCotacoes = new EventEmitter();
    odds: any = {};
    odds1T: any = {};
    odds2T: any = {};
    oddsJogadores: any = {};
    itens: ItemBilheteEsportivo[] = [];
    itensSelecionados = {};
    tiposAposta;
    cotacoesLocais;
    objectKeys = Object.keys;
    showLoadingIndicator = true;
    contentSportsEl;
    unsub$ = new Subject();

    constructor(
        private jogoService: JogoService,
        private bilheteService: BilheteEsportivoService,
        private messageService: MessageService,
        private el: ElementRef,
        private renderer: Renderer2,
        private paramsService: ParametrosLocaisService,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.definirAltura();
        this.tiposAposta = this.paramsService.getTiposAposta();
        this.cotacoesLocais = this.paramsService.getCotacoesLocais();

        // Recebendo os itens atuais do bilhete
        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => {
                this.itens = itens;

                this.itensSelecionados = {};
                for (let i = 0; i < itens.length; i++) {
                    const item = itens[i];
                    if (item.cotacao.nome) {
                        const modificado = item.cotacao.nome.replace(' ', '_');
                        this.itensSelecionados[`${item.jogo_id}_${item.cotacao.chave}_${modificado}`] = true;
                    } else {
                        this.itensSelecionados[`${item.jogo_id}_${item.cotacao.chave}`] = true;
                    }
                }

                this.cd.markForCheck();
            });

        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                this.contentSportsEl.scrollTop = 0;
            });

        if (this.jogoId) {
            this.jogoService.getJogo(this.jogoId)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    jogo => {
                        this.jogo = jogo;
                        this.mapearCotacoes(jogo.cotacoes);
                    },
                    error => this.messageService.error(error)
                );
        }
    }

    ngOnChanges() {
        if (this.jogoId) {
            this.showLoadingIndicator = true;

            this.jogoService.getJogo(this.jogoId)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    jogo => {
                        this.jogo = jogo;
                        this.mapearCotacoes(jogo.cotacoes);
                    },
                    error => this.messageService.error(error)
                );
        }
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    definirAltura() {
        const altura = window.innerHeight - 69;
        this.contentSportsEl = this.el.nativeElement.querySelector('.content-sports');
        this.renderer.setStyle(this.contentSportsEl, 'height', `${altura}px`);
    }

    back() {
        this.exibirMaisCotacoes.emit(false);
    }

    oddSelecionada(jogoId, chave) {
        let result = false;
        for (let index = 0; index < this.itens.length; index++) {
            const item = this.itens[index];
            if (item.jogo_id === jogoId && item.cotacao.chave === chave) {
                result = true;
            }
        }
        return result;
    }

    mapearCotacoes(cotacoes) {
        const odds = {};
        const odds1T = {};
        const odds2T = {};
        const oddsJogadores = {};

        for (let index = 0; index < cotacoes.length; index++) {
            const cotacao = cotacoes[index];
            const tipoAposta = this.tiposAposta[cotacao.chave];

            if (tipoAposta) {
                let obj;
                if (tipoAposta.tempo === '90') {
                    obj = odds;
                } else if (tipoAposta.tempo === '1T') {
                    obj = odds1T;
                } else if (tipoAposta.tempo === '2T') {
                    obj = odds2T;
                } else if (tipoAposta.tempo === 'JOGADORES') {
                    obj = oddsJogadores;
                } else {
                    continue;
                }

                let odd = obj[tipoAposta.cat_chave];

                if (!odd) {
                    odd = {
                        'nome': tipoAposta.cat_nome,
                        'tempo': tipoAposta.tempo,
                        'principal': tipoAposta.p,
                        'posicao': tipoAposta.cat_posicao,
                        'cotacoes': []
                    };
                    obj[tipoAposta.cat_chave] = odd;
                }

                odd.cotacoes.push(cotacao);

                if (this.cotacoesLocais[this.jogo._id] && this.cotacoesLocais[this.jogo._id][cotacao.chave]) {
                    this.cotacoesLocais[this.jogo._id][cotacao.chave].usou = true;
                }
            }
        }

        // Exibir odds locais que não vinheram no center
        if (this.cotacoesLocais[this.jogo._id]) {
            for (const chave in this.cotacoesLocais[this.jogo._id]) {
                if (this.cotacoesLocais[this.jogo._id].hasOwnProperty(chave)) {
                    const cotacaoLocal = this.cotacoesLocais[this.jogo._id][chave];

                    if (!cotacaoLocal.usou) {
                        const tipoAposta = this.tiposAposta[chave];

                        if (tipoAposta) {
                            let obj;
                            if (tipoAposta.tempo === '90') {
                                obj = odds;
                            } else if (tipoAposta.tempo === '1T') {
                                obj = odds1T;
                            } else if (tipoAposta.tempo === '2T') {
                                obj = odds2T;
                            } else {
                                continue;
                            }

                            let odd = obj[tipoAposta.cat_chave];
                            if (!odd) {
                                odd = {
                                    'nome': tipoAposta.cat_nome,
                                    'tempo': tipoAposta.tempo,
                                    'principal': tipoAposta.p,
                                    'cotacoes': []
                                };
                                obj[tipoAposta.cat_chave] = odd;
                            }

                            const cotacao = new Cotacao();
                            cotacao.chave = chave;
                            cotacao.valor = cotacaoLocal.valor;

                            odd.cotacoes.push(cotacao);
                        }
                    }
                }
            }
        }

        this.odds = {};
        const sortableOdds = [];
        for (const odd in odds) {
            if (odds[odd]) {
                sortableOdds.push([odds[odd].posicao, odd, odds[odd]]);
            }
        }
        sortableOdds.sort((a, b) => a[0] - b[0]);
        sortableOdds.forEach(s => this.odds[s[1]] = s[2]);

        this.odds1T = {};
        const sortableOdds1T = [];
        for (const odd in odds1T) {
            if (odds1T[odd]) {
                sortableOdds1T.push([odds1T[odd].posicao, odd, odds1T[odd]]);
            }
        }
        sortableOdds1T.sort((a, b) => a[0] - b[0]);
        sortableOdds1T.forEach(s => this.odds1T[s[1]] = s[2]);

        this.odds2T = {};
        const sortableOdds2T = [];
        for (const odd in odds2T) {
            if (odds2T[odd]) {
                sortableOdds2T.push([odds2T[odd].posicao, odd, odds2T[odd]]);
            }
        }
        sortableOdds2T.sort((a, b) => a[0] - b[0]);
        sortableOdds2T.forEach(s => this.odds2T[s[1]] = s[2]);

        this.oddsJogadores = {};
        const sortableJogadores = [];
        for (const odd in oddsJogadores) {
            if (oddsJogadores[odd]) {
                sortableJogadores.push([oddsJogadores[odd].posicao, odd, oddsJogadores[odd]]);
            }
        }
        sortableJogadores.sort((a, b) => a[0] - b[0]);
        sortableJogadores.forEach(s => this.oddsJogadores[s[1]] = s[2]);

        this.showLoadingIndicator = false;
        this.cd.detectChanges();
    }

    addCotacao(jogo: Jogo, cotacao) {
        let modificado = false;
        const indexGame = this.itens.findIndex(i => i.jogo._id === jogo._id);
        const indexOdd = this.itens.findIndex(i => {
            let result = false;
            if (cotacao.nome) {
                if ((i.jogo._id === jogo._id) && (i.cotacao.chave === cotacao.chave) && (i.cotacao.nome === cotacao.nome)) {
                    result = true;
                }
            } else if ((i.jogo._id === jogo._id) && (i.cotacao.chave === cotacao.chave)) {
                result = true;
            }
            return result;
        });

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

    showOdd(odd) {
        return this.tiposAposta[odd] ? true : false;
    }

    itemSelecionado(jogo, cotacao) {
        let result = false;
        if (cotacao.nome) {
            const modificado = cotacao.nome.replace(' ', '_');
            if (this.itensSelecionados[`${jogo._id}_${cotacao.chave}_${modificado}`]) {
                result = true;
            }
        } else if (this.itensSelecionados[`${jogo._id}_${cotacao.chave}`]) {
            result = true;
        }
        return result;
    }
}
