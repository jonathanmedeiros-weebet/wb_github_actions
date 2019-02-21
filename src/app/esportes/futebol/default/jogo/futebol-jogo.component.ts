import { Component, OnInit, OnDestroy, Renderer2, ElementRef, EventEmitter, Output, Input, OnChanges } from '@angular/core';

import { Jogo, Cotacao, ItemBilheteEsportivo } from './../../../../models';
import { ParametrosLocaisService, JogoService, MessageService, BilheteEsportivoService } from './../../../../services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-futebol-jogo',
    templateUrl: 'futebol-jogo.component.html',
    styleUrls: ['futebol-jogo.component.css']
})

export class FutebolJogoComponent implements OnInit, OnChanges, OnDestroy {
    jogo: Jogo;
    @Input() jogoId;
    @Output() exibirMaisCotacoes = new EventEmitter();
    odds: any = {};
    itens: ItemBilheteEsportivo[] = [];
    tiposAposta;
    cotacoesLocais;
    objectKeys = Object.keys;
    showLoadingIndicator = true;
    unsub$ = new Subject();

    constructor(
        private jogoService: JogoService,
        private bilheteService: BilheteEsportivoService,
        private messageService: MessageService,
        private el: ElementRef,
        private renderer: Renderer2,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit() {
        this.tiposAposta = this.paramsService.getTiposAposta();
        this.cotacoesLocais = this.paramsService.getCotacoesLocais();

        this.definirAltura();

        // Recebendo os itens atuais do bilhete
        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => this.itens = itens);

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

        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => this.itens = itens);
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
        const contentSportsEl = this.el.nativeElement.querySelector('.content-sports');
        this.renderer.setStyle(contentSportsEl, 'height', `${altura}px`);
    }

    back() {
        this.exibirMaisCotacoes.emit(false);
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

    mapearCotacoes(cotacoes) {
        this.odds = {};

        cotacoes.forEach(cotacao => {
            const tipoAposta = this.tiposAposta[cotacao.chave];

            if (tipoAposta) {
                let odd = this.odds[tipoAposta.cat_chave];
                if (!odd) {
                    odd = {
                        'nome': tipoAposta.cat_nome,
                        'tempo': tipoAposta.tempo,
                        'principal': tipoAposta.p,
                        'cotacoes': []
                    };
                    this.odds[tipoAposta.cat_chave] = odd;
                }

                odd.cotacoes.push(cotacao);

                if (this.cotacoesLocais[this.jogo._id] && this.cotacoesLocais[this.jogo._id][cotacao.chave]) {
                    this.cotacoesLocais[this.jogo._id][cotacao.chave].usou = true;
                }
            }
        });

        // Exibir odds locais que não vinheram no center
        if (this.cotacoesLocais[this.jogo._id]) {
            for (const chave in this.cotacoesLocais[this.jogo._id]) {
                if (this.cotacoesLocais[this.jogo._id].hasOwnProperty(chave)) {
                    const cotacaoLocal = this.cotacoesLocais[this.jogo._id][chave];

                    if (!cotacaoLocal.usou) {
                        const tipoAposta = this.tiposAposta[chave];

                        if (tipoAposta) {
                            let odd = this.odds[tipoAposta.cat_chave];
                            if (!odd) {
                                odd = {
                                    'nome': tipoAposta.cat_nome,
                                    'tempo': tipoAposta.tempo,
                                    'principal': tipoAposta.p,
                                    'cotacoes': []
                                };
                                this.odds[tipoAposta.cat_chave] = odd;
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

        this.showLoadingIndicator = false;
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

    showOdd(odd) {
        return this.tiposAposta[odd] ? true : false;
    }
}
