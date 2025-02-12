import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StepService {
    private currentIndexSource = new BehaviorSubject<number>(0);
    currentIndex$ = this.currentIndexSource.asObservable();

    private formValidSource = new BehaviorSubject<boolean>(false);
    formValid$ = this.formValidSource.asObservable();

    private submitForm = new BehaviorSubject<boolean>(undefined);
    submitForm$ = this.submitForm.asObservable();

    totalSteps = 2;

    get currentIndex() {
        return this.currentIndexSource.value;
    }

    get formValid() {
        return this.formValidSource.value;
    }

    get formSubmit() {
        return this.submitForm.value;
    }

    previous() {
        this.formValidSource.next(false);
        if (this.currentIndex > 0) {
            this.currentIndexSource.next(this.currentIndex - 1);
        }
    }

    next() {
        if (this.currentIndex <= this.totalSteps - 1) {
            this.formValidSource.next(false);
            this.currentIndexSource.next(this.currentIndex + 1);
        } else {
            this.submitForm.next(true)
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
