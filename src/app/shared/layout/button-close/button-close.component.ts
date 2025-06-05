import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-button-close',
  templateUrl: './button-close.component.html',
  styleUrl: './button-close.component.scss'
})
export class ButtonCloseComponent {

  @Output() onClick = new EventEmitter<void>();
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  handleClose() {
    this.activeModal.close();
  }

  handleClick() {
    this.onClick.emit();
  }
}
