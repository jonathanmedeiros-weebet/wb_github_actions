import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
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
    @Output() maisCotacoesDestaque = new EventEmitter();
    @Input() jogoIdAtual;
    jogosDestaque = [];
    regioesDestaque = null;
    exibindoRegiao = false;
    exibirDestaques = false;
    menuWidth;
    mobileScreen;
    itens = [];
    itensSelecionados = {};
    isDragging = false;
    camps = [];
    jogosBloqueados = [];

    jogosDestaquesIds = [];

    customOptions: OwlOptions = {
        loop: true,
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

        let queryParams = {
            'sport_id': 1,
            'campeonatos_bloqueados': this.paramsService.getCampeonatosBloqueados(1),
            'odds': ['casa_90', 'empate_90', 'fora_90']
        };

        this.campeonatoService.getCampeonatos(queryParams)
            .pipe(
                takeUntil(this.unsub$)
            )
            .subscribe(
                campeonatos => {
                    this.camps = campeonatos;

                    this.camps = this.camps.filter(campeonato => {
                        const jogosAtivos = campeonato.jogos.filter(jogo => !this.jogosBloqueados.includes(jogo.event_id));
                        if (jogosAtivos.length > 0) {
                            return campeonato;
                        }
                    });
                    this.getJogosDestaques();
                },
                error => console.log(error)
            );

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

        this.remapJogosDestaque();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['jogosDestaque']) {
            this.remapJogosDestaque();
        }
    }

    getJogosDestaques() {
        this.jogoService.getJogosDestaque()
            .subscribe(jogos => {
                this.jogosDestaque = jogos.results;
                this.jogosDestaquesIds = jogos.results.map(jogo => jogo.fi + '');
                this.mapJogosDestaque();
            });
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

    remapJogosDestaque() {
        console.log('CHANGE', this.jogosDestaque);
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
}
