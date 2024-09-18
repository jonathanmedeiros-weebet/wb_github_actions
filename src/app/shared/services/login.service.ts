import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private eventSubject = new Subject<void>();

    event$ = this.eventSubject.asObservable();

    triggerEvent() {
        this.eventSubject.next();
    }
}
