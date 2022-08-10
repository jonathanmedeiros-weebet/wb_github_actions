import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    Renderer2,
    SimpleChange,
    ViewChildren
} from '@angular/core';

import {NavigationExtras, Router} from '@angular/router';

import {Campeonato, Jogo} from './../../../../models';
import {BilheteEsportivoService, HelperService, ParametrosLocaisService, SidebarService} from './../../../../services';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-futebol-listagem',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'futebol-listagem.component.html',
    styleUrls: ['futebol-listagem.component.css']
})
export class FutebolListagemComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @ViewChildren('scrollOdds') private oddsNavs: QueryList<ElementRef>;
    @Input() showLoadingIndicator;
    @Input() jogoIdAtual;
    @Input() camps: Campeonato[];
    @Input() data;
    @Output() jogoSelecionadoId = new EventEmitter();
    @Output() exibirMaisCotacoes = new EventEmitter();
    mobileScreen = true;
    campeonatos: Campeonato[];
    campeonatosAbertos = [];
    itens = [];
    itensSelecionados = {};
    cotacoesFaltando = {};
    cotacoesLocais;
    jogosBloqueados;
    dataLimiteTabela;
    contentSportsEl;
    start;
    page = 1;
    offset;
    totalPages;
    exibirCampeonatosExpandido;
    loadingScroll = false;
    regiaoSelecionada;
    qtdOddsPrincipais = 3;
    oddsPrincipais;
    widthOddsScroll = 450;
    nomesJogoWidth = 250;
    navs: ElementRef[];
    enableScrollButtons = false;
    sidebarNavIsCollapsed = false;
    maxOddsSize;
    unsub$ = new Subject();

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.detectScrollOddsWidth();
    }

    constructor(
        private bilheteService: BilheteEsportivoService,
        private sidebarService: SidebarService,
        private renderer: Renderer2,
        private el: ElementRef,
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService,
        private cd: ChangeDetectorRef,
        private router: Router
    ) {
    }

    ngAfterViewInit(): void {
        this.oddsNavs.changes.subscribe((navs) => {
            this.navs = navs.toArray();
        });
    }

    moveLeft(event_id) {
        const scrollTemp = this.navs.find((nav) => nav.nativeElement.id === event_id.toString());
        scrollTemp.nativeElement.scrollLeft -= 150;
    }

    moveRight(event_id) {
        const scrollTemp = this.navs.find((nav) => nav.nativeElement.id === event_id.toString());
        scrollTemp.nativeElement.scrollLeft += 150;
    }

    onScroll(event_id) {
        const scrollTemp = this.navs.find((nav) => nav.nativeElement.id === event_id.toString());
        const scrollLeft = scrollTemp.nativeElement.scrollLeft;
        const scrollWidth = scrollTemp.nativeElement.scrollWidth;

        const scrollLeftTemp = this.el.nativeElement.querySelector(`#scroll-left-${event_id}`);
        const scrollRightTemp = this.el.nativeElement.querySelector(`#scroll-right-${event_id}`);

        if (scrollLeft <= 0) {
            this.renderer.addClass(scrollLeftTemp, 'disabled-scroll-button');
            this.renderer.removeClass(scrollLeftTemp, 'enabled-scroll-button');
        } else {
            this.renderer.addClass(scrollLeftTemp, 'enabled-scroll-button');
            this.renderer.removeClass(scrollLeftTemp, 'disabled-scroll-button');
        }

        if ((scrollWidth - (scrollLeft + this.widthOddsScroll)) <= 0) {
            this.renderer.addClass(scrollRightTemp, 'disabled-scroll-button');
            this.renderer.removeClass(scrollRightTemp, 'enabled-scroll-button');
        } else {
            this.renderer.addClass(scrollRightTemp, 'enabled-scroll-button');
            this.renderer.removeClass(scrollRightTemp, 'disabled-scroll-button');
        }
    }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;
        this.definirAltura();
        this.jogosBloqueados = this.paramsService.getJogosBloqueados();
        this.cotacoesLocais = this.paramsService.getCotacoesLocais();
        this.exibirCampeonatosExpandido = this.paramsService.getExibirCampeonatosExpandido();
        this.dataLimiteTabela = this.paramsService.getOpcoes().data_limite_tabela;
        this.offset = this.exibirCampeonatosExpandido ? 7 : 20;
        this.oddsPrincipais = this.paramsService.getOddsPrincipais();
        this.qtdOddsPrincipais = this.oddsPrincipais.length;

        this.sidebarService.collapsedSource
            .subscribe(collapsed => {
                this.sidebarNavIsCollapsed = collapsed;
            });

        this.detectScrollOddsWidth();

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

    detectScrollOddsWidth() {
        this.cd.detectChanges();

        this.widthOddsScroll = this.qtdOddsPrincipais > 3 ? this.qtdOddsPrincipais * 95 : this.qtdOddsPrincipais * 150;

        const sidesSize = this.sidebarNavIsCollapsed ? 270 : 540;
        this.maxOddsSize = window.innerWidth - (sidesSize + 250 + 65);

        this.enableScrollButtons = this.widthOddsScroll > this.maxOddsSize;
        if (this.enableScrollButtons) {
            this.widthOddsScroll = this.maxOddsSize;
        }
        this.nomesJogoWidth = window.innerWidth - (sidesSize + 65 + this.widthOddsScroll);
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (this.contentSportsEl && changes['showLoadingIndicator']) {
            this.contentSportsEl.scrollTop = 0;
        }

        if (changes['camps'] && this.camps) {
            this.regiaoSelecionada = null;
            this.start = 0;
            this.page = 1;
            this.totalPages = Math.ceil(this.camps.length / this.offset);
            this.campeonatos = [];
            this.campeonatosAbertos = [];
            this.exibirMais();

            if (this.camps.length > 0) {
                setTimeout(() => {
                    let altura;
                    let scrollHeight;
                    if (this.mobileScreen) {
                        altura = window.innerHeight - 98;
                        scrollHeight = this.contentSportsEl.scrollHeight - 90;
                    } else {
                        altura = window.innerHeight - 46;
                        scrollHeight = this.contentSportsEl.scrollHeight;
                    }
                    if (scrollHeight <= altura) {
                        this.exibirMais();
                    }
                }, 1000);
            }
        }
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    exibirMais() {
        if (!this.regiaoSelecionada && this.camps && (this.page <= this.totalPages)) {
            this.loadingScroll = true;

            let slice = this.camps.slice(this.start, (this.page * this.offset));

            slice = slice.map(campeonato => {
                campeonato.jogos.forEach(jogo => {
                    jogo.cotacoes.forEach(cotacao => {
                        cotacao.valorFinal = this.helperService.calcularCotacao2String(
                            cotacao.valor,
                            cotacao.chave,
                            jogo.event_id,
                            jogo.favorito,
                            false);
                        cotacao.label = this.helperService.apostaTipoLabel(cotacao.chave, 'sigla');
                    });
                    if (jogo.cotacoes.length < this.qtdOddsPrincipais) {
                        const diferenca = this.qtdOddsPrincipais - jogo.cotacoes.length;
                        for (let i = 0; i < diferenca; i++) {
                            jogo.cotacoes.push({
                                _id: undefined,
                                chave: '',
                                jogo: undefined,
                                jogoId: 0,
                                label: undefined,
                                nome: '',
                                valor: 0,
                                valorFinal: undefined
                            });
                        }
                    }
                });

                return campeonato;
            });

            this.campeonatos = this.campeonatos.concat(slice);

            if (this.exibirCampeonatosExpandido) {
                const sliceIds = slice.map(campeonato => campeonato._id);
                this.campeonatosAbertos = this.campeonatosAbertos.concat(sliceIds);
            }

            this.start = (this.page * this.offset);
            this.page++;

            this.loadingScroll = false;
            this.cd.markForCheck();
        }
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
                                valorFinal: this.helperService.calcularCotacao2String(
                                    cotacaoLocal.valor,
                                    chave,
                                    jogo.event_id,
                                    jogo.favorito,
                                    false
                                ),
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
        return this.jogosBloqueados ? (!!this.jogosBloqueados.includes(eventId)) : false;
    }

    toggleCampeonato(campeonatoId) {
        const index = this.campeonatosAbertos.findIndex(id => id === campeonatoId);
        if (index >= 0) {
            this.campeonatosAbertos.splice(index, 1);
        } else {
            this.campeonatosAbertos.push(campeonatoId);
        }
    }

    campeonatoAberto(campeonatoId) {
        return this.campeonatosAbertos.includes(campeonatoId);
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

    // Exibindo todas as cotações daquele jogo selecionado
    maisCotacoes(jogoId) {
        this.jogoIdAtual = jogoId;
        this.jogoSelecionadoId.emit(jogoId);
        this.exibirMaisCotacoes.emit(true);
    }

    exibirBtnProximaData() {
        let result = false;

        if (this.data && !this.regiaoSelecionada) {
            const proximaData = moment(this.data);
            if (proximaData.day() !== 0) {
                result = true;
            }
        }

        return result;
    }

    proximaData() {
        const proximaData = moment(this.data).add(1, 'd').format('YYYY-MM-DD');
        const navigationExtras: NavigationExtras = {
            queryParams: {'data': proximaData}
        };
        this.router.navigate(['/esportes/futebol/jogos'], navigationExtras);
    }

    cotacaoPermitida(cotacao) {
        return this.helperService.cotacaoPermitida(cotacao);
    }

    receptorRegiaoSelecionada(regiaoSelecionada) {
        if (regiaoSelecionada) {
            this.regiaoSelecionada = regiaoSelecionada;

            const filteredCamps = this.camps.filter(camp => camp.nome.substring(0, camp.nome.indexOf(':')) === regiaoSelecionada);
            filteredCamps.map(campeonato => {
                campeonato.jogos.forEach(jogo => {
                    jogo.cotacoes.forEach(cotacao => {
                        cotacao.valorFinal = this.helperService.calcularCotacao2String(
                            cotacao.valor,
                            cotacao.chave,
                            jogo.event_id,
                            jogo.favorito,
                            false
                        );
                        cotacao.label = this.helperService.apostaTipoLabel(cotacao.chave, 'sigla');
                    });
                });

                return campeonato;
            });

            if (this.exibirCampeonatosExpandido) {
                const spliceIds = filteredCamps.map(campeonato => campeonato._id);
                this.campeonatosAbertos = this.campeonatosAbertos.concat(spliceIds);
            }

            this.campeonatos = filteredCamps;
        } else {
            this.page = 1;
            this.start = 0;
            this.campeonatos = [];
            this.regiaoSelecionada = null;
            this.exibirMais();
        }

    }

    imageError(event: Event) {
        (event.target as HTMLImageElement).src = '';
    }
}
