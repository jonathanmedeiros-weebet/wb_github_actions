import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EsqueceuSenhaModalComponent } from '../esqueceu-senha-modal/esqueceu-senha-modal.component';
import { config } from '../../../config';

@Component({
  selector: 'app-block-peer-attemps-modal',
  templateUrl: './block-peer-attemps-modal.component.html',
  styleUrls: ['./block-peer-attemps-modal.component.scss']
})
export class BlockPeerAttempsModalComponent {
  public logo: string = config.LOGO;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}

  get isMobile(): boolean {
    return window.innerWidth <= 1025;
  }

  public openPasswordRecoveryModal() {
    this.activeModal.dismiss();
    const options = this.isMobile
      ? { windowClass: 'modal-fullscreen' }
      : {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'modal-400',
        centered: true,
      };

    this.modalService.open(EsqueceuSenhaModalComponent, options);
  }

  public toClose() {
    this.activeModal.dismiss()
  }
}
