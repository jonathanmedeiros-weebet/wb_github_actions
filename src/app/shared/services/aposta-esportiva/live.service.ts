import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as io from 'socket.io-client';

import { config } from './../../config';

@Injectable()
export class LiveService {
    private url = config.CENTER_HOST;
    private socket;

    constructor() { }

    getJogos(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket = io(this.url);

            this.socket.on('jogo-ao-vivo', (data) => {
                observer.next(data);
            });

            return () => {
                this.socket.disconnect();
            };
        });

        return observable;
    }

    getJogo(jogoId): Observable<any> {
        const observable = new Observable(observer => {
            this.socket = io(this.url);

            this.socket.on(`live-${jogoId}`, (data) => {
                observer.next(data);
            });

            return () => {
                this.socket.disconnect();
            };
        });

        return observable;
    }

}
