import {
    Component, OnInit, OnDestroy, Renderer2, ElementRef,
    EventEmitter, Input, ChangeDetectorRef, ChangeDetectionStrategy, Output,
    SimpleChange, OnChanges
} from '@angular/core';

import { Campeonato, Jogo, ItemBilheteEsportivo } from '../../../../models';
import { ParametrosLocaisService, BilheteEsportivoService } from '../../../../services';

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
    @Input() eventoIdAtual;
    @Input() camps: Campeonato[];
    @Output() eventoSelecionadoId = new EventEmitter();
    @Output() exibirMaisCotacoes = new EventEmitter();
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

    // Coloca as cotações faltando nos eventos
    cotacaoManualFaltando(eventoId, cotacoes) {
        let result = false;
        const cotacoesLocais = this.cotacoesLocais[eventoId];

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
                        if (!this.cotacoesFaltando[eventoId]) {
                            this.cotacoesFaltando[eventoId] = [];
                        }

                        if (!this.cotacoesFaltando[eventoId].filter(cotacao => cotacao.chave === chave).length) {
                            this.cotacoesFaltando[eventoId].push({
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

    eventoBloqueado(eventId) {
        return this.eventosBloqueados ? (this.eventosBloqueados.includes(eventId) ? true : false) : false;
    }

    // Extrai id do primeiro evento do primeiro campeonato
    extrairJogoId(campeonatos) {
        let eventoId = null;

        if (campeonatos.length > 1) {
            const eventos = campeonatos[0].eventos;

            let start = 0;
            let stop = false;

            while (!stop) {
                if (eventos.length > 1) {
                    eventoId = eventos[start]._id;
                    stop = true;
                } else if (eventos.length === 1) {
                    eventoId = eventos[start]._id;
                    stop = true;
                }

                start++;
            }
        } else if (campeonatos.length === 1) {
            const eventos = campeonatos[0].eventos;

            if (eventos.length > 1) {
                eventoId = eventos[0]._id;
            } else if (eventos.length === 1) {
                eventoId = eventos[0]._id;
            }
        }

        this.eventoIdAtual = eventoId;
        return eventoId;
    }

    selecionarJogo(eventoId) {
        this.eventoIdAtual = eventoId;
        if (!this.mobileScreen) {
            this.eventoSelecionadoId.emit(eventoId);
        }
    }

    // Exibindo todas as cotações daquele evento selecionado
    maisCotacoes(eventoId) {
        if (this.mobileScreen) {
            this.eventoIdAtual = eventoId;
            this.eventoSelecionadoId.emit(eventoId);
        }
        this.exibirMaisCotacoes.emit(true);
    }
}
