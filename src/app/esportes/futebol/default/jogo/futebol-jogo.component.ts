import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Jogo, ItemBilheteEsportivo } from './../../../../models';
import { JogoService, MessageService, BilheteEsportivoService } from './../../../../services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-futebol-jogo',
    templateUrl: 'futebol-jogo.component.html',
    styleUrls: ['futebol-jogo.component.css']
})

export class FutebolJogoComponent implements OnInit, OnDestroy {
    jogo: Jogo = new Jogo();
    itens: ItemBilheteEsportivo[] = [];
    tiposAposta;
    unsub$ = new Subject();

    constructor(
        private jogoService: JogoService,
        private bilheteService: BilheteEsportivoService,
        private messageService: MessageService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                if (params['id']) {
                    const id = +params['id'];

                    this.jogoService.getJogo(id)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            jogo => {
                                this.jogo = jogo;
                            },
                            error => this.messageService.error(error)
                        );
                }
            });

        this.tiposAposta = JSON.parse(localStorage.getItem('tipos-aposta'));
        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => this.itens = itens);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
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
}
