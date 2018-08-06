import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Jogo, ItemBilheteEsportivo } from './../../models';
import { JogoService, MessageService, BilheteEsportivoService } from './../../services';

import { Subscription } from 'rxjs';

@Component({
    selector: 'futebol-jogo',
    templateUrl: 'jogo.component.html',
    styleUrls: ['jogo.component.css']
})

export class JogoComponent implements OnInit, OnDestroy {
    jogo: Jogo = new Jogo();
    itens: ItemBilheteEsportivo[];
    bilheteSub: Subscription;
    sub: Subscription;

    constructor(
        private jogoService: JogoService,
        private bilheteService: BilheteEsportivoService,
        private messageService: MessageService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params: any) => {
            if (params['id']) {
                const id = +params['id'];

                this.jogoService.getJogo(id).subscribe(
                    jogo => {
                        this.jogo = jogo;
                    },
                    error => this.messageService.error(error)
                );
            }
        });

        this.bilheteSub = this.bilheteService.itensAtuais.subscribe(itens => this.itens = itens);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.bilheteSub.unsubscribe();
    }

    addCotacao(jogo, cotacao) {
        let modificado = false;
        const index = this.itens.findIndex(item => (item.jogoId == jogo._id) && (item.cotacao.chave == cotacao.chave));

        if (index >= 0) {
            this.itens.splice(index, 1);
            modificado = true;
        } else {
            const item = this.itens.find(item => item.jogoId == jogo._id);

            if (!item) {
                this.itens.push({
                    jogoId: jogo._id,
                    jogoNome: jogo.nome,
                    cotacao: cotacao
                });

                modificado = true;
            }
        }

        if (modificado) {
            this.bilheteService.atualizarItens(this.itens);
        }
    }
}
