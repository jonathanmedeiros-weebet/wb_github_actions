import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService, JogoService, LiveService } from '../../../../services';
import { Jogo } from '../../../../models';

import PerfectScrollbar from 'perfect-scrollbar';

declare var $;
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

        let altura = window.innerHeight - 69;
        $('.wrap-sticky').css('min-height', altura - 60);
        $('.content-sports').css('height', altura);
        $('.pre-bilhete').css('height', altura);

        const ps = new PerfectScrollbar('.custom-scroll');
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
