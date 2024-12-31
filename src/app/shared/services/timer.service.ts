import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CronService implements OnDestroy {
    private intervalId: any;

    constructor() { }

    ngOnDestroy(): void {
        this.stopTimer();
    }

    startTime(action: () => void, intervalMs: number): void {
        action();
        this.intervalId = setInterval(() => {
            action();
        }, intervalMs);
    }

    stopTimer(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
