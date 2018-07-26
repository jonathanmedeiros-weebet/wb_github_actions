import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';

import { MessageService, LiveService } from '../services';

@Component({
    selector: 'app-live',
    templateUrl: 'live.component.html'
})
export class LiveComponent implements OnInit, OnDestroy {
    games = {};
    // game = {};
    connection;
    count = 0;

    constructor(
        private messageService: MessageService,
        private liveService: LiveService
    ) { }

    ngOnInit() {
        this.connection = this.liveService.getGames().subscribe((game: any) => {
            // console.log(`${game.time_a_nome}   ${game.info.time_a_resultado}-${game.info.time_b_resultado}   ${game.time_b_nome}`);
            // console.log(`${game.info.minutos}' ${game.info.tempo}T`);
            // console.log('\n');

            if (!game.finalizado) {
                this.games[game.fi] = game;
            } else {
                delete this.games[game.fi];
            }
            this.count++;
        });
    }

    ngOnDestroy() {
        this.connection.unsubscribe();
    }

    keys() {
        return Object.keys(this.games);
    }

    success(msg) {
        this.messageService.success(msg);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
