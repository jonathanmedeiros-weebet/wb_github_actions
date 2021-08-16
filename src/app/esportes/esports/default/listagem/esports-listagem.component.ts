import {
    Component, OnInit, OnDestroy, Renderer2, ElementRef,
    EventEmitter, Input, ChangeDetectorRef, ChangeDetectionStrategy, Output,
    SimpleChange, OnChanges
} from '@angular/core';

import { Campeonato, Jogo, ItemBilheteEsportivo } from '../../../../models';
import { ParametrosLocaisService, BilheteEsportivoService, HelperService } from '../../../../services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-esports-listagem',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'esports-listagem.component.html',
    styleUrls: ['esports-listagem.component.css']
})
export class EsportsListagemComponent implements OnInit, OnDestroy, OnChanges {
    @Input() showLoadingIndicator;
    @Input() camps: Campeonato[];
    mobileScreen = true;
    campeonatos: Campeonato[];
    itens: ItemBilheteEsportivo[] = [];
    itensSelecionados = {};
    cotacoesFaltando = {};
    cotacoesLocais;
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
        this.cotacoesLocais = this.paramsService.getCotacoesLocais();

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

    // Coloca as cotações faltando nos eventos
    cotacaoManualFaltando(evento, cotacoes) {
        let result = false;
        const cotacoesLocais = this.cotacoesLocais[evento.event_id];

        if (cotacoesLocais) {
            for (let index = 0; index < cotacoes.length; index++) {
                const cotacao = cotacoes[index];
                for (const chave in cotacoesLocais) {
                    if (chave === cotacao.chave) {
                        cotacoesLocais[chave].usou = true;
                    }
                }
            }

            for (const chave in cotacoesLocais) {
                if (cotacoesLocais.hasOwnProperty(chave)) {
                    const cotacaoLocal = cotacoesLocais[chave];

                    if (!cotacaoLocal.usou && parseInt(cotacaoLocal.principal, 10)) {
                        if (!this.cotacoesFaltando[evento.event_id]) {
                            this.cotacoesFaltando[evento.event_id] = [];
                        }

                        if (!this.cotacoesFaltando[evento.event_id].filter(cotacao => cotacao.chave === chave).length) {
                            this.cotacoesFaltando[evento.event_id].push({
                                chave: chave,
                                valor: cotacaoLocal.valor,
                                valorFinal: this.helperService.calcularCotacao(cotacaoLocal.valor, chave, evento.event_id, evento.favorito),
                                label: this.helperService.apostaTipoLabelCustom(chave, evento.time_a_nome, evento.time_b_nome)
                            });
                        }
                    }
                }
            }

            result = true;
        }

        return result;
    }

    eventoBloqueado(eventId) {
        return this.eventosBloqueados ? (this.eventosBloqueados.includes(eventId) ? true : false) : false;
    }

    cotacaoPermitida(cotacao) {
        return this.helperService.cotacaoPermitida(cotacao);
    }
}
