import { forEach } from 'lodash';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BilheteEsportivoService, HelperService, JogoService, ParametrosLocaisService, SportIdService} from 'src/app/services';

@Component({
    selector: 'app-destaques',
    templateUrl: './destaques.component.html',
    styleUrls: ['./destaques.component.css']
})
export class DestaquesComponent implements OnInit, OnChanges {
    @Output() maisCotacoesDestaque = new EventEmitter();
    @Input() jogosDestaque = [];
    @Input() jogoIdAtual;
    regioesDestaque = null;
    exibindoRegiao = false;
    exibirDestaques = false;
    menuWidth;
    mobileScreen;
    itens = [];
    itensSelecionados = {};
    isDragging = false;

    teamShieldsFolder;

    customOptions: OwlOptions = {
        loop: false,
        autoplay: true,
        rewind: true,
        margin: 10,
        nav: true,
        dots: false,
        autoHeight: true,
        autoWidth: true,
        navText: [ '<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>' ]
    };

    unsub$ = new Subject();

    constructor(
        private jogoService: JogoService,
        protected helperService: HelperService,
        private cd: ChangeDetectorRef,
        private bilheteService: BilheteEsportivoService,
        private paramsLocaisService: ParametrosLocaisService,
        private sportIdService: SportIdService,
    ) {
        this.teamShieldsFolder = this.sportIdService.teamShieldsFolder();
    }

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

            this.remapJogosDestaque();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['jogosDestaque']) {
            this.remapJogosDestaque();
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

    maisCotacoes(jogoId) {
        if(!this.isDragging) {
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
