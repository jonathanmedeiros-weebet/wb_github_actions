import {
    Component, OnInit, OnDestroy, Renderer2, ElementRef,
    EventEmitter, Input, ChangeDetectorRef, ChangeDetectionStrategy, Output,
    SimpleChange, OnChanges
} from '@angular/core';

import { Campeonato, Jogo, ItemBilheteEsportivo } from './../../../../models';
import { ParametrosLocaisService, BilheteEsportivoService, HelperService } from './../../../../services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-combate-listagem',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'combate-listagem.component.html',
    styleUrls: ['combate-listagem.component.css']
})
export class CombateListagemComponent implements OnInit, OnDestroy, OnChanges {
    @Input() showLoadingIndicator;
    @Input() camps: Campeonato[];
    campeonatos: Campeonato[];
    itens: ItemBilheteEsportivo[] = [];
    itensSelecionados = {};
    eventosBloqueados;
    contentSportsEl;
    unsub$ = new Subject();

    constructor(
        private bilheteService: BilheteEsportivoService,
        private renderer: Renderer2,
        private el: ElementRef,
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        // this.mobileScreen = window.innerWidth <= 668 ? true : false;
        this.definirAltura();
        this.eventosBloqueados = this.paramsService.getJogosBloqueados();

        // Recebendo os itens atuais do bilhete
        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => {
                this.itens = itens;

                this.itensSelecionados = {};
                for (let i = 0; i < itens.length; i++) {
                    const item = itens[i];
                    this.itensSelecionados[`${item.jogo_id}_${item.cotacao.chave}`] = true;
                }

                this.cd.markForCheck();
            });
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (this.contentSportsEl && changes['showLoadingIndicator']) {
            this.contentSportsEl.scrollTop = 0;
        }

        if (changes['camps'] && this.camps) {
            this.campeonatos = this.camps.map(campeonato => {
                campeonato.jogos.forEach(jogo => {
                    jogo.cotacoes.forEach(cotacao => {
                        cotacao.valorFinal = this.helperService.calcularCotacao(cotacao.valor, cotacao.chave, jogo.event_id, jogo.favorito, false);
                        cotacao.label = this.helperService.apostaTipoLabelCustom(cotacao.chave, jogo.time_a_nome, jogo.time_b_nome)
                    });
                });

                return campeonato;
            });
        }
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    trackById(index: number, campeonato: any): string {
        return campeonato._id;
    }

    definirAltura() {
        const altura = window.innerHeight - 69;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-sticky');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura - 60}px`);
        this.contentSportsEl = this.el.nativeElement.querySelector('.content-sports');
        this.renderer.setStyle(this.contentSportsEl, 'height', `${altura}px`);
    }

    addCotacao(evento: Jogo, cotacao) {
        let modificado = false;
        const indexGame = this.itens.findIndex(i => i.jogo._id === evento._id);
        const indexOdd = this.itens.findIndex(i => (i.jogo._id === evento._id) && (i.cotacao.chave === cotacao.chave));

        const item = {
            ao_vivo: evento.ao_vivo,
            jogo_id: evento._id,
            jogo_event_id: evento.event_id,
            jogo_nome: evento.nome,
            cotacao: cotacao,
            jogo: evento,
            mudanca: false,
            cotacao_antiga_valor: null
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

    eventoBloqueado(eventId) {
        return this.eventosBloqueados ? (this.eventosBloqueados.includes(eventId) ? true : false) : false;
    }

    cotacaoPermitida(cotacao) {
        return this.helperService.cotacaoPermitida(cotacao);
    }
}
