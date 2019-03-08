import {
    Component, OnInit, OnDestroy, Renderer2, ElementRef,
    EventEmitter, Output, Input, ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Jogo, Cotacao, ItemBilheteEsportivo } from './../../../../models';
import { ParametrosLocaisService, JogoService, MessageService, BilheteEsportivoService } from './../../../../services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-basquete-evento',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'basquete-evento.component.html',
    styleUrls: ['basquete-evento.component.css']
})

export class BasqueteEventoComponent implements OnInit, OnDestroy {
    evento: Jogo;
    @Input() eventoId;
    @Output() exibirMaisCotacoes = new EventEmitter();
    odds: any = {};
    itens: ItemBilheteEsportivo[] = [];
    itensSelecionados = {};
    tiposAposta;
    cotacoesLocais;
    objectKeys = Object.keys;
    showLoadingIndicator = true;
    contentSportsEl;
    unsub$ = new Subject();

    constructor(
        private eventoService: JogoService,
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
                    this.itensSelecionados[item.cotacao._id] = true;
                }

                this.cd.markForCheck();
            });

        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                this.contentSportsEl.scrollTop = 0;
            });

        if (this.eventoId) {
            this.eventoService.getJogo(this.eventoId)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    evento => {
                        this.evento = evento;
                        this.mapearCotacoes(evento.cotacoes);
                    },
                    error => this.messageService.error(error)
                );
        }
    }

    ngOnChanges() {
        if (this.eventoId) {
            this.showLoadingIndicator = true;

            this.eventoService.getJogo(this.eventoId)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    evento => {
                        this.evento = evento;
                        this.mapearCotacoes(evento.cotacoes);
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

    oddSelecionada(eventoId, chave) {
        let result = false;
        for (let index = 0; index < this.itens.length; index++) {
            const item = this.itens[index];
            if (item.jogo_id === eventoId && item.cotacao.chave === chave) {
                result = true;
            }
        }
        return result;
    }

    mapearCotacoes(cotacoes) {
        this.odds = {};

        for (let index = 0; index < cotacoes.length; index++) {
            const cotacao = cotacoes[index];
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

                if (this.cotacoesLocais[this.evento._id] && this.cotacoesLocais[this.evento._id][cotacao.chave]) {
                    this.cotacoesLocais[this.evento._id][cotacao.chave].usou = true;
                }
            }
        }

        // Exibir odds locais que não vinheram no center
        if (this.cotacoesLocais[this.evento._id]) {
            for (const chave in this.cotacoesLocais[this.evento._id]) {
                if (this.cotacoesLocais[this.evento._id].hasOwnProperty(chave)) {
                    const cotacaoLocal = this.cotacoesLocais[this.evento._id][chave];

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
        this.cd.detectChanges();
    }

    addCotacao(evento: Jogo, cotacao) {
        let modificado = false;
        const indexGame = this.itens.findIndex(i => i.jogo._id === evento._id);
        const indexOdd = this.itens.findIndex(i => (i.jogo._id === evento._id) && (i.cotacao.chave === cotacao.chave));

        const item = {
            aoVivo: evento.ao_vivo,
            jogo_id: evento._id,
            jogo_nome: evento.nome,
            cotacao: cotacao,
            jogo: evento
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
