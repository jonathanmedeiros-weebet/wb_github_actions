import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Jogo, ItemBilheteEsportivo } from './../../../../models';
import { MessageService, JogoService, LiveService, BilheteEsportivoService } from '../../../../services';

@Component({
    selector: 'app-live-jogo',
    templateUrl: 'live-jogo.component.html'
})
export class LiveJogoComponent implements OnInit, OnDestroy {
    jogo = new Jogo();
    tiposAposta = [];
    itens: ItemBilheteEsportivo[] = [];
    unsub$ = new Subject();

    constructor(
        private messageService: MessageService,
        private jogoService: JogoService,
        private liveService: LiveService,
        private bilheteService: BilheteEsportivoService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.tiposAposta = JSON.parse(localStorage.getItem('tipos-aposta'));

        this.route.params
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                params => {
                    if (params.id) {
                        this.getJogo(params.id);
                    }
                }
            );

        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => this.itens = itens);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    getJogo(id) {
        this.jogoService.getJogo(id)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                jogo => {
                    this.jogo = jogo;

                    this.live();
                },
                error => this.handleError(error)
            );
    }

    live() {
        this.liveService.getJogo(this.jogo._id)
            .pipe(takeUntil(this.unsub$))
            .subscribe((jogo: Jogo) => {
                this.jogo.info = jogo.info;
                this.jogo.cotacoes = jogo.cotacoes;
            });
    }

    addCotacao(jogo: Jogo, cotacao) {
        let modificado = false;
        const index = this.itens.findIndex(item => (item.jogo._id === jogo._id) && (item.cotacao.chave === cotacao.chave));

        if (index >= 0) {
            this.itens.splice(index, 1);
            modificado = true;
        } else {
            const item = this.itens.find(i => i.jogo._id === jogo._id);

            if (!item) {
                this.itens.push({
                    aoVivo: jogo.ao_vivo,
                    jogo_id: jogo._id,
                    cotacao: cotacao,
                    jogo: jogo
                });

                modificado = true;
            }
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
}
