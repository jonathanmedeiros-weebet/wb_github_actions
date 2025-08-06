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

import { NavigationExtras, Router } from '@angular/router';

import { Campeonato, Jogo } from './../../../../models';
import { BilheteEsportivoService, HelperService, ParametrosLocaisService, SidebarService, JogoService, LayoutService, SportIdService } from './../../../../services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import moment from 'moment';
import 'moment/min/locales';

import { TranslateService } from '@ngx-translate/core';
import { has } from 'lodash';
import { Ga4Service, EventGa4Types} from 'src/app/shared/services/ga4/ga4.service';

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
    @Input() campeonatoSelecionado: boolean;
    @Input() regiaoDestaqueSelecionada;
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
    campeonatosBloqueados;
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
    widthOddsScroll = 0;
    nomesJogoWidth = 200;
    navs: ElementRef[];
    enableScrollButtons = false;
    sidebarNavIsCollapsed = false;
    maxOddsSize;
    oddSize = 150;
    unsub$ = new Subject();
    term = '';
    campeonatosTemp = [];
    campeonatosFiltrados = [];
    headerHeight = 92;
    currentLanguage = 'pt';

    nomesCotacoes = [];

    jogosDestaque = [];
    jogosDestaquesIds;

    limiteDiasTabela: number;
    diaHojeMaisDois;
    diaHojeMaisTres;
    diaHojeMaisQuatro;
    diaHojeMaisDoisStr;
    diaHojeMaisTresStr;
    diaHojeMaisQuatroStr;

    tabSelected;

    hasFeaturedMatches = true;

    sportbook;

    teamShieldsFolder;

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
        private jogoService: JogoService,
        private router: Router,
        private translate: TranslateService,
        public layoutService: LayoutService,
        private sportIdService: SportIdService,
        private ga4Service: Ga4Service,
    ) {
        this.sportbook = this.paramsService.getOpcoes().sportbook;
        this.teamShieldsFolder = this.sportIdService.teamShieldsFolder();
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
        this.cd.detectChanges();
        const scrollTemp = this.navs.find((nav) => nav.nativeElement.id === event_id.toString());
        const scrollLeft = scrollTemp.nativeElement.scrollLeft;
        const scrollWidth = scrollTemp.nativeElement.scrollWidth;

        const scrollLeftTemp = this.el.nativeElement.querySelector(`#scroll-left-${event_id}`);
        const scrollRightTemp = this.el.nativeElement.querySelector(`#scroll-right-${event_id}`);

        if (scrollLeftTemp) {
            if (scrollLeft <= 0) {
                this.renderer.addClass(scrollLeftTemp, 'disabled-scroll-button');
                this.renderer.removeClass(scrollLeftTemp, 'enabled-scroll-button');
            } else {
                this.renderer.addClass(scrollLeftTemp, 'enabled-scroll-button');
                this.renderer.removeClass(scrollLeftTemp, 'disabled-scroll-button');
            }
        }

        if (scrollRightTemp) {
            if ((scrollWidth - (scrollLeft + this.maxOddsSize - 50)) <= 0) {
                this.renderer.addClass(scrollRightTemp, 'disabled-scroll-button');
                this.renderer.removeClass(scrollRightTemp, 'enabled-scroll-button');
            } else {
                this.renderer.addClass(scrollRightTemp, 'enabled-scroll-button');
                this.renderer.removeClass(scrollRightTemp, 'disabled-scroll-button');
            }
        }
    }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;
        this.jogosBloqueados = this.paramsService.getJogosBloqueados();
        this.cotacoesLocais = this.paramsService.getCotacoesLocais();
        this.exibirCampeonatosExpandido = this.paramsService.getExibirCampeonatosExpandido();
        this.dataLimiteTabela = this.paramsService.getOpcoes().data_limite_tabela;
        this.offset = this.exibirCampeonatosExpandido ? 7 : 20;
        this.oddsPrincipais = this.paramsService.getOddsPrincipais();
        this.qtdOddsPrincipais = this.oddsPrincipais.length;
        this.campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados(this.sportIdService.footballId);
        this.currentLanguage = this.translate.currentLang;

        this.atualizarDatasJogosFuturos(this.currentLanguage);

        this.translate.onLangChange.subscribe((res) => {
            this.currentLanguage = res.lang;
            this.atualizarDatasJogosFuturos(res.lang);
        });

        this.oddsPrincipais.forEach(oddPrincipal => {
            this.nomesCotacoes.push(this.helperService.apostaTipoLabel(oddPrincipal, 'sigla'));
        });

        this.limiteDiasTabela = moment(this.dataLimiteTabela).diff(moment().set({ 'hour': 0, 'minute': 0, 'seconds': 0, 'millisecond': 0 }), 'days');

        this.sidebarService.collapsedSource
            .subscribe(collapsed => {
                this.sidebarNavIsCollapsed = collapsed;
                this.detectScrollOddsWidth();
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

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.definirAltura();
                this.cd.detectChanges();
            });

        this.layoutService.resetHideSubmenu();
    }

    detectScrollOddsWidth() {
        this.cd.detectChanges();
        const sidesSize = this.sidebarNavIsCollapsed ? 380 : 650;
        const centerSize = window.innerWidth - sidesSize;

        this.nomesJogoWidth = ((centerSize / 100) * 30);
        if (this.nomesJogoWidth < 200) {
            this.nomesJogoWidth = 200;
        }

        if (this.mobileScreen) {
            this.maxOddsSize = window.innerWidth;
        } else {
            this.maxOddsSize = centerSize - this.nomesJogoWidth - 110;
        }

        this.oddSize = this.maxOddsSize / this.qtdOddsPrincipais;
        if (this.oddSize < 95) {
            this.oddSize = 95;
        }

        this.widthOddsScroll = this.maxOddsSize + this.nomesJogoWidth;
        if ((this.oddSize * this.qtdOddsPrincipais) - 28 > this.maxOddsSize) {
            this.enableScrollButtons = true;
        } else {
            this.enableScrollButtons = false;
        }
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (this.contentSportsEl && changes['showLoadingIndicator']) {
            this.contentSportsEl.scrollTop = 0;
        }

        if (changes['data'] && this.data) {
            const diferencaDias = moment(this.data).diff(moment().set({ 'hour': 0, 'minute': 0, 'seconds': 0, 'millisecond': 0 }), 'days');

            if (diferencaDias === 1) {
                this.mudarData('amanha');
            } else {
                this.mudarData('+' + diferencaDias);
            }

            this.campeonatosFiltrados = [];
            this.campeonatosTemp = [];
            this.term = '';
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

            if (moment().isSame(this.data, 'date')) {
                this.getHighlightedGamesIds();
            } else {
                this.jogosDestaquesIds = [];
                this.mapHighlightedGames();
            }
        }

        if (changes['jogosDestaquesIds'] && this.jogosDestaquesIds) {
            this.mapHighlightedGames();
        }
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    getHighlightedGamesIds() {
        this.jogoService.getJogosDestaque()
            .subscribe(jogos => {
                this.jogosDestaquesIds = jogos.results.map(jogo => jogo.fi + '');
                this.mapHighlightedGames(jogos.results);
            });
    }

    mapHighlightedGames(apiHighlightedGames = []) {
        let highlightedGames = [];
        const destaqueIdSet = new Set(this.jogosDestaquesIds.map(id => String(id)));

         if (this.camps && this.camps.length > 0) {
            this.camps.forEach(camp => {
                const jogosSele = camp.jogos.filter(jogo =>
                    destaqueIdSet.has(String(jogo._id))
                );
                highlightedGames = highlightedGames.concat(jogosSele);
            });
        }

        apiHighlightedGames.forEach(jogoDestaque => {
            const jogoId = String(jogoDestaque.fi);
            const exists = highlightedGames.some(jogo => String(jogo._id) === jogoId);

            if (!exists) {
                highlightedGames.push({
                    _id: jogoDestaque.fi,
                    ...jogoDestaque
                });
            }
        });

        this.jogosDestaque = [...highlightedGames];
        this.cd.detectChanges();
    }

    filtrarCampeonatos() {
        if (this.term) {
            if (!this.campeonatosTemp.length && !this.campeonatosFiltrados.length) {
                this.campeonatosTemp = this.campeonatos;
            }

            this.campeonatosFiltrados = this.camps.filter(camp => {
                if (camp.nome.includes(this.term.toUpperCase())  || camp.jogos.some(jogo => jogo.nome.includes(this.term.toUpperCase()))) {
                    return true;
                }
                return false;
            }).map(camp => Object.assign({}, camp));

            if (this.campeonatosFiltrados.length) {
                this.campeonatosFiltrados.map(camp => {
                    let jogosTemp;
                    if (camp.nome.includes(this.term.toUpperCase())) {
                        jogosTemp = camp.jogos;
                    } else {
                        jogosTemp = camp.jogos.filter(jogo => jogo.nome.includes(this.term.toUpperCase()));
                    }

                    camp.jogos = jogosTemp;
                    return this.calcularCotacoes(camp);
                });
            }
            this.campeonatos = this.campeonatosFiltrados;
        } else {
            if (this.campeonatosTemp.length) {
                this.campeonatos = this.campeonatosTemp;
                this.campeonatosTemp = [];
                this.campeonatosFiltrados = [];
            }
        }

        if (this.exibirCampeonatosExpandido) {
            const sliceIds = this.campeonatos.map(campeonato => campeonato._id);
            this.campeonatosAbertos = this.campeonatosAbertos.concat(sliceIds);
        }
    }

    limparPesquisa() {
        this.term = '';
        this.filtrarCampeonatos();
    }

    exibirMais() {
        if ((!this.regiaoSelecionada && !this.term) && this.camps && (this.page <= this.totalPages)) {
            this.loadingScroll = true;

            let slice = this.camps.slice(this.start, (this.page * this.offset));

            slice = slice.map(campeonato => {
                return this.calcularCotacoes(campeonato);
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

    calcularCotacoes(campeonato: Campeonato) {
        campeonato.jogos.forEach(jogo => {
            const cotacoesLocalJogo = this.getCotacaoLocal(jogo);

            jogo.cotacoes.forEach(cotacao => {
                const cotacaoLocal = cotacoesLocalJogo[cotacao.chave];
                cotacao.valorFinal = this.helperService.calcularCotacao2String(
                    cotacaoLocal ? cotacaoLocal.valor : cotacao.valor,
                    cotacao.chave,
                    jogo.event_id,
                    jogo.favorito,
                    false);
                cotacao.label = this.helperService.apostaTipoLabel(cotacao.chave, 'sigla');
                cotacao.nome_pt = this.helperService.apostaTipoLabel(cotacao.chave, null, 'pt');
                cotacao.nome_en = this.helperService.apostaTipoLabel(cotacao.chave, null, 'en');
                cotacao.nome_es = this.helperService.apostaTipoLabel(cotacao.chave, null, 'es');
            });

            this.oddsPrincipais.forEach(oddPrincipal => {
                const possuiCotacao = jogo.cotacoes.find(c => c.chave === oddPrincipal);

                if (!possuiCotacao && (Object.keys(cotacoesLocalJogo).length)) {
                    const cotacaoLocal = cotacoesLocalJogo[oddPrincipal];
                    jogo.cotacoes.push({
                        _id: undefined,
                        chave: oddPrincipal,
                        jogo: undefined,
                        jogoId: jogo._id,
                        label: this.helperService.apostaTipoLabel(oddPrincipal, 'sigla'),
                        nome: this.helperService.apostaTipoLabel(oddPrincipal),
                        nome_pt: this.helperService.apostaTipoLabel(oddPrincipal, null, 'pt'),
                        nome_en: this.helperService.apostaTipoLabel(oddPrincipal, null, 'en'),
                        nome_es: this.helperService.apostaTipoLabel(oddPrincipal, null, 'es'),
                        valor: cotacaoLocal ? cotacaoLocal.valor : 0,
                        valorFinal: this.helperService.calcularCotacao2String(
                            cotacaoLocal ? cotacaoLocal.valor : 0,
                            oddPrincipal,
                            jogo.event_id,
                            jogo.favorito,
                            false)
                    });

                    jogo.total_cotacoes += 1;
                }
            });
        });

        return campeonato;
    }

    trackById(index: number, campeonato: any): string {
        return campeonato._id;
    }

    definirAltura() {
        const headerHeight = this.mobileScreen ? 161 : this.headerHeight;
        const altura = window.innerHeight - headerHeight;
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

        this.ga4Service.triggerGa4Event(
            EventGa4Types.ADD_TO_CART,
            {
                game: item.jogo_nome,
                team_bet: cotacao.chave,
                value: cotacao.valorFinal
            }
        );
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

    getCotacaoLocal(jogo) {
        const cotacoesLocais = this.cotacoesLocais[jogo.event_id];

        if (cotacoesLocais) {
            return cotacoesLocais;
        } else {
            return false;
        }
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
        if (this.campeonatosBloqueados.includes(campeonatoId)) {
            return false;
        } else {
            return this.campeonatosAbertos.includes(campeonatoId);
        }
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
        this.ga4Service.triggerGa4Event(EventGa4Types.VIEW_ITEM);
    }

    mudarData(dia = 'hoje') {
        let data;

        switch (dia) {
            case 'amanha':
                this.tabSelected = 'amanha';
                data = moment().add(1, 'd').format('YYYY-MM-DD');
                break;
            case '+2':
                this.tabSelected = 'doisdias';
                data = moment().add(2, 'd').format('YYYY-MM-DD');
                break;
            case '+3':
                this.tabSelected = 'tresdias';
                data = moment().add(3, 'd').format('YYYY-MM-DD');
                break;
            case '+4':
                this.tabSelected = 'quatrodias';
                data = moment().add(4, 'd').format('YYYY-MM-DD');
                break;
            default:
                this.tabSelected = null;
                data = '';
                break;
        }

        const navigationExtras: NavigationExtras = {
            queryParams: data ? { 'data': data } : {}
        };
        this.router.navigate(['/esportes/futebol'], navigationExtras);
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

    focusPesquisa(focus = true) {
        if (this.mobileScreen) {
            const inactiveDaysButtons = this.el.nativeElement.getElementsByClassName(`tab inactive`);
            if (focus) {
                for (const inactiveDayButton of inactiveDaysButtons) {
                    this.renderer.addClass(inactiveDayButton, 'ocultar-tab');
                }
            } else {
                for (const inactiveDayButton of inactiveDaysButtons) {
                    this.renderer.removeClass(inactiveDayButton, 'ocultar-tab');
                }
            }
        }
    }

    imageError(event: Event) {
        (event.target as HTMLImageElement).src = '';
    }

    atualizarDatasJogosFuturos(lang = 'pt') {
        switch (lang) {
            case 'pt':
                moment.updateLocale('pt-br', { parentLocale: 'pt-br' });
                break;
            case 'en':
                moment.updateLocale('en-gb', { parentLocale: 'en-gb' });
                break;
            default:
                moment.updateLocale('pt-br', { parentLocale: 'pt-br' });
        }

        this.diaHojeMaisDois = moment().add(2, 'd');
        this.diaHojeMaisTres = moment().add(3, 'd');
        this.diaHojeMaisQuatro = moment().add(4, 'd');

        this.diaHojeMaisDoisStr = this.diaHojeMaisDois.format(this.mobileScreen ? 'ddd' : 'dddd');
        this.diaHojeMaisTresStr = this.diaHojeMaisTres.format(this.mobileScreen ? 'ddd' : 'dddd');
        this.diaHojeMaisQuatroStr = this.diaHojeMaisQuatro.format(this.mobileScreen ? 'ddd' : 'dddd');
    }

    changeDisplayFeaturedMatches(hasFeaturedMatches: boolean) {
        this.hasFeaturedMatches = hasFeaturedMatches;
    }

    eventoSearch(e){
        if(e.target.value){
            this.ga4Service.triggerGa4Event(
                EventGa4Types.SEARCH,
                {
                    search_term: e.target.value,
                }
            );
        }
    }
}
