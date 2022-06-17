import {
    Component, OnInit, OnDestroy, ElementRef,
    Renderer2, DoCheck, EventEmitter, Input,
    Output
} from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Jogo, ItemBilheteEsportivo } from '../../../models';
import {
    ParametrosLocaisService, MessageService, JogoService,
    LiveService, BilheteEsportivoService, HelperService
} from '../../../services';

@Component({
    selector: 'app-live-jogo',
    templateUrl: 'live-jogo.component.html',
    styleUrls: ['live-jogo.component.css']
})
export class LiveJogoComponent implements OnInit, OnDestroy, DoCheck {
    @Input() jogoId;
    @Output() exibirMaisCotacoes = new EventEmitter();
    jogo;
    mercados: any = {};
    itens = [];
    tiposAposta;
    objectKeys = Object.keys;
    isMobile = false;
    showLoadingIndicator = true;
    minutoEncerramentoAoVivo = 0;
    contentSportsEl;
    unsub$ = new Subject();

    constructor(
        private messageService: MessageService,
        private jogoService: JogoService,
        private liveService: LiveService,
        private bilheteService: BilheteEsportivoService,
        private helperService: HelperService,
        private el: ElementRef,
        private renderer: Renderer2,
        private router: Router,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit() {
        if (window.innerWidth <= 1024) {
            this.isMobile = true;

            let altura = window.innerHeight - 97;
            const containerJogoEl = this.el.nativeElement.querySelector('.jogo-container');
            this.renderer.setStyle(containerJogoEl, 'height', `${altura}px`);
        }
        this.definirAltura();

        this.tiposAposta = this.paramsService.getTiposAposta();
        this.minutoEncerramentoAoVivo = this.paramsService.minutoEncerramentoAoVivo();

        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => this.itens = itens);

        if (this.jogoId) {
            this.liveService.entrarSalaEvento(this.jogoId);
            this.getJogo(this.jogoId);
        }
    }

    ngOnDestroy() {
        this.liveService.sairSalaEvento(this.jogoId);
        this.unsub$.next();
        this.unsub$.complete();
    }

    ngDoCheck() {
        if (this.minutoEncerramentoAoVivo > 0 && this.jogo) {
            if (this.jogo.info.minutos > this.minutoEncerramentoAoVivo) {
                this.router.navigate(['/esportes/futebol/live/jogos']);
            }
        }
    }

    definirAltura() {
        let altura = window.innerHeight;

        if (this.isMobile) {
            altura -= 235;
        } else {
            altura -= 227;
        }

        this.contentSportsEl = this.el.nativeElement.querySelector('.content-sports');
        this.renderer.setStyle(this.contentSportsEl, 'height', `${altura}px`);
    }

    getJogo(id) {
        this.jogoService.getJogo(id)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                jogo => {
                    this.jogo = jogo;
                    this.mapearCotacoes(jogo.cotacoes);
                    this.live(id);
                },
                error => this.handleError(error)
            );
    }

    live(eventoId) {
        this.liveService.getEventoCompleto(eventoId)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                (jogo: Jogo) => {
                    this.jogo.info = jogo.info;
                    this.mapearCotacoes(jogo.cotacoes);
                }
            );
    }

    oddSelecionada(jogoId, chave) {
        let result = false;
        this.itens.forEach(item => {
            if (item.jogo_id === jogoId && item.cotacao.chave === chave) {
                result = true;
            }
        });
        return result;
    }

    mapearCotacoes(odds) {
        const mercados = {};

        for (let index = 0; index < odds.length; index++) {
            const odd = odds[index];
            const tipoAposta = this.tiposAposta[odd.chave];

            if (tipoAposta && parseInt(tipoAposta.ao_vivo, 10)) {
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

                odd.posicaoX = tipoAposta.posicao_x;
                odd.posicaoY = tipoAposta.posicao_y;
                odd.posicaoXMobile = tipoAposta.posicao_x_mobile;
                odd.posicaoYMobile = tipoAposta.posicao_y_mobile;
                odd.label = tipoAposta.nome;
                odd.valorFinal = this.helperService.calcularCotacao2String(odd.valor, odd.chave, this.jogo.event_id, null, true);

                mercado.odds.push(odd);
            }
        }

        this.mercados = this.organizarMercados(mercados);

        this.showLoadingIndicator = false;
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
            tempo: jogo.info.minutos,
            time_a_placar: jogo.info.time_a_resultado,
            time_b_placar: jogo.info.time_b_resultado,
            jogo: jogo,
            cotacao: {
                chave: cotacao.chave,
                valor: cotacao.valor,
                nome: cotacao.nome
            },
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

    showOdd(odd) {
        return this.tiposAposta[odd] ? true : false;
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    back() {
        this.exibirMaisCotacoes.emit(false);
    }

    trackByKey(index: number, cotacao: any): string {
        return cotacao.chave;
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
