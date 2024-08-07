import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnDestroy, ElementRef, DoCheck } from '@angular/core';
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
export class JogosAovivoComponent implements OnInit, OnDestroy, DoCheck {
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
    temJogoAoVivo = false;
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
            .subscribe(
                campeonatos => {
                    let totalJogos = 0;
                    campeonatos.forEach(campeonato => {
                        const jogos = new Map();
                        let temJogoValido = false;

                        if (this.campeonatoPermitido(campeonato._id)) {
                            campeonato.jogos.forEach(jogo => {
                                if (totalJogos < 5) {
                                    let valido = true;

                                    if (jogo.sport_id !== 1) {
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

                                    jogo.cotacoes.map(cotacao => {
                                        cotacao.nome = this.helperService.apostaTipoLabel(cotacao.chave, 'sigla');
                                        cotacao.oddChange = 'up'
                                        cotacao.valorFinal = this.helperService.calcularCotacao2String(
                                            cotacao.valor,
                                            cotacao.chave,
                                            jogo.event_id,
                                            null,
                                            true
                                        );
                                        return cotacao;
                                    });

                                    if (valido) {
                                        jogos.set(jogo._id, jogo);
                                        temJogoValido = true;
                                        totalJogos++;
                                    }
                                }
                            });

                            campeonato.jogos = jogos;

                            if (temJogoValido) {
                                this.campeonatos.set(campeonato._id, campeonato);
                            }
                        }
                    });

                    setTimeout(() => {
                        this.awaiting = false;
                    }, 2000);

                    this.showLoadingIndicator = false;

                    this.live();
                }
            );
    }

    ngOnDestroy() {
        this.liveService.sairSalaEventos();
        this.liveService.disconnect();
        this.unsub$.next();
        this.unsub$.complete();
    }

    ngDoCheck() {
        if (!this.awaiting) {
            const jogosEl = this.el.nativeElement.querySelector('.jogos');
            this.temJogoAoVivo = jogosEl ? true : false;
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
                    cotacao.oddChange = 'up'
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

                const eventoEncontrado = campeonato.jogos.get(jogo._id);
                if (valido && !jogo.finalizado && jogo.total_cotacoes > 0) {
                    if (eventoEncontrado) {
                        campeonato.jogos.set(jogo._id, jogo);
                    }
                } else {

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

    campeonatoPermitido(campenatoId) {
        return this.idsCampeonatosLiberados.includes(campenatoId);
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

    trackById(index: number, campeonato: any): string {
        return campeonato._id;
    }

    cotacaoPermitida(cotacao) {
        return this.helperService.cotacaoPermitida(cotacao);
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

        jogo.nome = `${jogo.time_a_nome} x ${jogo.time_b_nome}`;

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
