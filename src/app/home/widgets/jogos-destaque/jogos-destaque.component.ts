import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, OnChanges, SimpleChanges, Input } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BilheteEsportivoService, CampeonatoService, HelperService, JogoService, ParametrosLocaisService } from 'src/app/services';

@Component({
    selector: 'app-jogos-destaque',
    templateUrl: './jogos-destaque.component.html',
    styleUrls: ['./jogos-destaque.component.css']
})
export class JogosDestaqueComponent implements OnInit, OnChanges {
    @Input() displayLabel = true;
    @Output() maisCotacoesDestaque = new EventEmitter();
    jogosDestaque = [];
    mobileScreen: boolean;
    itens = [];
    itensSelecionados = {};
    isDragging = false;
    camps = [];
    jogosBloqueados = [];
    cotacoesLocais = [];
    jogosDestaquesIds = [];
    widthCard = 300;
    showLoadingIndicator = true;

    customOptions: OwlOptions = {
        loop: false,
        autoplay: true,
        rewind: true,
        margin: 10,
        dots: false,
        autoHeight: true,
        autoWidth: true,
    };

    unsub$ = new Subject();

    constructor(
        private jogoService: JogoService,
        private helperService: HelperService,
        private cd: ChangeDetectorRef,
        private bilheteService: BilheteEsportivoService,
        private paramsService: ParametrosLocaisService,
        private campeonatoService: CampeonatoService,
    ) { }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024 ? true : false;
        this.cotacoesLocais = this.paramsService.getCotacoesLocais();
        this.jogosBloqueados = this.paramsService.getJogosBloqueados();

        if (window.innerWidth <= 380) {
            this.widthCard = 300;
        }

        this.getJogosDestaques();
    }

    getJogosDestaques() {
        this.jogoService.getJogosDestaque()
            .subscribe(jogos => {
                this.jogosDestaquesIds = jogos.results.map(jogo => jogo.fi + '');

                this.getMatchsInCenter();
            });
    }

    getMatchsInCenter() {
        const opcoes = this.paramsService.getOpcoes();

        let queryParams = {
            'sport_id': 1,
            'campeonatos_bloqueados': this.paramsService.getCampeonatosBloqueados(1),
            'odds': ['casa_90', 'empate_90', 'fora_90'],
            'data_final': opcoes.data_limite_tabela,
            'games_ids': this.jogosDestaquesIds
        };

        console.log(queryParams);


        this.campeonatoService.getCampeonatos(queryParams)
            .pipe(takeUntil(this.unsub$))
            .subscribe(campeonatos => {
                this.camps = campeonatos;

                this.camps = this.camps.filter(campeonato => {
                    const jogosAtivos = campeonato.jogos.filter(jogo => !this.jogosBloqueados.includes(jogo.event_id));
                    if (jogosAtivos.length > 0) {
                        return campeonato;
                    }
                });

                this.mapJogosDestaque();
                this.cotacoesJogosDestaque();

                this.showLoadingIndicator = false;
            });

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
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['jogosDestaque']) {
            this.remapJogosDestaque();
        }
    }

    mapJogosDestaque() {
        let jogosDestaques = [];

        if (this.camps && this.camps.length > 0) {
            this.camps.forEach(camp => {
                const jogosSele = camp.jogos.filter(jogo => {
                    return this.jogosDestaquesIds.includes(jogo._id + '');
                });

                jogosDestaques = jogosDestaques.concat(jogosSele);
            });
        }

        this.jogosDestaque = jogosDestaques;
        this.cd.detectChanges();
    }

    cotacoesJogosDestaque() {
        this.jogosDestaque.forEach((jogo) => {
            const cotacoesLocalJogo = this.getCotacaoLocal(jogo);

            jogo.cotacoes.slice(0, 3).forEach(cotacao => {
                const cotacaoLocal = cotacoesLocalJogo[cotacao.chave];
                cotacao.valorFinal = this.helperService.calcularCotacao2String(
                    cotacaoLocal ? cotacaoLocal.valor : cotacao.valor,
                    cotacao.chave,
                    jogo.event_id,
                    jogo.favorito,
                    false);
                cotacao.label = this.helperService.apostaTipoLabel(cotacao.chave, 'sigla');
            });
        });
        this.cd.detectChanges();
    }

    getCotacaoLocal(jogo) {
        const cotacoesLocais = this.cotacoesLocais[jogo.event_id];

        if (cotacoesLocais) {
            return cotacoesLocais;
        } else {
            return false;
        }
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
