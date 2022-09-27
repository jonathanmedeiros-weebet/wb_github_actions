import {
    Component, OnInit, OnDestroy, Renderer2,
    ElementRef, DoCheck, Output, EventEmitter
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ParametrosLocaisService, MessageService, JogoService, LiveService, BilheteEsportivoService, HelperService } from '../../../services';
import { Jogo } from '../../../models';

@Component({
    selector: 'app-live-listagem',
    templateUrl: 'live-listagem.component.html',
    styleUrls: ['live-listagem.component.css']
})
export class LiveListagemComponent implements OnInit, OnDestroy, DoCheck {
    @Output() jogoSelecionadoId = new EventEmitter();
    @Output() exibirMaisCotacoes = new EventEmitter();
    jogos = {};
    campeonatos = new Map();
    idsCampeonatosLiberados = this.paramsService.getCampeonatosAoVivo();
    temJogoAoVivo = true;
    awaiting = true;
    showLoadingIndicator = true;
    contentSportsEl;
    minutoEncerramentoAoVivo = 0;
    jogosBloqueados;
    unsub$ = new Subject();
    mobileScreen = false;
    term = "";
    itens;

    constructor(
        private messageService: MessageService,
        private jogoService: JogoService,
        private liveService: LiveService,
        private el: ElementRef,
        private helperService: HelperService,
        private bilheteService: BilheteEsportivoService,
        private renderer: Renderer2,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit() {
        this.liveService.entrarSalaEventos();
        this.mobileScreen = window.innerWidth <= 1024;

        this.definindoAlturas();

        this.minutoEncerramentoAoVivo = this.paramsService.minutoEncerramentoAoVivo();
        this.jogosBloqueados = this.paramsService.getJogosBloqueados();

        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => this.itens = itens);

        this.jogoService.getJogosAoVivo()
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => {
                    campeonatos.forEach(campeonato => {
                        const jogos = new Map();
                        let temJogoValido = false;

                        campeonato.jogos.forEach(jogo => {
                            let valido = true;

                            if (this.minutoEncerramentoAoVivo > 0) {
                                if (jogo.info.minutos > this.minutoEncerramentoAoVivo) {
                                    valido = false;
                                }
                            }

                            if (this.jogoBloqueado(jogo.event_id)) {
                                valido = false;
                            }

                            jogo.cotacoes.map(cotacao => {
                                cotacao.nome = this.helperService.apostaTipoLabel(cotacao.chave, 'sigla');
                                return cotacao;
                            });

                            if (valido) {
                                jogos.set(jogo._id, jogo);
                                temJogoValido = true;
                            }


                        });

                        campeonato.jogos = jogos;

                        if (temJogoValido) {
                            this.campeonatos.set(campeonato._id, campeonato);
                        }
                    });


                    setTimeout(() => {
                        this.awaiting = false;
                    }, 2000);

                    this.showLoadingIndicator = false;

                    this.live();
                },
                error => this.handleError(error)
            );
    }

    ngDoCheck() {
        if (!this.awaiting) {
            const jogosEl = this.el.nativeElement.querySelector('.jogos');
            this.temJogoAoVivo = jogosEl ? true : false;
        }
    }

    ngOnDestroy() {
        this.liveService.sairSalaEventos();
        this.unsub$.next();
        this.unsub$.complete();
    }

    definindoAlturas() {
        const headerHeight = this.mobileScreen ? 145 : 132;
        const altura = window.innerHeight - headerHeight;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-sticky');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura}px`);
        this.contentSportsEl = this.el.nativeElement.querySelector('.content-sports');
        this.renderer.setStyle(this.contentSportsEl, 'height', `${altura}px`);
    }

    live() {
        this.liveService.getEventos()
            .pipe(takeUntil(this.unsub$))
            .subscribe((jogo: any) => {
                let campeonato = this.campeonatos.get(jogo.campeonato._id);
                let inserirCampeonato = false;

                if (!campeonato) {
                    campeonato = {
                        _id: jogo.campeonato._id,
                        nome: jogo.campeonato.nome,
                        regiao_sigla: jogo.campeonato.regiao_sigla,
                        jogos: new Map()
                    };

                    inserirCampeonato = true;
                }

                let valido = true;
                if (this.minutoEncerramentoAoVivo > 0) {
                    if (jogo.info.minutos > this.minutoEncerramentoAoVivo) {
                        valido = false;
                    }
                }

                if (this.jogoBloqueado(jogo.event_id)) {
                    valido = false;
                }

                if (valido && !jogo.finalizado && jogo.total_cotacoes > 0) {
                    campeonato.jogos.set(jogo._id, jogo);

                    if (inserirCampeonato) {
                        this.campeonatos.set(jogo.campeonato._id, campeonato);
                    }
                } else {
                    const eventoEncontrado = campeonato.jogos.get(jogo._id);

                    if (eventoEncontrado) {
                        campeonato.jogos.delete(jogo._id);

                        if (!campeonato.jogos.size) {
                            this.campeonatos.delete(campeonato._id);
                        }
                    }
                }
            });
    }

    reOrder(a, b) {
        return a.value.nome.localeCompare(b.value.nome);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    campeonatoPermitido(campenatoId) {
        return this.idsCampeonatosLiberados.includes(campenatoId);
    }

    trackById(index: number, campeonato: any): string {
        return campeonato._id;
    }

    // Exibindo todas as cotações daquele jogo selecionado
    maisCotacoes(jogoId) {
        this.jogoSelecionadoId.emit(jogoId);
        this.exibirMaisCotacoes.emit(true);
    }

    jogoBloqueado(eventId) {
        return this.jogosBloqueados ? (this.jogosBloqueados.includes(eventId) ? true : false) : false;
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

    addCotacao(jogo, cotacao) {
        let modificado = false;
        const indexGame = this.itens.findIndex(i => i.jogo._id === jogo._id);
        const indexOdd = this.itens.findIndex(i => (i.jogo._id === jogo._id) && (i.cotacao.chave === cotacao.chave));

        const item = {
            ao_vivo: true,
            jogo_id: jogo._id,
            jogo_event_id: jogo.event_id,
            jogo_nome: jogo.nome,
            tempo: jogo.info?.minutos,
            time_a_placar: jogo.info?.time_a_resultado,
            time_b_placar: jogo.info?.time_b_resultado,
            jogo: jogo,
            cotacao: {
                chave: cotacao.chave,
                valor: cotacao.valor,
                nome: this.helperService.apostaTipoLabel(cotacao.chave, 'sigla'),
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
}
