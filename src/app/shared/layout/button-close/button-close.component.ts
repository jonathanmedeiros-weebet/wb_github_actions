import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-button-close',
  templateUrl: './button-close.component.html',
  styleUrl: './button-close.component.scss'
})
export class ButtonCloseComponent {
  constructor(    
    public activeModal: NgbActiveModal
  ) { }

  handleClose() {
    this.activeModal.close();
  }
}
