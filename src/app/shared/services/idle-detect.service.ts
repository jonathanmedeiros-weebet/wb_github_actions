import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ClienteService } from './clientes/cliente.service';

@Injectable({
    providedIn: 'root'
})
export class IdleDetectService {
    private isSessionExpired = true;
    private timer = null;
    private timeInMilliSeconds = 0;

    private activityTimeGoal: number = 0;
    private dailyActivityTime: number = 0;
    private currentDate = new Date();

    private activityTimeWatcher$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private activeTimeDetector: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    private activityTimerSubscription: Subscription | null = null;

    public idleDetector: Subject<boolean> = new Subject<boolean>();

    constructor(private clienteService: ClienteService) {
        this.loadActivityTime();
    }

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

    startActivityTimer(intervalTime: number = 60000) {
        if (this.activityTimerSubscription) {
            this.activityTimerSubscription.unsubscribe();
        }

        this.activityTimerSubscription = interval(intervalTime).subscribe(() => {
            this.incrementActivityTime(intervalTime);
        });
    }

    getActivityTimeConfig(): Observable<number> {
        console.log('chamou getActivityTimeConfig');

        return this.clienteService.getConfigs().pipe(
            map(resp => {
            console.log('Resposta da API:', resp);
            const activityTime = this.formatActivityTime(resp.limiteTempoAtividade);
            console.log('Tempo formatado:', activityTime);
            this.activityTimeGoal = this.timeStringToMilliseconds(activityTime);
            console.log('activityTimeGoal: ' + this.activityTimeGoal);
            return this.activityTimeGoal;
            }),
            tap({
            error: (error) => {
                this.handleError(error);
            }
            })
        );
    }

    timeStringToMilliseconds(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return (hours * 60 + minutes) * 60 * 1000;
    }

    formatActivityTime(time: string): string {
        return time;
    }

    loadActivityTime() {
        console.log('Carregando tempo de atividade do localStorage');
        const storedActivityTime = localStorage.getItem('activityTime');
        const storedDate = localStorage.getItem('activityDate');
    
        console.log(`Tempo de atividade recuperado do localStorage: ${storedActivityTime}`);
    
        if (storedDate && new Date(storedDate).getDate() === this.currentDate.getDate()) {
            this.dailyActivityTime = Number(storedActivityTime) || 0;
        } else {
            this.dailyActivityTime = 0;
            localStorage.setItem('activityDate', this.currentDate.toISOString());
            localStorage.setItem('activityTime', '0');
            localStorage.removeItem('activityGoalMetDate');
        }
    }

    hasActivityGoalBeenMet(): boolean {
        const goalDate = localStorage.getItem('activityGoalMetDate');
        return goalDate && new Date(goalDate).getDate() === new Date().getDate();
    }

    checkActivityTimeGoal() {
        if (this.dailyActivityTime >= this.activityTimeGoal && !this.hasActivityGoalBeenMet()) {
            console.log('Meta de tempo de atividade atingida!');
            this.activeTimeDetector.next(this.dailyActivityTime);
            localStorage.setItem('activityGoalMetDate', new Date().toISOString());
            this.resetDailyActivity();
        }
    }

    resetDailyActivity() {
        this.dailyActivityTime = 0;
        localStorage.setItem('activityTime', '0');
    }

    incrementActivityTime(milliseconds: number) {
        console.log(`Incrementando tempo de atividade em: ${milliseconds} ms`);
    
        this.dailyActivityTime += milliseconds;
    
        console.log(`Armazenando activityTime: ${this.dailyActivityTime}`);
        localStorage.setItem('activityTime', this.dailyActivityTime.toString());
        this.activityTimeWatcher$.next(this.dailyActivityTime);
        this.checkActivityTimeGoal();
    }

    activityTimeWatcher(): Observable<number> {
        return this.activityTimeWatcher$.asObservable();
    }

    stopActivityTimer() {
        if (this.activityTimerSubscription) {
            this.activityTimerSubscription.unsubscribe();
            this.activityTimerSubscription = null;
        }
    }

    private handleError(error: any) {
        console.error('Erro ao buscar configurações de atividade:', error);
    }
}
