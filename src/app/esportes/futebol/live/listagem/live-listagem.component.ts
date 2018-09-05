import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService, JogoService, LiveService } from '../../../../services';
import { Jogo } from '../../../../models';

@Component({
    selector: 'app-live-listagem',
    templateUrl: 'live-listagem.component.html'
})
export class LiveListagemComponent implements OnInit, OnDestroy {
    jogos = {};
    unsub$ = new Subject();

    constructor(
        private messageService: MessageService,
        private jogoService: JogoService,
        private liveService: LiveService
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
