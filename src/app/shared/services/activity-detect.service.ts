import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ClienteService } from './clientes/cliente.service';
import { AuthService, MessageService, UtilsService } from 'src/app/services';

@Injectable({
    providedIn: 'root'
})
export class ActivityDetectService implements OnDestroy {
    private dailyActivityTime = 0;
    private activityTimeGoalInMilliseconds = 0;
    private activityTimerSubscription: Subscription | null = null;
    private destroy$ = new Subject<void>();

    private dailyActivityTimeWatcher$ = new BehaviorSubject<number>(0);
    private activeTimeDetector = new Subject<number>();
    private activityGoalReached = new Subject<void>();

    public activityGoalMet: Observable<number> = this.activeTimeDetector.asObservable();
    private isActivityTimerPaused = false;

    public readonly HALF_MINUTE_IN_MS = 30000;
    private readonly ACTIVITY_TIME_KEY = 'activityTime';
    private readonly ACTIVITY_GOAL_MET_DATE_KEY = 'activityGoalMetDate';

    constructor(
        private clienteService: ClienteService,
        private messageService: MessageService,
        private authService: AuthService,
        private utilsService: UtilsService
    ) {
        this.loadDailyActivityTime();
        this.initializeActivityConfig();
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        this.stopActivityTimer();
    }

    public startActivityTimer(intervalTime: number) {
        if (this.hasActivityGoalBeenMet() || this.activityTimerSubscription) {
            return;
        }
    
        this.activityTimerSubscription = interval(intervalTime)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.incrementDailyActivityTime(intervalTime));
    }

    private hasActivityGoalBeenMet(): boolean {
        const goalMetDateString = this.getActivityGoalMetDate();
        return this.isToday(goalMetDateString) && !!goalMetDateString;
    }

    public getActivityTimeConfig(): Observable<number> {
        return this.clienteService.getConfigs().pipe(
        map(resp => {
            this.activityTimeGoalInMilliseconds = this.utilsService.timeStringToMilliseconds(resp.limiteTempoAtividade);
                return this.activityTimeGoalInMilliseconds;
            })
        );
    }

    public loadDailyActivityTime() {
        if (!this.authService.isLoggedIn() || !this.authService.isCliente()) {
            return;
        }
    
        const storedGoalMetDate = this.getActivityGoalMetDate();
        const storedDailyActivityTime = this.getStoredActivityTime();
    
        if (this.isToday(storedGoalMetDate)) {
            this.dailyActivityTime = storedDailyActivityTime;
        } else {
            this.resetDailyActivity();
        }
    }
    
    private getStoredActivityTime(): number {
        const storedTime = this.getActivityTime();
        return isNaN(storedTime) ? 0 : storedTime;
    }
    
    private evaluateActivityTimeGoal() {
        console.log(this.dailyActivityTime);
        console.log('goal: ',this.activityTimeGoalInMilliseconds)
        if (this.dailyActivityTime >= this.activityTimeGoalInMilliseconds) {
            this.activityGoalReached.next();
            this.setActivityGoalMetDate(new Date().toISOString());
            this.resetDailyActivity();
            this.stopActivityTimer();
        }
    }

    private resetDailyActivity() {
        this.dailyActivityTime = 0;
        this.setActivityTime(0)
    }

    private incrementDailyActivityTime(milliseconds: number) {
        if (this.hasActivityGoalBeenMet()) {
            return;
        }
    
        const storedActivityTime = this.getStoredActivityTime();
        this.dailyActivityTime = storedActivityTime + milliseconds;
        this.setActivityTime(this.dailyActivityTime);
        
        if (this.dailyActivityTime < this.activityTimeGoalInMilliseconds) {
            this.dailyActivityTimeWatcher$.next(this.dailyActivityTime);
        }
    
        this.evaluateActivityTimeGoal();
    }

    public stopActivityTimer() {
        if (this.activityTimerSubscription) {
            this.activityTimerSubscription.unsubscribe();
            this.activityTimerSubscription = null;
            this.isActivityTimerPaused = true;
        }
    }

    public resumeActivityTimer() {
        if (this.isActivityTimerPaused || !this.activityTimerSubscription) {
            this.startActivityTimer(this.HALF_MINUTE_IN_MS);
            this.isActivityTimerPaused = false;
        }
    }

    private handleError(msg: any) {
        this.messageService.error(msg);
    }

    public initializeActivityConfig() {
        if (this.authService.isLoggedIn() && this.authService.isCliente() ) {
            this.getActivityTimeConfig()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (activityTimeGoal) => {
                    this.activityTimeGoalInMilliseconds = activityTimeGoal;
                },
                error: (error) => this.handleError(error),
            });
        }
    }

    public getActivityGoalReached(): Observable<void> {
        return this.activityGoalReached.asObservable();
    }

    private isToday(dateString: string): boolean {
        return this.utilsService.isToday(dateString);
    }

    private getActivityTime(): number {
        const storedTime = Number(localStorage.getItem(this.ACTIVITY_TIME_KEY));
        return isNaN(storedTime) ? 0 : storedTime;
    }

    private setActivityTime(time: number): void {
        localStorage.setItem(this.ACTIVITY_TIME_KEY, time.toString());
    }

    private getActivityGoalMetDate(): string | null {
        return localStorage.getItem(this.ACTIVITY_GOAL_MET_DATE_KEY);
    }

    private setActivityGoalMetDate(date: string): void {
        localStorage.setItem(this.ACTIVITY_GOAL_MET_DATE_KEY, date);
    }

    public resetActivity(): void {
        localStorage.setItem(this.ACTIVITY_TIME_KEY, '0');
        localStorage.removeItem(this.ACTIVITY_GOAL_MET_DATE_KEY);
    }
}