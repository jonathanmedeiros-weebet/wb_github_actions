import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss']
})
export class SuccessModalComponent {
  @Input() title: string;
  @Input() description: string;
  @Input() buttonText: string = 'Fechar';

  constructor(private activeModal: NgbActiveModal){}

  get hasButton(): boolean {
    return Boolean(this.buttonText);
  }

  public handleClick() {
    this.activeModal.close();
  }
}
