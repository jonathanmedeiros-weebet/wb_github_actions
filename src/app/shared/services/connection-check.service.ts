import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionCheckService {
    private onlineStatusSubject = new BehaviorSubject<boolean>(true);
    onlineStatus$ = this.onlineStatusSubject.asObservable();

    constructor() {
        this.initializeOnlineStatus();
    }
  
    private initializeOnlineStatus() {
        this.onlineStatusSubject.next(window.navigator.onLine);

        window.addEventListener('online', () => {
            this.onlineStatusSubject.next(true);
        });

        window.addEventListener('offline', () => {
            setTimeout(() => {
                if (!window.navigator.onLine) {
                    this.onlineStatusSubject.next(false);
                } else {
                    this.onlineStatusSubject.next(true);
                }
            }, 4000);
        });
    }

}
