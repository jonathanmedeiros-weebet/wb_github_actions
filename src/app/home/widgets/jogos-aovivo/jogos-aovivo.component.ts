import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BilheteEsportivoService, HelperService, JogoService, LiveService, ParametrosLocaisService } from 'src/app/services';

@Component({
    selector: 'app-jogos-aovivo',
    templateUrl: './jogos-aovivo.component.html',
    styleUrls: ['./jogos-aovivo.component.css'],
    providers: [
        LiveService
    ]
})
export class JogosAovivoComponent implements OnInit {
    @Output() maisCotacoesDestaque = new EventEmitter();
    @Input() jogoIdAtual;
    jogosDestaque = [];
    regioesDestaque = null;
    menuWidth;
    mobileScreen = false;
    itens = [];
    itensSelecionados = {};
    isDragging = false;

    jogosDestaquesIds = [];

    campeonatos = new Map();
    jogos = [];
    idsCampeonatosLiberados = this.paramsService.getCampeonatosAoVivo();
    temJogoAoVivo = true;
    awaiting = true;
    showLoadingIndicator = true;
    campeonatosAbertos = [];
    contentSportsEl;
    minutoEncerramentoAoVivo = 0;
    jogosBloqueados;
    unsub$ = new Subject();
    term = '';

    customOptions: OwlOptions = {
        loop: false,
        autoplay: true,
        rewind: true,
        margin: 10,
        dots: false,
        autoHeight: true,
        autoWidth: true,
    };

    constructor(
        private jogoService: JogoService,
        private liveService: LiveService,
        private helperService: HelperService,
        private cd: ChangeDetectorRef,
        private bilheteService: BilheteEsportivoService,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024 ? true : false;

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

        this.jogoService.getJogosAoVivo()
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => {
                    campeonatos.forEach(campeonato => {
                        campeonato.jogos.forEach(jogo => {
                            let valido = true;

                            if (jogo.sport_id !== 1 || this.jogoBloqueado(jogo.event_id)) {
                                valido = false;
                            }

                            if (this.minutoEncerramentoAoVivo > 0) {
                                if (jogo.info.minutos > this.minutoEncerramentoAoVivo) {
                                    valido = false;
                                }
                            }

                            jogo.cotacoes.map(cotacao => {
                                cotacao.nome = this.helperService.apostaTipoLabel(cotacao.chave, 'sigla');
                                cotacao.valorFinal = this.helperService.calcularCotacao2String(
                                    cotacao.valor,
                                    cotacao.chave,
                                    jogo.event_id,
                                    null,
                                    true
                                );
                                return cotacao;
                            });

                            if (valido && jogo.ao_vivo) {
                                this.jogos.push(jogo);
                            }
                        });
                    });

                    setTimeout(() => {
                        this.awaiting = false;
                    }, 2000);

                    this.showLoadingIndicator = false;

                    // this.live();
                },
                error => this.handleError(error)
            );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['jogosDestaque']) {
            this.remapJogosDestaque();
        }
    }

    live() {
        this.liveService.getEventos()
            .pipe(takeUntil(this.unsub$))
            .subscribe((jogo: any) => {
                let campeonato = this.campeonatos.get(jogo.campeonato._id);
                let inserirCampeonato = false;

                jogo.cotacoes.map(cotacao => {
                    cotacao.nome = this.helperService.apostaTipoLabel(cotacao.chave, 'sigla');
                    cotacao.valorFinal = this.helperService.calcularCotacao2String(
                        cotacao.valor,
                        cotacao.chave,
                        jogo.event_id,
                        null,
                        true);
                    return cotacao;
                });

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

                if (jogo.sport_id && jogo.sport_id !== 1) {
                    valido = false;
                }

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

    jogoBloqueado(eventId) {
        return this.jogosBloqueados ? (this.jogosBloqueados.includes(eventId) ? true : false) : false;
    }

    remapJogosDestaque() {
        this.jogosDestaque.forEach((jogo) => {
            jogo.cotacoes.slice(0, 3).forEach((cotacao) => {
                if (!cotacao.valorFinal) {
                    cotacao.valorFinal = this.helperService.calcularCotacao2String(
                        cotacao.valor,
                        cotacao.chave,
                        jogo.event_id,
                        jogo.favorito,
                        false);
                }
            });
        });
        this.cd.detectChanges();
    }

    cotacaoPermitida(cotacao) {
        return this.helperService.cotacaoPermitida(cotacao);
    }

    maisCotacoes(jogoId) {
        if (!this.isDragging) {
            this.jogoIdAtual = jogoId;
            this.maisCotacoesDestaque.emit(jogoId);
        }
    }

    addCotacao(event, jogo, cotacao) {
        event.stopPropagation();

        if (!this.isDragging) {
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
    }

    handleError(msg) {
        alert(msg)
    }
}
