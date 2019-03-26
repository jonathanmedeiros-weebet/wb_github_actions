import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cancel-aposta-modal',
  templateUrl: './cancel-aposta-modal.component.html',
  styleUrls: ['./cancel-aposta-modal.component.css']
})
export class CancelApostaModalComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

}
