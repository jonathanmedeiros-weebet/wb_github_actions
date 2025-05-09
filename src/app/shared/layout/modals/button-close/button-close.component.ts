import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-button-close',
  standalone: true,
  imports: [],
  templateUrl: './button-close.component.html',
  styleUrl: './button-close.component.scss'
})
export class ButtonCloseComponent {
  constructor(    
      private modalService: NgbModal,
      public activeModal: NgbActiveModal
    ) { }

  handleClose() {
    this.activeModal.close();
  }

}
