import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Jogo } from './../../models';
import { MessageService, JogoService, LiveService } from '../../services';

@Component({
    selector: 'app-live-jogo',
    templateUrl: 'live-jogo.component.html'
})
export class LiveJogoComponent implements OnInit, OnDestroy {
    jogo = new Jogo();
    tiposAposta = [];
    unsub$ = new Subject();

    constructor(
        private messageService: MessageService,
        private jogoService: JogoService,
        private liveService: LiveService,
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

    showOdd(odd) {
        return this.tiposAposta[odd] ? true : false;
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
