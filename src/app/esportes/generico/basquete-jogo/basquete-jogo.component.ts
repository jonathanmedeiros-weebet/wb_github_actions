import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Jogo } from './../../../models';
import {
    BilheteEsportivoService,
    HelperService,
    JogoService,
    MessageService,
    ParametrosLocaisService
} from './../../../services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-basquete-jogo',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'basquete-jogo.component.html',
    styleUrls: ['basquete-jogo.component.css']
})
export class BasqueteJogoComponent implements OnInit, OnChanges, OnDestroy {
    jogo: Jogo;
    @Input() jogoId;
    @Output() exibirMaisCotacoes = new EventEmitter();
    isMobile = false;
    mercados: any = {};
    itens = [];
    itensSelecionados = {};
    tiposAposta;
    cotacoesLocais;
    objectKeys = Object.keys;
    showLoadingIndicator = true;
    contentSportsEl;
    unsub$ = new Subject();

    constructor(
        private jogoService: JogoService,
        private bilheteService: BilheteEsportivoService,
        private helperService: HelperService,
        private messageService: MessageService,
        private el: ElementRef,
        private renderer: Renderer2,
        private paramsService: ParametrosLocaisService,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef,
        private activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
        if (window.innerWidth <= 1024) {
            this.isMobile = true;

            let altura = window.innerHeight;
            const containerJogoEl = this.el.nativeElement.querySelector('.jogo-container');
            this.renderer.setStyle(containerJogoEl, 'height', `${altura}px`);
        }

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
                    },
                    error => this.messageService.error(error)
                );
        }
    }

    ngOnChanges() {
        if (this.jogoId) {
            this.showLoadingIndicator = true;

            this.jogoService.getJogo(this.jogoId)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    jogo => {
                        this.jogo = jogo;
                        this.mapearOdds(jogo.cotacoes);
                    },
                    error => this.messageService.error(error)
                );
        }
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    definirAltura() {
        let altura = window.innerHeight;

        if (this.isMobile) {
            altura -= 190;
        } else {
            altura -= 150 + ((window.innerHeight / 100) * 20);
        }

        this.contentSportsEl = this.el.nativeElement.querySelector('.content-sports');
        this.renderer.setStyle(this.contentSportsEl, 'height', `${altura}px`);
    }

    back() {
        if (this.isMobile) {
            this.activeModal.close();
        } else {
            this.exibirMaisCotacoes.emit(false);
        }
    }

    mapearOdds(odds) {
        const mercados = {};

        for (let index = 0; index < odds.length; index++) {
            const odd = odds[index];
            const tipoAposta = this.tiposAposta[odd.chave];

            if (tipoAposta) {
                let mercado = mercados[tipoAposta.cat_chave];

                if (!mercado) {
                    //categoria
                    mercado = {
                        'nome': tipoAposta.cat_nome,
                        'tempo': tipoAposta.tempo,
                        'principal': tipoAposta.p,
                        'posicao': tipoAposta.cat_posicao,
                        'colunas': tipoAposta.cat_colunas,
                        'colunasMobile': tipoAposta.cat_colunas_mobile,
                        'odds': []
                    };
                    mercados[tipoAposta.cat_chave] = mercado;
                }

                odd.posicaoX = tipoAposta.posicao_x;
                odd.posicaoY = tipoAposta.posicao_y;
                odd.posicaoXMobile = tipoAposta.posicao_x_mobile;
                odd.posicaoYMobile = tipoAposta.posicao_y_mobile;
                odd.label = this.helperService.apostaTipoLabelCustom(odd.chave, this.jogo.time_a_nome, this.jogo.time_b_nome, this.jogo.sport_id)
                odd.valorFinal = this.helperService.calcularCotacao2String(odd.valor, odd.chave, this.jogo.event_id, this.jogo.favorito, false);

                mercado.odds.push(odd);

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
                            let mercado = mercados[tipoAposta.cat_chave];

                            if (!mercado) {
                                mercado = {
                                    'nome': tipoAposta.cat_nome,
                                    'tempo': tipoAposta.tempo,
                                    'principal': tipoAposta.p,
                                    'posicao': tipoAposta.cat_posicao,
                                    'colunas': tipoAposta.cat_colunas,
                                    'colunasMobile': tipoAposta.cat_colunas_mobile,
                                    'odds': []
                                };
                                mercados[tipoAposta.cat_chave] = mercado;
                            }

                            const cotacao = {
                                chave: chave,
                                label: this.helperService.apostaTipoLabelCustom(chave, this.jogo.time_a_nome, this.jogo.time_b_nome),
                                valor: cotacaoLocal.valor,
                                valorFinal: this.helperService.calcularCotacao2String(cotacaoLocal.valor, chave, this.jogo.event_id, this.jogo.favorito, false),
                                posicaoX: tipoAposta.posicao_x_mobile,
                                posicaoY: tipoAposta.posicao_x_mobile,
                                posicaoXMobile: tipoAposta.posicao_x_mobile,
                                posicaoYMobile: tipoAposta.posicao_x_mobile,
                            }

                            mercado.odds.push(cotacao);
                        }
                    }
                }
            }
        }

        this.mercados = this.organizarMercados(mercados);
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

    private organizarMercados(mercados) {
        const mercadosOrganizados = {};

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
            //cria a estrutura para organizar os odds
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


            //popula as colunas com as cotacaoes
            for (const odd of mercado.odds) {
                let posicaoX;
                if (this.isMobile) {
                    posicaoX = odd.posicaoXMobile
                } else {
                    posicaoX = odd.posicaoX;
                }

                const odds = colunas[posicaoX];
                odds.push(odd);
            }

            //Ordena os odds de cada coluna com base na posicao vertical de cada um
            //Caso nao haja poicao vertical ele adiciona com base na ordem de associacao

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

        return mercadosOrganizados;
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
}
