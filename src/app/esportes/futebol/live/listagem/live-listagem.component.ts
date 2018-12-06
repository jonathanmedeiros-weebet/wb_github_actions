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
                jogos => {
                    jogos.forEach(jogo => {
                        this.jogos[jogo._id] = jogo;
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
                if (!jogo.finalizado) {
                    this.jogos[jogo._id] = jogo;
                } else {
                    delete this.jogos[jogo._id];
                }
            });
    }

    keys() {
        return Object.keys(this.jogos);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
