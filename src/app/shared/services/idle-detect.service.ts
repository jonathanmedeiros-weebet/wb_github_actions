import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IdleDetectService {
    private isSessionExpired = true;
    private timer = null;
    private timeInMilliSeconds = 0;

    public idleDetector: Subject<boolean> = new Subject<boolean>();

    watcher() {
        return this.idleDetector.asObservable();
    }

    startTimer(timeInMilliSeconds: number) {
        this.isSessionExpired = false;
        this.timeInMilliSeconds = timeInMilliSeconds;

        this.timer = setTimeout(() => {
            this.isSessionExpired = true;
            this.idleDetector.next(this.isSessionExpired);
        }, this.timeInMilliSeconds);
    }

    resetTimer() {
        if (!this.isSessionExpired) {
            this.stopTimer();
            this.startTimer(this.timeInMilliSeconds);
        }
    }

    stopTimer() {
        clearTimeout(this.timer);
    }
}