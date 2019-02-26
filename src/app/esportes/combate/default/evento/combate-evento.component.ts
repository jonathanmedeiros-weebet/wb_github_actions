import { Component, OnInit, OnDestroy, Renderer2, ElementRef, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ItemBilheteEsportivo } from './../../../../models';
import { ParametrosLocaisService, JogoService, MessageService, BilheteEsportivoService } from './../../../../services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-combate-evento',
    templateUrl: 'combate-evento.component.html',
    styleUrls: ['combate-evento.component.css']
})

export class CombateEventoComponent implements OnInit, OnDestroy, OnChanges {
    evento: any;
    @Input() eventoId;
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
        private route: ActivatedRoute,
        private el: ElementRef,
        private renderer: Renderer2,
        private location: Location,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit() {
        this.tiposAposta = this.paramsService.getTiposAposta();
        this.cotacoesLocais = this.paramsService.getCotacoesLocais();

        const altura = window.innerHeight - 69;
        const contentSportsEl = this.el.nativeElement.querySelector('.content-sports');
        this.renderer.setStyle(contentSportsEl, 'height', `${altura}px`);

        this.route.params
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                if (params['id']) {
                    const id = +params['id'];

                    this.jogoService.getJogo(id)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            evento => {
                                this.evento = evento;
                                this.mapearCotacoes(evento.cotacoes);
                            },
                            error => this.messageService.error(error)
                        );
                }
            });

        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => this.itens = itens);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    ngOnChanges() {
        if (this.eventoId) {
            this.showLoadingIndicator = true;

            this.jogoService.getJogo(this.eventoId)
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

    back() {
        this.exibirMaisCotacoes.emit(false);
    }

    oddSelecionada(eventoId, chave) {
        let result = false;
        this.itens.forEach(item => {
            if (item.jogo_id === eventoId && item.cotacao.chave === chave) {
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
            }
        });

        this.showLoadingIndicator = false;
    }

    addCotacao(evento, cotacao) {
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
