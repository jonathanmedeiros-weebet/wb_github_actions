import { Component } from '@angular/core';
import { RegisterV3ModalComponent } from '../register-v3-modal/register-v3-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-onboarding-modal',
  templateUrl: './onboarding-modal.component.html',
  styleUrls: ['./onboarding-modal.component.scss']
})
export class OnboardingModalComponent {
    public modalRef;

    constructor(
            private modalService: NgbModal,
        ) {
        }

    register(){
        this.modalRef = this.modalService.open(
            RegisterV3ModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'md',
                centered: true,
                windowClass: 'modal-750 modal-cadastro-cliente',
                backdrop: 'static'
            }
        );
    }
}
