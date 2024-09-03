import {
    Component, OnInit, OnDestroy, Renderer2, ElementRef,
    Input, ChangeDetectorRef, ChangeDetectionStrategy,
    SimpleChange, OnChanges, Output, EventEmitter
} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { Campeonato, Jogo } from '../../../models';
import { ParametrosLocaisService, BilheteEsportivoService, HelperService, LayoutService } from '../../../services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/min/locales';

import { BasqueteJogoComponent } from '../basquete-jogo/basquete-jogo.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import * as sportsIds from '../../../shared/constants/sports-ids';

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
    @Input() campeonatoSelecionado: boolean;
    @Output() jogoSelecionadoId = new EventEmitter();
    @Output() exibirMaisCotacoes = new EventEmitter();
    mobileScreen = true;
    campeonatos: Campeonato[];
    itens = [];
    itensSelecionados = {};
    cotacoesFaltando = {};
    exibirCampeonatosExpandido;
    campeonatosAbertos = [];
    cotacoesLocais;
    jogosBloqueados;
    dataLimiteTabela;
    contentSportsEl;
    start;
    page = 1;
    offset = 7;
    totalPages;
    loadingScroll = false;
    unsub$ = new Subject();
    term = '';
    campeonatosTemp = [];
    campeonatosFiltrados = [];
    headerHeight = 92;

    modalRef;

    limiteDiasTabela: number;
    diaHojeMaisDois;
    diaHojeMaisTres;
    diaHojeMaisQuatro;

    diaHojeMaisDoisStr;
    diaHojeMaisTresStr;
    diaHojeMaisQuatroStr;

    tabSelected;

    basketballId = sportsIds.BASKETBALL_ID;
    futsalId = sportsIds.FUTSAL_ID;

    iconesGenericos = {
        'basquete': 'wbicon icon-basquete',
        'volei': 'wbicon icon-volei',
        'tenis': 'wbicon icon-tenis',
        'combate': 'wbicon icon-luta',
        'futsal': 'wbicon icon-futsal',
        'futebol-americano': 'wbicon icon-futebol-americano',
        'esports': 'wbicon icon-e-sports',
        'hoquei-gelo': 'wbicon icon-hoquei-no-gelo',
    };

    constructor(
        private bilheteService: BilheteEsportivoService,
        private renderer: Renderer2,
        private el: ElementRef,
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService,
        private cd: ChangeDetectorRef,
        private router: Router,
        private modalService: NgbModal,
        private translate: TranslateService,
        public layoutService: LayoutService
    ) { }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;
        this.definirAltura();
        this.jogosBloqueados = this.paramsService.getJogosBloqueados();
        this.cotacoesLocais = this.paramsService.getCotacoesLocais();
        this.dataLimiteTabela = this.paramsService.getOpcoes().data_limite_tabela;
        this.exibirCampeonatosExpandido = this.paramsService.getExibirCampeonatosExpandido();

        this.limiteDiasTabela = moment(this.dataLimiteTabela).diff(moment().set({ 'hour': 0, 'minute': 0, 'seconds': 0, 'millisecond': 0 }), 'days');

        this.atualizarDatasJogosFuturos(this.translate.currentLang);

        this.translate.onLangChange.subscribe((res) => {
            this.atualizarDatasJogosFuturos(res.lang);
        });

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
            this.start = 0;
            this.page = 1;
            this.totalPages = Math.ceil(this.camps.length / this.offset);
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
                                    jogo.event_id, jogo.favorito,
                                    false),
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

    filtrarCampeonatos() {
        if (this.term) {
            if (!this.campeonatosTemp.length && !this.campeonatosFiltrados.length) {
                this.campeonatosTemp = this.campeonatos;
            }

            this.campeonatosFiltrados = this.camps.filter(camp => {
                if (camp.jogos.some(jogo => jogo.nome.includes(this.term.toUpperCase()))) {
                    return true;
                }
                return false;
            }).map(camp => Object.assign({}, camp));

            if (this.campeonatosFiltrados.length) {
                this.campeonatosFiltrados.map(camp => {
                    let jogosTemp;
                    jogosTemp = camp.jogos.filter(jogo => jogo.nome.includes(this.term.toUpperCase()));

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

        this.router.navigate([this.router.url.split('?')[0]], navigationExtras);
    }

    exibirMais() {
        if (!this.term && this.camps && (this.page <= this.totalPages)) {
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
            jogo.cotacoes.forEach(cotacao => {
                cotacao.valorFinal = this.helperService.calcularCotacao2String(
                    cotacao.valor,
                    cotacao.chave,
                    jogo.event_id,
                    jogo.favorito,
                    false);
                cotacao.label = this.helperService.apostaTipoLabelCustom(cotacao.chave, jogo.time_a_nome, jogo.time_b_nome, jogo.sport_id);

            });
        });

        return campeonato;
    }

    // Exibindo todas as cotações daquele jogo selecionado
    maisCotacoes(jogoId) {
        this.jogoIdAtual = jogoId;

        if (this.mobileScreen) {
            this.modalRef = this.modalService.open(BasqueteJogoComponent);
            this.modalRef.componentInstance.jogoId = this.jogoIdAtual;
        } else {
            this.jogoSelecionadoId.emit(jogoId);
            this.exibirMaisCotacoes.emit(true);
        }
    }

    cotacaoPermitida(cotacao) {
        return this.helperService.cotacaoPermitida(cotacao);
    }

    exibirEscudo() {
        return (this.sportId !== sportsIds.TENNIS_ID && this.sportId !== sportsIds.BOXING_ID && this.sportId !== sportsIds.E_SPORTS_ID);
    }

    exibirTotalOdds() {
        return this.sportId === sportsIds.BASKETBALL_ID;
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
}
