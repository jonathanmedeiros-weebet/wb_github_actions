import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-session-alert-modal',
  templateUrl: './session-alert-modal.component.html',
  styleUrls: ['./session-alert-modal.component.css']
})
export class SessionAlertModalComponent {

    @Output() confirmSessionTermination: EventEmitter<void> = new EventEmitter();
    @Output() sessionAlertClosed: EventEmitter<void> = new EventEmitter();

    constructor(private activeModal: NgbActiveModal) {}

    terminateSession() {
        this.confirmSessionTermination.emit();
        this.activeModal.dismiss();
    }

    close() {
        this.sessionAlertClosed.emit();
        this.activeModal.dismiss();
    }
}
