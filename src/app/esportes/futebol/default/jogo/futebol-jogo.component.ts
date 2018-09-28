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

        this.tiposAposta = JSON.parse(localStorage.getItem('tipos_aposta'));
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
        const indexGame = this.itens.findIndex(i => i.jogo._id === jogo._id);
        const indexOdd = this.itens.findIndex(i => (i.jogo._id === jogo._id) && (i.cotacao.chave === cotacao.chave));

        const item = {
            aoVivo: jogo.ao_vivo,
            jogo_id: jogo._id,
            cotacao: cotacao,
            jogo: jogo
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
}
