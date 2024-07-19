import { useConfigClient } from "@/stores";
import { Observable } from "rxjs";
import io from 'socket.io-client';

enum SocketKeys {
    EVENTS_ROOM_ENTER = 'sala-eventos-entrar',
    EVENTS_ROOM_EXIT = 'sala-eventos-sair',
    EVENT_ROOM_ENTER = 'sala-evento-entrar',
    EVENT_ROOM_EXIT = 'sala-evento-sair',
    EVENT = 'evento',
    EVENTS = 'eventos'
}

export class SocketService {
    private socket: SocketIOClient.Socket | any;

    public connect(): Promise<boolean | string> {
        return new Promise((resolve, reject) => {
            if(!this.socket?.connected) {
                const { liveUrl } = useConfigClient();
                this.socket = io(liveUrl);
                this.socket.on('connect', () => {
                    console.warn('socket connected')
                    resolve(true);
                })
                this.socket.on('disconnect', () => console.warn('socket disconnected'))
            } else {
                reject('Socket já está conectado!');
            }
        })
    }

    public connected(): boolean{
        return this.socket?.connected;
    }

    public disconnect() {
        if(this.connected()) {
            this.socket.disconnect();
        }
    }

    public enterEventsRoom() {
        if(this.connected()) {
            this.socket.emit(SocketKeys.EVENTS_ROOM_ENTER);
        }
    }

    public exitEventsRoom() {
        if(this.connected()) {
            this.socket.emit(SocketKeys.EVENTS_ROOM_EXIT);
        }
    }

    public enterEventRoom(eventId: string | number) {
        if(this.connected()) {
            this.socket.emit(SocketKeys.EVENT_ROOM_ENTER, eventId);
        }
    }

    public exitEventRoom(eventId: string | number) {
        if(this.connected()) {
            this.socket.emit(SocketKeys.EVENT_ROOM_EXIT, eventId);
        }
    }

    public getEvents(): Observable<any> {
        return new Observable((observer: any) => {
            this.socket.on(SocketKeys.EVENTS, (data: any) => observer.next(data));
        });
    }

    public getEventDetail(eventoId: string | number): Observable<any> {
        return new Observable((observer: any) => {
            this.socket.on(`${SocketKeys.EVENT}-${eventoId}`, (data: any) => observer.next(data));
        });
    }
}