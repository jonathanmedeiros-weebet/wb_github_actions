import { Component } from '@angular/core';
import { StepService } from 'src/app/shared/services/step.service';

@Component({
    selector: 'app-navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
    currentIndex = 0;
    totalSteps = 2;
    formValid = false;

    constructor(private stepService: StepService) {
        this.stepService.currentIndex$.subscribe((index) => {
            this.currentIndex = index;
        });
        this.stepService.formValid$.subscribe((valid) => {
            this.formValid = valid;
        });
    }   

    previous() {
        this.stepService.previous();
    }

    next() {
        if (this.formValid) {
            this.stepService.next();
        }
    }
}
