import { Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StepService {
    private currentIndexSource = new BehaviorSubject<number>(0);
    currentIndex$ = this.currentIndexSource.asObservable();

    private formValidSource = new BehaviorSubject<boolean>(false);
    formValid$ = this.formValidSource.asObservable();

    totalSteps = 3;

    get currentIndex() {
        return this.currentIndexSource.value;
    }

    get formValid() {
        return this.formValidSource.value;
    }

    previous() {
        this.formValidSource.next(false);
        if (this.currentIndex > 0) {
            this.currentIndexSource.next(this.currentIndex - 1);
        }
    }

    next() {
        this.formValidSource.next(false);
        if (this.currentIndex < this.totalSteps - 1) {
            this.currentIndexSource.next(this.currentIndex + 1);
        }
    }

    reset() {
        this.currentIndexSource.next(0);
        this.formValidSource.next(false);
    }

    changeFormValid(valid: boolean) {
        this.formValidSource.next(valid);
    }

}
