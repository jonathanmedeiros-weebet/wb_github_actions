import { ChangeDetectorRef, Component, DoCheck, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    BilheteEsportivoService,
    HelperService,
    JogoService,
    LayoutService,
    LiveService,
    MessageService,
    ParametrosLocaisService
} from '../../../services';

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
    exibirCampeonatosExpandido;
    campeonatosAbertos = [];
    contentSportsEl;
    minutoEncerramentoAoVivo = 0;
    jogosBloqueados;
    unsub$ = new Subject();
    mobileScreen = false;
    term = '';
    itens;
    esportesAbertos = [48242, 1];
    qtdJogosFutebol = 0;
    qtdJogosBasquete = 0;
    futebolAoVivohabilitado = false;
    basqueteAoVivohabilitado = false;

    chavesMercadosPrincipais = {
        1: {
            casa: 'casa_90',
            empate: 'empate_90',
            fora: 'fora_90'
        },
        48242: {
            casa: 'bkt_casa',
            fora: 'bkt_fora'
        }
    };
    headerHeight = 92;

    constructor(
        private messageService: MessageService,
        private jogoService: JogoService,
        private liveService: LiveService,
        private el: ElementRef,
        private helperService: HelperService,
        private bilheteService: BilheteEsportivoService,
        private renderer: Renderer2,
        private paramsService: ParametrosLocaisService,
        private layoutService: LayoutService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;
        this.exibirCampeonatosExpandido = this.paramsService.getExibirCampeonatosExpandido();

        this.futebolAoVivohabilitado = this.paramsService.futebolAoVivoAtivo();
        this.basqueteAoVivohabilitado = this.paramsService.basqueteAoVivoAtivo();

        this.definindoAlturas();

        this.minutoEncerramentoAoVivo = this.paramsService.minutoEncerramentoAoVivo();
        this.jogosBloqueados = this.paramsService.getJogosBloqueados();

        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => this.itens = itens);


        this.liveService.entrarSalaEventos();
        this.getJogosAoVivo();
    }

    ngDoCheck() {
        if (!this.awaiting) {
            const jogosEl = this.el.nativeElement.querySelector('.jogos');
            this.temJogoAoVivo = !!jogosEl;
        }
    }

    ngOnDestroy() {
        this.liveService.sairSalaEventos();
        this.unsub$.next();
        this.unsub$.complete();
    }

    getJogosAoVivo() {
        this.campeonatos = new Map();
        this.showLoadingIndicator = true;
        this.jogoService.getJogosAoVivo()
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => {
                    let qtdJogosValidos = 0;
                    campeonatos.forEach(campeonato => {
                        const jogos = new Map();
                        let temJogoValido = false;

                        campeonato.jogos.forEach(jogo => {
                            let valido = true;

                            if (this.minutoEncerramentoAoVivo > 0) {
                                if (jogo.sport_id === 1 && jogo.info.minutos > this.minutoEncerramentoAoVivo) {
                                    valido = false;
                                }
                            }

                            if (jogo.sport_id === 48242 && jogo.info.minutos === 0 && jogo.info.tempo === 4) {
                                valido = false;
                            }

                            if (this.jogoBloqueado(jogo.event_id)) {
                                valido = false;
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

                            if (valido) {
                                jogos.set(jogo._id, jogo);
                                temJogoValido = true;
                                qtdJogosValidos++;
                            }
                        });

                        campeonato.jogos = jogos;

                        if (campeonato.sport_id === 1 || !campeonato.sport_id) {
                            this.qtdJogosFutebol += qtdJogosValidos;
                        }

                        if (campeonato.sport_id === 48242) {
                            this.qtdJogosBasquete += qtdJogosValidos;
                        }

                        qtdJogosValidos = 0;

                        if (temJogoValido) {
                            this.campeonatos.set(campeonato._id, campeonato);

                            if (this.exibirCampeonatosExpandido) {
                                this.campeonatosAbertos = this.campeonatosAbertos.concat(campeonato._id);
                            }
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

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.definindoAlturas();
                this.cd.detectChanges();
            });

        this.layoutService.resetHideSubmenu();
    }

    definindoAlturas() {
        const headerHeight = this.mobileScreen ? 145 : this.headerHeight;
        const altura = window.innerHeight - headerHeight;
        this.contentSportsEl = this.el.nativeElement.querySelector('.content-sports');
        this.renderer.setStyle(this.contentSportsEl, 'height', `${altura}px`);
    }

    live() {
        this.liveService.getEventos()
            .pipe(takeUntil(this.unsub$))
            .subscribe((jogo: any) => {
                let campeonato = this.campeonatos.get(jogo.campeonato._id);
                let inserirCampeonato = false;

                jogo.cotacoes.map(cotacao => {
                    cotacao.nome = this.helperService.apostaTipoLabelCustom(
                        cotacao.chave,
                        jogo.time_a_nome,
                        jogo.time_b_nome,
                        jogo.sport_id
                    );
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

                if (this.minutoEncerramentoAoVivo > 0) {
                    if (jogo.sport_id === 1 && jogo.info.minutos > this.minutoEncerramentoAoVivo) {
                        valido = false;
                    }
                }

                if (jogo.sport_id === 48242 && jogo.info.minutos === 0 && jogo.info.tempo == 'fim de jogo') {
                    valido = false;
                }

                if (this.jogoBloqueado(jogo.event_id)) {
                    valido = false;
                }

                if (valido && !jogo.finalizado) {
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
        return this.jogosBloqueados ? (!!this.jogosBloqueados.includes(eventId)) : false;
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
                nome: this.helperService.apostaTipoLabelCustom(
                    cotacao.chave,
                    jogo.time_a_nome,
                    jogo.time_b_nome
                ),
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

    esporteAberto(sportId) {
        return this.esportesAbertos.includes(sportId);
    }

    toggleEsporte(sportId) {
        const index = this.esportesAbertos.findIndex(id => id === sportId);
        if (index >= 0) {
            this.esportesAbertos.splice(index, 1);
        } else {
            this.esportesAbertos.push(sportId);
        }
    }

    cotacoesPorTipo(jogo) {
        const cotacoes = jogo.value.cotacoes;
        const sportId = jogo.value.sport_id;

        const mercadosPrincipais = [];

        mercadosPrincipais.push(cotacoes.find(k => k.chave === this.chavesMercadosPrincipais[sportId]['casa']) ?? {
            nome: this.helperService.apostaTipoLabelCustom(
                    this.chavesMercadosPrincipais[sportId]['casa'],
                jogo.value.time_a_nome,
                jogo.value.time_b_nome,
                jogo.value.sport_id
            ),
            lock: false
        });

        if (sportId === 1) {
            mercadosPrincipais.push(cotacoes.find(k => k.chave === this.chavesMercadosPrincipais[1]['empate']) ?? {
                nome: 'Empate',
                lock: true
            });
        }

        mercadosPrincipais.push(cotacoes.find(k => k.chave === this.chavesMercadosPrincipais[sportId]['fora']) ?? {
            nome: this.helperService.apostaTipoLabelCustom(
                this.chavesMercadosPrincipais[sportId]['fora'],
                jogo.value.time_a_nome,
                jogo.value.time_b_nome,
                jogo.value.sport_id
            ),
            lock: false
        });

        return mercadosPrincipais;
    }

    cotacaoPermitida(cotacao) {
        return this.helperService.cotacaoPermitida(cotacao);
    }
}
