import {
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
    Renderer2
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Jogo} from './../../../../models';
import {BilheteEsportivoService, HelperService, JogoService, MessageService, ParametrosLocaisService} from './../../../../services';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-futebol-jogo',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'futebol-jogo.component.html',
    styleUrls: ['futebol-jogo.component.css']
})
export class FutebolJogoComponent implements OnInit, OnChanges, OnDestroy {
    jogo: Jogo;
    @Input() jogoId;
    @Input() exibindoMaisCotacoes: boolean;
    @Output() exibirMaisCotacoes = new EventEmitter();
    isMobile = false;
    mercados90: any = {};
    mercados1T: any = {};
    mercados2T: any = {};
    mercadosJogadores: any = {};
    mercadosPorJogadores: any = {};
    itens = [];
    itensSelecionados = {};
    tiposAposta;
    cotacoesLocais;
    objectKeys = Object.keys;
    showLoadingIndicator = true;
    contentSportsEl;
    altura;
    unicaColuna = false;
    unsub$ = new Subject();
    oddsAberto = [];
    currentLanguage: string = 'pt';

    multiMarcadores = true;
    marcadores = true;
    cartoes = true;
    golsCasa = true;
    golsFora = true;

    theSportUrl: SafeResourceUrl;
    loadedFrame: boolean;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.definirAltura();
        this.cd.detectChanges();
    }

    constructor(
        private jogoService: JogoService,
        public sanitizer: DomSanitizer,
        private bilheteService: BilheteEsportivoService,
        private helperService: HelperService,
        private messageService: MessageService,
        private el: ElementRef,
        private renderer: Renderer2,
        private paramsService: ParametrosLocaisService,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef,
        private activeModal: NgbActiveModal,
        private translate: TranslateService
    ) {
    }

    ngOnInit() {
        const { habilitar_live_tracker } = this.paramsService.getOpcoes();
        if (window.innerWidth <= 1024) {
            this.isMobile = true;

            const altura = window.innerHeight;
            const containerJogoEl = this.el.nativeElement.querySelector('.jogo-container');
            this.renderer.setStyle(containerJogoEl, 'height', `${altura}px`);
        }

        this.currentLanguage = this.translate.currentLang;

        this.translate.onLangChange.subscribe(res => this.currentLanguage = res.lang);

        this.definirAltura();
        this.tiposAposta = this.paramsService.getTiposAposta();
        this.cotacoesLocais = this.paramsService.getCotacoesLocais();

        // Recebendo os itens atuais do bilhete
        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => {
                this.itens = itens;

                this.itensSelecionados = {};
                for (let i = 0; i < itens.length; i++) {
                    const item = itens[i];
                    if (item.cotacao.nome) {
                        const modificado = item.cotacao.nome.replace(' ', '_');
                        this.itensSelecionados[`${item.jogo_id}_${item.cotacao.chave}_${modificado}`] = true;
                    } else {
                        this.itensSelecionados[`${item.jogo_id}_${item.cotacao.chave}`] = true;
                    }
                }

                this.cd.markForCheck();
            });

        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                this.contentSportsEl.scrollTop = 0;
            });

        if (this.jogoId) {
            this.jogoService.getJogo(this.jogoId)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    jogo => {
                        this.jogo = jogo;
                        this.mapearOdds(jogo.cotacoes);

                        if (habilitar_live_tracker && jogo.live_track_id) {
                            if (window.innerWidth <= 1024) {
                                this.theSportUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://widgets-v2.thesports01.com/br/pro/football?profile=5oq66hkn0cwunq7&uuid=' + jogo?.live_track_id);
                            } else {
                                if (this.exibindoMaisCotacoes) {
                                    this.bilheteService.sendId(jogo.live_track_id);
                                } else {
                                    this.bilheteService.sendId(null);
                                }
                            }
                        }
                        this.loadedFrame = true;
                        this.cd.markForCheck();
                    },
                    error => this.messageService.error(error)
                );
        }
    }

    ngOnChanges() {
        const { habilitar_live_tracker } = this.paramsService.getOpcoes();
        this.oddsAberto = [];

        if (this.jogoId) {
            this.showLoadingIndicator = true;

            this.jogoService.getJogo(this.jogoId)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    jogo => {
                        this.jogo = jogo;
                        this.mapearOdds(jogo.cotacoes);

                        if (habilitar_live_tracker && jogo.live_track_id) {
                            if (this.exibindoMaisCotacoes) {
                                this.bilheteService.sendId(jogo.live_track_id);
                            } else {
                                this.bilheteService.sendId(null);
                            }
                        } else {
                            this.bilheteService.sendId(null);
                        }
                    },
                    error => this.messageService.error(error)
                );
        }
    }

    ngOnDestroy() {
        this.bilheteService.sendId(null);
        this.unsub$.next();
        this.unsub$.complete();
    }

    definirAltura() {
        this.altura = window.innerHeight;
        this.unicaColuna = window.innerWidth <= 1279;

        if (this.isMobile) {
            this.altura -= 220;
        } else {
            this.altura -= 190 + ((window.innerHeight / 100) * 20);
        }

        this.contentSportsEl = this.el.nativeElement.querySelector('.content-sports-jogo');
        this.renderer.setStyle(this.contentSportsEl, 'height', `${this.altura}px`);
    }

    back() {
        if (this.isMobile) {
            this.activeModal.close();
        } else {
            this.exibirMaisCotacoes.emit(false);
        }
    }

    mapearOdds(odds) {
        const mercados90 = {};
        const mercados1T = {};
        const mercados2T = {};
        const mercadosJogadores = {};

        for (let index = 0; index < odds.length; index++) {
            const odd = odds[index];
            const tipoAposta = this.tiposAposta[odd.chave];

            if (tipoAposta) {
                let obj;
                if (tipoAposta.tempo === '90') {
                    obj = mercados90;
                } else if (tipoAposta.tempo === '1T') {
                    obj = mercados1T;
                } else if (tipoAposta.tempo === '2T') {
                    obj = mercados2T;
                } else if (tipoAposta.tempo === 'JOGADORES') {
                    obj = mercadosJogadores;
                } else {
                    continue;
                }

                let mercado = obj[tipoAposta.cat_chave];

                if (!mercado) {
                    // categoria
                    mercado = {
                        'nome': tipoAposta.cat_nome,
                        'nome_pt': tipoAposta.cat_nome_pt ?? tipoAposta.cat_nome,
                        'nome_en': tipoAposta.cat_nome_en ?? tipoAposta.cat_nome,
                        'nome_es': tipoAposta.cat_nome_es ?? tipoAposta.cat_nome,
                        'tempo': tipoAposta.tempo,
                        'principal': tipoAposta.p,
                        'posicao': tipoAposta.cat_posicao,
                        'colunas': tipoAposta.cat_colunas,
                        'colunasMobile': tipoAposta.cat_colunas_mobile,
                        'odds': []
                    };
                    obj[tipoAposta.cat_chave] = mercado;
                }

                odd.posicaoX = tipoAposta.posicao_x;
                odd.posicaoY = tipoAposta.posicao_y;
                odd.posicaoXMobile = tipoAposta.posicao_x_mobile;
                odd.posicaoYMobile = tipoAposta.posicao_y_mobile;
                odd.label = tipoAposta.nome;
                odd.label_pt = tipoAposta.nome_pt ?? tipoAposta.nome;
                odd.label_en = tipoAposta.nome_en ?? tipoAposta.nome;
                odd.label_es = tipoAposta.nome_es ?? tipoAposta.nome;
                odd.valorFinal = this.helperService.calcularCotacao2String(
                    odd.valor,
                    odd.chave,
                    this.jogo.event_id,
                    this.jogo.favorito,
                    false
                );

                mercado.odds.push(odd);
                if (this.oddsAberto.findIndex(id => id === mercado.nome) < 0) {
                    this.oddsAberto.push(mercado.nome);
                }

                if (this.cotacoesLocais[this.jogo.event_id] && this.cotacoesLocais[this.jogo.event_id][odd.chave]) {
                    this.cotacoesLocais[this.jogo.event_id][odd.chave].usou = true;
                }
            }
        }

        // Exibir odds locais que não vinheram no center
        if (this.cotacoesLocais[this.jogo.event_id]) {
            for (const chave in this.cotacoesLocais[this.jogo.event_id]) {
                if (this.cotacoesLocais[this.jogo.event_id].hasOwnProperty(chave)) {
                    const cotacaoLocal = this.cotacoesLocais[this.jogo.event_id][chave];

                    if (!cotacaoLocal.usou) {
                        const tipoAposta = this.tiposAposta[chave];

                        if (tipoAposta) {
                            let obj;
                            if (tipoAposta.tempo === '90') {
                                obj = mercados90;
                            } else if (tipoAposta.tempo === '1T') {
                                obj = mercados1T;
                            } else if (tipoAposta.tempo === '2T') {
                                obj = mercados2T;
                            } else {
                                continue;
                            }

                            let mercado = obj[tipoAposta.cat_chave];

                            if (!mercado) {
                                mercado = {
                                    'nome': tipoAposta.cat_nome,
                                    'nome_pt': tipoAposta.cat_nome_pt ?? tipoAposta.cat_nome,
                                    'nome_en': tipoAposta.cat_nome_en ?? tipoAposta.cat_nome,
                                    'nome_es': tipoAposta.cat_nome_es ?? tipoAposta.cat_nome,
                                    'tempo': tipoAposta.tempo,
                                    'principal': tipoAposta.p,
                                    'posicao': tipoAposta.cat_posicao,
                                    'colunas': tipoAposta.cat_colunas,
                                    'colunasMobile': tipoAposta.cat_colunas_mobile,
                                    'odds': []
                                };
                                obj[tipoAposta.cat_chave] = mercado;
                            }

                            const cotacao = {
                                chave: chave,
                                label: tipoAposta.nome,
                                label_pt: tipoAposta.nome_pt ?? tipoAposta.nome,
                                label_en: tipoAposta.nome_en ?? tipoAposta.nome,
                                label_es: tipoAposta.nome_es ?? tipoAposta.nome,
                                valor: cotacaoLocal.valor,
                                valorFinal: this.helperService.calcularCotacao2String(
                                    cotacaoLocal.valor,
                                    chave, this.jogo.event_id,
                                    this.jogo.favorito,
                                    false
                                ),
                                posicaoX: tipoAposta.posicao_x_mobile,
                                posicaoY: tipoAposta.posicao_x_mobile,
                                posicaoXMobile: tipoAposta.posicao_x_mobile,
                                posicaoYMobile: tipoAposta.posicao_x_mobile,
                            };

                            mercado.odds.push(cotacao);
                            if (this.oddsAberto.findIndex(id => id === mercado.nome) < 0) {
                                this.oddsAberto.push(mercado.nome);
                            }
                        }
                    }
                }
            }
        }

        this.mercados90 = this.organizarMercados(mercados90);
        this.mercados1T = this.organizarMercados(mercados1T);
        this.mercados2T = this.organizarMercados(mercados2T);
        // this.mercadosJogadores = this.organizarMercados(mercadosJogadores);
        this.mercadosPorJogadores = this.organizarMercados(mercadosJogadores, true);

        this.showLoadingIndicator = false;
        this.cd.detectChanges();
    }

    addCotacao(jogo: Jogo, cotacao) {
        let modificado = false;
        const indexGame = this.itens.findIndex(i => i.jogo._id === jogo._id);
        const indexOdd = this.itens.findIndex(i => {
            let result = false;
            if (cotacao.nome) {
                if ((i.jogo._id === jogo._id) && (i.cotacao.chave === cotacao.chave) && (i.cotacao.nome === cotacao.nome)) {
                    result = true;
                }
            } else if ((i.jogo._id === jogo._id) && (i.cotacao.chave === cotacao.chave)) {
                result = true;
            }
            return result;
        });

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
            modificado: false,
            cotacao_antiga: null
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
        return !!this.tiposAposta[odd];
    }

    itemSelecionado(jogo, cotacao) {
        let result = false;
        if (cotacao.nome) {
            const modificado = cotacao.nome.replace(' ', '_');
            if (this.itensSelecionados[`${jogo._id}_${cotacao.chave}_${modificado}`]) {
                result = true;
            }
        } else if (this.itensSelecionados[`${jogo._id}_${cotacao.chave}`]) {
            result = true;
        }
        return result;
    }

    private organizarMercados(mercados, mercadoJogadores = false) {
        const mercadosOrganizados = {};

        if (mercadoJogadores) {
            const jogadoresMercados = [];
            for (const chave in mercados) {
                mercados[chave].odds.forEach((odd) => {
                    const casaFora = chave.includes('casa') ? 'casa' : chave.includes('fora') ? 'fora' : null;
                    let chaveJogador = null;

                    const verificacaoJogador = jogadoresMercados.some((item, key) => {
                        chaveJogador = key;
                        return item.nome === odd.nome;
                    });

                    if (!verificacaoJogador) {
                        const temp = {
                            nome: odd.nome,
                            m_gols: {},
                            m_marcadores: {},
                            m_cartoes: {},
                            m_gols_casa: {},
                            m_gols_fora: {},
                            casa_fora: casaFora
                        };
                        jogadoresMercados.push(temp);
                    } else {
                        if (!jogadoresMercados[chaveJogador].casa_fora) {
                            jogadoresMercados[chaveJogador].casa_fora = casaFora;
                        }
                    }
                });
            }

            jogadoresMercados.forEach((jogador) => {
                const mercadosJogador = {};
                for (const chave in mercados) {
                    const mercadoTemp = mercados[chave].odds.filter((odd) => {
                        return (odd.nome === jogador.nome && odd.nome !== 'No Bookings');
                    });

                    mercadosJogador[chave] = mercadoTemp[0] ? mercadoTemp[0] : {};
                }

                jogador['m_gols']['jogador_marca_primeiro'] = this.checkEmpty(mercadosJogador['jogador_marca_primeiro']);
                jogador['m_gols']['jogador_marca_ultimo'] = this.checkEmpty(mercadosJogador['jogador_marca_ultimo']);
                jogador['m_gols']['jogador_marca_qualquer_momento'] = this.checkEmpty(mercadosJogador['jogador_marca_qualquer_momento']);

                jogador['m_marcadores']['jogador_marca_2_ou_mais_gols'] = this.checkEmpty(mercadosJogador['jogador_marca_2_ou_mais_gols']);
                jogador['m_marcadores']['jogador_marca_3_ou_mais_gols'] = this.checkEmpty(mercadosJogador['jogador_marca_3_ou_mais_gols']);

                jogador['m_cartoes']['jogador_recebera_primeiro_cartao'] = this.checkEmpty(mercadosJogador['jogador_recebera_primeiro_cartao']);
                jogador['m_cartoes']['jogador_recebera_cartao'] = this.checkEmpty(mercadosJogador['jogador_recebera_cartao']);
                jogador['m_cartoes']['jogador_sera_expulso'] = this.checkEmpty(mercadosJogador['jogador_sera_expulso']);

                if (jogador.casa_fora === 'casa') {
                    jogador['m_gols_casa']['jogador_marca_1st_gol_casa'] = this.checkEmpty(mercadosJogador['jogador_marca_1st_gol_casa']);
                    jogador['m_gols_casa']['jogador_marca_ultimo_gol_casa'] = this.checkEmpty(mercadosJogador['jogador_marca_ultimo_gol_casa']);
                }

                if (jogador.casa_fora === 'fora') {
                    jogador['m_gols_fora']['jogador_marca_1st_gol_fora'] = this.checkEmpty(mercadosJogador['jogador_marca_1st_gol_fora']);
                    jogador['m_gols_fora']['jogador_marca_ultimo_gol_fora'] = this.checkEmpty(mercadosJogador['jogador_marca_ultimo_gol_fora']);
                }
            });

            return jogadoresMercados;
        } else {
            const aux = [];
            for (const chave in mercados) {
                aux.push([mercados[chave].posicao, chave, mercados[chave]]);
            }
            aux.sort((a, b) => a[0] - b[0]);
            aux.forEach(element => {
                mercadosOrganizados[element[1]] = element[2];
            });

            for (const chave in mercadosOrganizados) {
                const mercado = mercadosOrganizados[chave];
                // cria a estrutura para organizar os odds
                const colunas = [];

                let numeroColunas;
                if (this.isMobile) {
                    numeroColunas = mercado.colunasMobile;
                } else {
                    numeroColunas = mercado.colunas;
                }

                for (let i = 0; i < numeroColunas; i++) {
                    colunas.push([]);
                }

                // popula as colunas com as cotacaoes
                for (const odd of mercado.odds) {
                    let posicaoX;
                    if (this.isMobile) {
                        posicaoX = odd.posicaoXMobile;
                    } else {
                        posicaoX = odd.posicaoX;
                    }

                    const odds = colunas[posicaoX];
                    odds.push(odd);
                }

                // Ordena os odds de cada coluna comgul base na posicao vertical de cada um
                // Caso nao haja poicao vertical ele adiciona com base na ordem de associacao

                for (const coluna of colunas) {
                    coluna.sort((a, b) => {
                        if (this.isMobile) {
                            return a.posicaoYMobile - b.posicaoYMobile;
                        } else {
                            return a.posicaoY - b.posicaoY;
                        }
                    });
                }

                mercado.odds = colunas;
            }
        }

        return mercadosOrganizados;
    }

    checkEmpty(values) {
        return values ? values : {};
    }

    cssTamanhoColuna(mercado) {
        let width = 'width-';

        if (this.isMobile) {
            width += this.calcularTamanhoColuna(mercado.colunasMobile);
        } else {
            width += this.calcularTamanhoColuna(mercado.colunas);
        }

        return width;
    }

    calcularTamanhoColuna(numColunas) {
        const tamanho = 100 / numColunas;
        return Math.round(tamanho);
    }

    cotacaoPermitida(cotacao) {
        return this.helperService.cotacaoPermitida(cotacao);
    }

    verificarColunaMercado(index, right = false) {
        let retorno: boolean;
        if (window.innerWidth >= 1280) {
            if (right) {
                retorno = index % 2 !== 0;
            } else {
                retorno = index % 2 === 0;
            }
        } else {
            retorno = !right;
        }

        return retorno;
    }

    toggleOdd(chave) {
        const index = this.oddsAberto.findIndex(id => id === chave.nome);
        if (index >= 0) {
            this.oddsAberto.splice(index, 1);
        } else {
            this.oddsAberto.push(chave.nome);
        }
    }

    oddAberto(chave) {
        return this.oddsAberto.includes(chave.nome);
    }

    handleError(msg: any) {
        this.messageService.error(msg);
    }
}
