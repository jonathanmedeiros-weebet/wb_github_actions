import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-migration-information-modal',
  templateUrl: './migration-information-modal.component.html',
  styleUrls: ['./migration-information-modal.component.css']
})
export class MigrationInformationModalComponent {
  constructor(
      public activeModal: NgbActiveModal,
    ) { }
}
