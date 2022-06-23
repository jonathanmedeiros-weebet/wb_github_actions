import {
    Component, OnInit, OnDestroy, Renderer2, ElementRef,
    Input, ChangeDetectorRef, ChangeDetectionStrategy,
    SimpleChange, OnChanges, Output, EventEmitter
} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { Campeonato, Jogo, ItemBilheteEsportivo } from '../../../models';
import { ParametrosLocaisService, BilheteEsportivoService, HelperService } from '../../../services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-generico-listagem',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'generico-listagem.component.html',
    styleUrls: ['generico-listagem.component.css']
})
export class GenericoListagemComponent implements OnInit, OnDestroy, OnChanges {
    @Input() showLoadingIndicator;
    @Input() jogoIdAtual;
    @Input() camps: Campeonato[];
    @Input() data;
    @Input() sportId;
    @Input() esporte;
    @Output() jogoSelecionadoId = new EventEmitter();
    @Output() exibirMaisCotacoes = new EventEmitter();
    mobileScreen = true;
    campeonatos: Campeonato[];
    itens = [];
    itensSelecionados = {};
    cotacoesFaltando = {};
    cotacoesLocais;
    jogosBloqueados;
    dataLimiteTabela;
    contentSportsEl;
    start;
    offset = 20;
    total;
    loadingScroll = false;
    unsub$ = new Subject();

    constructor(
        private bilheteService: BilheteEsportivoService,
        private renderer: Renderer2,
        private el: ElementRef,
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService,
        private cd: ChangeDetectorRef,
        private router: Router
    ) { }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;
        this.definirAltura();
        this.jogosBloqueados = this.paramsService.getJogosBloqueados();
        this.cotacoesLocais = this.paramsService.getCotacoesLocais();
        this.dataLimiteTabela = this.paramsService.getOpcoes().data_limite_tabela;

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
            this.start = 0;
            this.total = Math.ceil(this.camps.length / this.offset);
            this.campeonatos = [];
            this.exibirMais();

            setTimeout(() => {
                let altura;
                let scrollHeight;
                if (this.mobileScreen) {
                    altura = window.innerHeight - 98;
                    scrollHeight = this.contentSportsEl.scrollHeight - 90;
                } else {
                    altura = window.innerHeight - 132;
                    scrollHeight = this.contentSportsEl.scrollHeight;
                }
                if (scrollHeight <= altura) {
                    this.exibirMais();
                }
            }, 1000);
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
        const headerHeight = this.mobileScreen ? 145 : 132;
        const altura = window.innerHeight - headerHeight;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-sticky');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura}px`);
        this.contentSportsEl = this.el.nativeElement.querySelector('.content-sports');
        this.renderer.setStyle(this.contentSportsEl, 'height', `${altura}px`);
    }

    addCotacao(jogo: Jogo, cotacao) {
        let modificado = false;
        const indexGame = this.itens.findIndex(i => i.jogo._id === jogo._id);
        const indexOdd = this.itens.findIndex(i => (i.jogo._id === jogo._id) && (i.cotacao.chave === cotacao.chave));

        const item = {
            ao_vivo: jogo.ao_vivo,
            jogo_id: jogo._id,
            jogo_event_id: jogo.event_id,
            jogo_nome: jogo.nome,
            cotacao: {
                chave: cotacao.chave,
                valor: cotacao.valor,
                nome: cotacao.nome
            },
            jogo: jogo,
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

    // Coloca as cotações faltando nos jogos
    cotacaoManualFaltando(jogo, cotacoes) {
        let result = false;
        const cotacoesLocais = this.cotacoesLocais[jogo.event_id];

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
                        if (!this.cotacoesFaltando[jogo.event_id]) {
                            this.cotacoesFaltando[jogo.event_id] = [];
                        }

                        if (!this.cotacoesFaltando[jogo.event_id].filter(cotacao => cotacao.chave === chave).length) {
                            this.cotacoesFaltando[jogo.event_id].push({
                                chave: chave,
                                valor: cotacaoLocal.valor,
                                valorFinal: this.helperService.calcularCotacao2String(cotacaoLocal.valor, chave, jogo.event_id, jogo.favorito, false),
                                label: this.helperService.apostaTipoLabel(chave, 'sigla')
                            });
                        }
                    }
                }
            }

            result = true;
        }

        return result;
    }

    jogoBloqueado(eventId) {
        return this.jogosBloqueados ? (this.jogosBloqueados.includes(eventId) ? true : false) : false;
    }

    exibirMais() {
        this.loadingScroll = true;

        if (this.start < this.total) {
            let splice = this.camps.splice(0, this.offset);
            splice = splice.map(campeonato => {
                campeonato.jogos.forEach(jogo => {
                    jogo.cotacoes.forEach(cotacao => {
                        cotacao.valorFinal = this.helperService.calcularCotacao2String(cotacao.valor, cotacao.chave, jogo.event_id, jogo.favorito, false);
                        cotacao.label = this.helperService.apostaTipoLabelCustom(cotacao.chave, jogo.time_a_nome, jogo.time_b_nome)
                    });
                });

                return campeonato;
            });

            this.campeonatos = this.campeonatos.concat(splice);

            this.start++;
        }

        this.loadingScroll = false;
        this.cd.markForCheck();
    }

    // Exibindo todas as cotações daquele jogo selecionado
    maisCotacoes(jogoId) {
        this.jogoIdAtual = jogoId;
        this.jogoSelecionadoId.emit(jogoId);
        this.exibirMaisCotacoes.emit(true);
    }

    exibirBtnProximaData() {
        let result = false;

        if (this.data) {
            const proximaData = moment(this.data).add(1, 'd');
            if (proximaData.day() !== 0 && proximaData.isSameOrBefore(this.dataLimiteTabela)) {
                result = true;
            }
        }

        return result;
    }

    proximaData() {
        const proximaData = moment(this.data).add(1, 'd');

        if (proximaData.isSameOrBefore(this.dataLimiteTabela)) {
            const navigationExtras: NavigationExtras = {
                queryParams: { 'data': proximaData.format('YYYY-MM-DD') }
            };
            this.router.navigate([`/esportes/${this.esporte}`], navigationExtras);
        }
    }

    cotacaoPermitida(cotacao) {
        return this.helperService.cotacaoPermitida(cotacao);
    }

    exibirEscudo() {
        return (this.sportId != 13 && this.sportId != 9 && this.sportId != 151);
    }

    exibirTotalOdds() {
        return this.sportId == 18;
    }
}
