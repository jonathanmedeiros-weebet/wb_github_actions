import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IdleDetectService {
    private isSessionExpired = false;
    private timer = null;
    private timeInMilliSeconds = 0;

    public idleDetector: Subject<boolean> = new Subject<boolean>();

    watcher() {
        return this.idleDetector.asObservable();
    }

    startTimer(timeInMilliSeconds: number) {
        this.timeInMilliSeconds = timeInMilliSeconds;

        this.timer = setTimeout(() => {
            this.isSessionExpired = true;
            this.idleDetector.next(this.isSessionExpired);
        }, this.timeInMilliSeconds);
    }

    resetTimer() {
        if (!this.isSessionExpired) {
            this.isSessionExpired = false;
            this.stopTimer();
            this.startTimer(this.timeInMilliSeconds);
        }
    }

    stopTimer() {
        clearTimeout(this.timer);
    }
}