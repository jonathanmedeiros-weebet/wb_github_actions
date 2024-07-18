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

    public connect() {
        if(!this.socket?.connected) {
            const { liveUrl } = useConfigClient();
            this.socket = io(liveUrl);
            this.socket.on('connect', () => console.warn('socket connected'))
            this.socket.on('disconnect', () => console.warn('socket disconnected'))
        }
    }

    public connected(): boolean{
        return this.socket?.connected;
    }

    public disconnect() {
        if(this.socket?.connected) {
            this.socket.disconnect();
        }
    }

    public enterEventsRoom() {
        this.socket.emit(SocketKeys.EVENTS_ROOM_ENTER);
    }

    public exitEventsRoom() {
        this.socket.emit(SocketKeys.EVENTS_ROOM_EXIT);
    }

    public enterEventRoom(eventId: string | number) {
        this.socket.emit(SocketKeys.EVENT_ROOM_ENTER, eventId);
    }

    public exitEventRoom(eventId: string | number) {
        this.socket.emit(SocketKeys.EVENT_ROOM_EXIT, eventId);
    }

    getEvents(): Observable<any> {
        return new Observable((observer: any) => {
            this.socket.on(SocketKeys.EVENTS, (data: any) => observer.next(data));
        });
    }

    getEventDetail(eventoId: string | number): Observable<any> {
        return new Observable((observer: any) => {
            this.socket.on(`${SocketKeys.EVENT}-${eventoId}`, (data: any) => observer.next(data));
        });
    }
}