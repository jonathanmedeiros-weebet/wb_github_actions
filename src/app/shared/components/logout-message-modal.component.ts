import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-logout-message-modal',
    template: `
        <div class="modal-body" style="padding: 30px;">
            <h3 style="color: #ffff; font-weight: 600; font-size: 24px; margin-top: 20px; margin-bottom: 20px; text-align: center;">{{ title }}</h3>
            <p style="text-align: center; margin-bottom: 30px;">{{ message }}</p>
            <button type="button" class="btn btn-custom btn-block" (click)="activeModal.close()">{{ buttonLabel }}</button>
        </div>
    `
})
export class LogoutMessageModalComponent {
    message: string;
    title: string;
    buttonLabel: string;

    constructor(public activeModal: NgbActiveModal) { }
}
