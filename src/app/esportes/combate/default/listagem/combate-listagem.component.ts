import {
    Component, OnInit, OnDestroy, Renderer2, ElementRef,
    EventEmitter, Input, ChangeDetectorRef, ChangeDetectionStrategy, Output,
    SimpleChange, OnChanges
} from '@angular/core';

import { Campeonato, Jogo, ItemBilheteEsportivo } from './../../../../models';
import { ParametrosLocaisService, BilheteEsportivoService } from './../../../../services';

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
    @Output() eventoSelecionadoId = new EventEmitter();
    @Output() exibirMaisCotacoes = new EventEmitter();
    campeonatos: Campeonato[];
    campeonatosPrincipais: any[];
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
            this.campeonatosPrincipais = this.camps.map(camp => camp._id);
            this.campeonatos = this.camps;
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

            delete this.itensSelecionados[`${cotacao._id}`];
            modificado = true;
        } else {
            this.itens.push(item);

            this.itensSelecionados[`${cotacao._id}`] = true;
            modificado = true;
        }

        if (modificado) {
            this.bilheteService.atualizarItens(this.itens);
        }
    }

    eventoBloqueado(id) {
        return this.eventosBloqueados ? (this.eventosBloqueados.includes(id) ? true : false) : false;
    }

    setPrincipal(campeonatoId) {
        if (this.campeonatosPrincipais) {
            const index = this.campeonatosPrincipais.findIndex(id => id === campeonatoId);

            if (index >= 0) {
                this.campeonatosPrincipais.splice(index, 1);
            } else {
                this.campeonatosPrincipais.push(campeonatoId);
            }
        }
    }

    campeonatoPrincipal(campeonatoId) {
        let result = null;
        if (this.campeonatosPrincipais) {
            result = this.campeonatosPrincipais.includes(campeonatoId);
        }
        return result;
    }
}
