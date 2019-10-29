import {
    Component, OnInit, OnDestroy, ElementRef,
    Renderer2, DoCheck, EventEmitter, Input,
    Output
} from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Jogo, ItemBilheteEsportivo } from './../../../../models';
import { ParametrosLocaisService, MessageService, JogoService, LiveService, BilheteEsportivoService } from '../../../../services';

@Component({
    selector: 'app-live-jogo',
    templateUrl: 'live-jogo.component.html',
    styleUrls: ['live-jogo.component.css']
})
export class LiveJogoComponent implements OnInit, OnDestroy, DoCheck {
    @Input() jogoId;
    @Output() exibirMaisCotacoes = new EventEmitter();
    jogo;
    odds: any = {};
    itens: ItemBilheteEsportivo[] = [];
    tiposAposta;
    objectKeys = Object.keys;
    showLoadingIndicator = true;
    minutoEncerramentoAoVivo = 0;
    contentSportsEl;
    unsub$ = new Subject();

    constructor(
        private messageService: MessageService,
        private jogoService: JogoService,
        private liveService: LiveService,
        private bilheteService: BilheteEsportivoService,
        private el: ElementRef,
        private renderer: Renderer2,
        private router: Router,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit() {
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
        const altura = window.innerHeight - 69;
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

    mapearCotacoes(cotacoes) {
        this.odds = {};

        cotacoes.forEach(cotacao => {
            const tipoAposta = this.tiposAposta[cotacao.chave];

            if (tipoAposta && parseInt(tipoAposta.ao_vivo, 10)) {
                let odd = this.odds[tipoAposta.cat_chave];
                if (!odd) {
                    odd = {
                        'nome': tipoAposta.cat_nome,
                        'tempo': tipoAposta.tempo,
                        'principal': tipoAposta.p,
                        'cotacoes': []
                    };
                    this.odds[tipoAposta.cat_chave] = odd;
                }

                odd.cotacoes.push(cotacao);
            }
        });

        this.showLoadingIndicator = false;
    }

    addCotacao(jogo: Jogo, cotacao) {
        let modificado = false;
        const indexGame = this.itens.findIndex(i => i.jogo._id === jogo._id);
        const indexOdd = this.itens.findIndex(i => (i.jogo._id === jogo._id) && (i.cotacao.chave === cotacao.chave));

        const item = {
            aoVivo: jogo.ao_vivo,
            jogo_id: jogo._id,
            jogo_nome: jogo.nome,
            tempo: jogo.info.minutos,
            time_a_placar: jogo.info.time_a_resultado,
            time_b_placar: jogo.info.time_b_resultado,
            jogo: jogo,
            cotacao: cotacao
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
}
