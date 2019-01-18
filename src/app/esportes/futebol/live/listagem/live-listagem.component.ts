import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService, JogoService, LiveService } from '../../../../services';
import { Jogo } from '../../../../models';

@Component({
    selector: 'app-live-listagem',
    templateUrl: 'live-listagem.component.html',
    styleUrls: ['live-listagem.component.css']
})
export class LiveListagemComponent implements OnInit, OnDestroy {
    jogos = {};
    campeonatos = new Map();
    unsub$ = new Subject();

    constructor(
        private messageService: MessageService,
        private jogoService: JogoService,
        private liveService: LiveService,
        private el: ElementRef,
        private renderer: Renderer2
    ) { }

    ngOnInit() {
        this.jogoService.getJogosAoVivo()
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => {
                    campeonatos.forEach(campeonato => {
                        const jogos = new Map();

                        campeonato.jogos.forEach(jogo => {
                            jogos.set(jogo._id, jogo);
                        });

                        campeonato.jogos = jogos;

                        this.campeonatos.set(campeonato._id, campeonato);
                    });

                    this.live();
                },
                error => this.handleError(error)
            );

        const altura = window.innerHeight - 69;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-sticky');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura - 60}px`);
        const contentSportsEl = this.el.nativeElement.querySelector('.content-sports');
        this.renderer.setStyle(contentSportsEl, 'height', `${altura}px`);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    live() {
        this.liveService.getJogos()
            .pipe(takeUntil(this.unsub$))
            .subscribe((jogo: Jogo) => {
                let campeonato = this.campeonatos.get(jogo.campeonato._id);

                if (!campeonato) {
                    campeonato = {
                        _id: jogo.campeonato._id,
                        nome: jogo.campeonato.nome,
                        jogos: new Map()
                    };
                    this.campeonatos.set(jogo.campeonato._id, campeonato);
                }

                if (!jogo.finalizado && jogo.cotacoes.length > 0) {
                    campeonato.jogos.set(jogo._id, jogo);
                } else {
                    campeonato.jogos.delete(jogo._id);

                    if (!campeonato.jogos.size) {
                        this.campeonatos.delete(campeonato._id);
                    }
                }
            });
    }

    reOrder(a, b) {
        if (a.value.nome > b.value.nome) {
            return b.key;
        }
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
