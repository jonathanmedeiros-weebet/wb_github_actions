import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-onboarding-modal',
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.scss']
})
export class OnboardingModalComponent {
    public modalRef;

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
    ) {
    }

    register(){
        this.activeModal.dismiss();
        this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-400 modal-h-350 modal-login',
                centered: true,
            }
        );
    }
}
