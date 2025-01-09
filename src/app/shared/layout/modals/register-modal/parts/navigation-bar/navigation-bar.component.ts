import { Component } from '@angular/core';
import { StepService } from 'src/app/shared/services/step.service';

@Component({
    selector: 'app-navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
    currentIndex = 0;
    totalSteps = 3;

    constructor(private stepService: StepService) {
        this.stepService.currentIndex$.subscribe((index) => {
            this.currentIndex = index;
        });
    }

    previous() {
        this.stepService.previous();
    }

    next() {
        this.stepService.next();
    }
}
