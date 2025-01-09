import { Component } from '@angular/core';
import { StepService } from 'src/app/shared/services/step.service';

@Component({
    selector: 'app-register-modal-component',
    templateUrl: './register-modal-component.component.html',
    styleUrls: ['./register-modal-component.component.scss']
})
export class RegisterModalComponentComponent {
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
