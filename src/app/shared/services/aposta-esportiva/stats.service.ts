import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';

import { config } from './../../config';

@Injectable()
export class StatsService {
    private url = config.STATS_HOST;
    private socket;

    constructor() { }

    connect() {
        this.socket = io(this.url);
    }

    disconnect() {
        this.socket.disconnect();
    }

    entrarSalaStats(eventId) {
        this.socket.emit('sala-stats-entrar', eventId);
    }

    sairSalaStats(eventId) {
        this.socket.emit('sala-stats-sair', eventId);
    }

    getEventoStats(jogoId): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on(`stats-${jogoId}`, data => {
                observer.next(data);
            });
        });

        return observable;
    }
}
