import { Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StepService {
    private currentIndexSource = new BehaviorSubject<number>(0);
    currentIndex$ = this.currentIndexSource.asObservable();

    totalSteps = 3;

    get currentIndex() {
        return this.currentIndexSource.value;
    }

    previous() {
        if (this.currentIndex > 0) {
            this.currentIndexSource.next(this.currentIndex - 1);
        }
    }

    next() {
        if (this.currentIndex < this.totalSteps - 1) {
            this.currentIndexSource.next(this.currentIndex + 1);
        }
    }
}
