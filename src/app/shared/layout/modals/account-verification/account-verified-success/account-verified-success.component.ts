import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-account-verified-success',
  templateUrl: './account-verified-success.component.html',
  styleUrls: ['./account-verified-success.component.scss']
})
export class AccountVerifiedSuccessComponent {

  constructor(private activeModal: NgbActiveModal){}

  public handleClose() {
    this.activeModal.close();
  }
}
