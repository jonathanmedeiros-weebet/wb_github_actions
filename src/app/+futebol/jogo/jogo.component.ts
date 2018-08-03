import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Jogo, BilheteEsportivo } from './../../models';
import { JogoService, MessageService, BilheteEsportivoService } from './../../services';

import { Subscription } from 'rxjs';

@Component({
    selector: 'app-futebol-jogo',
    templateUrl: 'jogo.component.html',
    styleUrls: ['jogo.component.css']
})

export class JogoComponent implements OnInit, OnDestroy {
    jogo: Jogo = new Jogo();
    bilhete: BilheteEsportivo;
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

        this.bilheteSub = this.bilheteService.bilheteAtual.subscribe(bilhete => this.bilhete = bilhete);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.bilheteSub.unsubscribe();
    }

    addCotacao(jogo, cotacao) {
        const index = this.bilhete.itens.findIndex(item => item.cotacao.chave == cotacao.chave);

        if (index >= 0) {
            this.bilhete.itens.splice(index, 1);
        } else {
            this.bilhete.itens.push({
                nomeJogo: jogo.nome,
                cotacao: cotacao
            });
        }

        this.bilheteService.atualizarBilhete(this.bilhete);
    }
}
