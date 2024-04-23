import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, OnDestroy, ElementRef, DoCheck } from '@angular/core';
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
export class JogosAovivoComponent implements OnInit, OnDestroy {
    @Output() maisCotacoesDestaque = new EventEmitter();
    @Input() jogoIdAtual;
    jogosDestaque = [];
    regioesDestaque = null;
    menuWidth;
    mobileScreen = false;
    itens = [];
    itensSelecionados = {};
    isDragging = false;
    widthCard = 340;

    jogosDestaquesIds = [];

    campeonatos = new Map();
    jogos = new Map();
    idsCampeonatosLiberados = this.paramsService.getCampeonatosAoVivo();
    awaiting = true;
    showLoadingIndicator = true;
    campeonatosAbertos = [];
    contentSportsEl;
    minutoEncerramentoAoVivo = 0;
    jogosBloqueados = [];
    cotacoesLocais = [];
    unsub$ = new Subject();
    term = '';

    customOptions: OwlOptions = {
        loop: false,
        autoplay: false,
        rewind: true,
        margin: 10,
        dots: false,
        autoHeight: true,
        autoWidth: true,
    };

    constructor(
        private jogoService: JogoService,
        private liveService: LiveService,
        private el: ElementRef,
        private helperService: HelperService,
        private cd: ChangeDetectorRef,
        private bilheteService: BilheteEsportivoService,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit() {
        this.liveService.connect();
        this.liveService.entrarSalaEventos();
        this.mobileScreen = window.innerWidth <= 1024 ? true : false;

        if (window.innerWidth <= 380) {
            this.widthCard = 300;
        }

        this.jogosBloqueados = this.paramsService.getJogosBloqueados();
        this.minutoEncerramentoAoVivo = this.paramsService.minutoEncerramentoAoVivo();

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
            .subscribe(campeonatos => {
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
                            if (this.jogos.size <= 10) {
                                this.jogos.set(jogo._id, jogo);
                            }
                        }
                    });
                });

                setTimeout(() => {
                    this.awaiting = false;
                }, 2000);

                this.showLoadingIndicator = false;

                // this.live();
            });
    }

    ngOnDestroy() {
        this.liveService.sairSalaEventos();
        this.liveService.disconnect();
        this.unsub$.next();
        this.unsub$.complete();
    }

    live() {
        this.liveService.getEventos()
            .pipe(takeUntil(this.unsub$))
            .subscribe((jogo: any) => {
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

                const eventoEncontrado = this.jogos.get(jogo._id);
                if (valido && !jogo.finalizado && jogo.total_cotacoes > 0) {
                    if (eventoEncontrado) {
                        this.jogos.set(jogo._id, jogo);
                    }
                } else {
                    if (eventoEncontrado) {
                        this.jogos.delete(jogo._id);
                    }
                }
            });
    }

    jogoBloqueado(eventId) {
        return this.jogosBloqueados ? (this.jogosBloqueados.includes(eventId) ? true : false) : false;
    }

    cotacoesPorTipo(cotacoes) {
        const cotacaoCasa = cotacoes.find(k => k.chave === 'casa_90');
        const cotacaoEmpate = cotacoes.find(k => k.chave === 'empate_90');
        const cotacaoFora = cotacoes.find(k => k.chave === 'fora_90');

        return [
            cotacaoCasa ?? { nome: 'Casa', lock: true },
            cotacaoEmpate ?? { nome: 'Empate', lock: true },
            cotacaoFora ?? { nome: 'Fora', lock: true }
        ];
    }

    cotacaoPermitida(cotacao) {
        return this.helperService.cotacaoPermitida(cotacao);
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
}
