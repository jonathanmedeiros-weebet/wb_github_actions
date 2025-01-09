import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-state-restriction-modal',
  templateUrl: './state-restriction-modal.component.html',
  styleUrls: ['./state-restriction-modal.component.css']
})
export class StateRestrictionModalComponent {
    constructor(
        public activeModal: NgbActiveModal,
        private router: Router

    ) { }

    back () {
        this.activeModal.close();
    }
    backHome () {
        this.activeModal.close();
        this.router.navigate(['/']);
    }
}
