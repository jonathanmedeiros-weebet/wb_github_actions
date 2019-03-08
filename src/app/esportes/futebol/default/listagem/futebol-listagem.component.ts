import {
    Component, OnInit, OnDestroy, Renderer2,
    ElementRef, EventEmitter, Output, ChangeDetectionStrategy,
    ChangeDetectorRef, Input, OnChanges, SimpleChange
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Campeonato, Jogo, ItemBilheteEsportivo } from './../../../../models';
import { ParametrosLocaisService, MessageService, BilheteEsportivoService } from './../../../../services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-futebol-listagem',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'futebol-listagem.component.html',
    styleUrls: ['futebol-listagem.component.css']
})
export class FutebolListagemComponent implements OnInit, OnDestroy, OnChanges {
    @Input() showLoadingIndicator;
    @Input() deixarCampeonatosAbertos;
    @Input() jogoIdAtual;
    @Input() camps: Campeonato[];
    @Input() campeonatosPrincipais = [];
    @Output() jogoSelecionadoId = new EventEmitter();
    @Output() exibirMaisCotacoes = new EventEmitter();
    mobileScreen = true;
    campeonatos: Campeonato[];
    itens: ItemBilheteEsportivo[] = [];
    itensSelecionados = {};
    cotacoesFaltando = {};
    cotacoesLocais;
    jogosBloqueados;
    contentSportsEl;
    start;
    offset = 10;
    total;
    loadingScroll = false;
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
        this.jogosBloqueados = this.paramsService.getJogosBloqueados();
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
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (this.contentSportsEl && changes['showLoadingIndicator']) {
            this.contentSportsEl.scrollTop = 0;
        }

        if (changes['camps'] && this.camps) {
            this.start = 0;
            this.total = Math.ceil(this.camps.length / this.offset);
            this.campeonatos = [];
            this.exibirMais();

            setTimeout(() => {
                const altura = window.innerHeight - 69;
                if (this.contentSportsEl.scrollHeight <= altura) {
                    this.exibirMais();
                }
            }, 2000);
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
        this.contentSportsEl = this.el.nativeElement.querySelector('.content-sports-scroll');
        this.renderer.setStyle(this.contentSportsEl, 'height', `${altura}px`);

        this.contentSportsEl.addEventListener('ps-y-reach-end', () => {
            this.exibirMais();
        });
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

    // Coloca as cotações faltando nos jogos
    cotacaoManualFaltando(jogoId, cotacoes) {
        let result = false;
        const cotacoesLocais = this.cotacoesLocais[jogoId];

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

    setPrincipal(campeonatoId) {
        const index = this.campeonatosPrincipais.findIndex(id => id === campeonatoId);
        if (index >= 0) {
            this.campeonatosPrincipais.splice(index, 1);
        } else {
            this.campeonatosPrincipais.push(campeonatoId);
        }
    }

    campeonatoPrincipal(campeonatoId) {
        let result;
        if (this.deixarCampeonatosAbertos) {
            result = true;
        } else {
            result = this.campeonatosPrincipais.includes(campeonatoId);
        }
        return result;
    }

    // Extrai id do primeiro jogo do primeiro campeonato
    extrairJogoId(campeonatos) {
        let jogoId = null;

        if (campeonatos.length > 1) {
            const jogos = campeonatos[0].jogos;

            let start = 0;
            let stop = false;

            while (!stop) {
                if (jogos.length > 1) {
                    jogoId = jogos[start]._id;
                    stop = true;
                } else if (jogos.length === 1) {
                    jogoId = jogos[start]._id;
                    stop = true;
                }

                start++;
            }
        } else if (campeonatos.length === 1) {
            const jogos = campeonatos[0].jogos;

            if (jogos.length > 1) {
                jogoId = jogos[0]._id;
            } else if (jogos.length === 1) {
                jogoId = jogos[0]._id;
            }
        }

        this.jogoIdAtual = jogoId;
        return jogoId;
    }

    selecionarJogo(jogoId) {
        this.jogoIdAtual = jogoId;
        if (!this.mobileScreen) {
            this.jogoSelecionadoId.emit(jogoId);
        }
    }

    // Exibindo todas as cotações daquele jogo selecionado
    maisCotacoes(jogoId) {
        if (this.mobileScreen) {
            this.jogoIdAtual = jogoId;
            this.jogoSelecionadoId.emit(jogoId);
        }
        this.exibirMaisCotacoes.emit(true);
    }

    exibirMais() {
        this.loadingScroll = true;

        if (this.start < this.total) {
            const splice = this.camps.splice(0, this.offset);
            this.campeonatos = this.campeonatos.concat(splice);
            this.start++;
        }

        this.loadingScroll = false;
        this.cd.markForCheck();
    }
}
