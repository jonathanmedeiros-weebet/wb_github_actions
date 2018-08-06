import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable()
export class LiveService {
    private url = 'http://localhost:3002';
    private socket;

    constructor() { }

    getGames(): Observable<any> {
        let observable = new Observable(observer => {
            this.socket = io(this.url);

            this.socket.on('jogo-ao-vivo', (data) => {
                observer.next(data);
            });

            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }

}
