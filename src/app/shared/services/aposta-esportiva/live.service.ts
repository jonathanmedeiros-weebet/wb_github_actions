import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

import { config } from './../../config';

@Injectable()
export class LiveService {
    private url = config.LIVE_HOST;
    private socket;

    constructor() { }

    connect() {
        this.socket = io(this.url);
    }

    disconnect() {
        this.socket.disconnect();
    }

    entrarSalaEventosFutebol() {
        this.socket.emit('sala-eventos-entrar');
    }

    sairSalaEventosFutebol() {
        this.socket.emit('sala-eventos-sair');
    }

    entrarSalaEventosBasquete() {
        this.socket.emit('sala-eventos-basquete-entrar');
    }

    sairSalaEventosBasquete() {
        this.socket.emit('sala-eventos-basquete-sair');
    }

    entrarSalaEvento(eventId) {
        this.socket.emit('sala-evento-entrar', eventId);
    }

    sairSalaEvento(eventId) {
        this.socket.emit('sala-evento-sair', eventId);
    }

    getEventos(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('eventos', (data) => {
                observer.next(data);
            });
        });

        return observable;
    }

    getEventoCompleto(eventoId): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on(`evento-${eventoId}`, (data) => {
                observer.next(data);
            });
        });

        return observable;
    }
}
