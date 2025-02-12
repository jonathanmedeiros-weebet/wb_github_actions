import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StepService } from 'src/app/shared/services/step.service';

@Component({
    selector: 'app-register-modal-component',
    templateUrl: './register-modal-component.component.html',
    styleUrls: ['./register-modal-component.component.scss']
})
export class RegisterModalComponentComponent {

    currentIndex = 0;
    totalSteps = 2;
    formInvalid = true;
    data = {};

    constructor(private stepService: StepService,
        public activeModal: NgbActiveModal
    ) {
        this.stepService.currentIndex$.subscribe((index) => {
            this.currentIndex = index;
        });
        this.stepService.formValid$.subscribe((valid) => {
            this.formInvalid = !valid;
        })

    }

    previous() {
        this.stepService.previous();
    }

    next() {
        this.stepService.next();
    }

    dataChange(event: { [key: string]: any }) {
        this.data = { ...this.data, ...event }
    }

    onClose() {
        this.stepService.reset();
        this.activeModal.close();
    }
}
