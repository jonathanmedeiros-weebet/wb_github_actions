import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-compartilhamento-bilhete-modal',
  templateUrl: './compartilhamento-bilhete-modal.component.html',
  styleUrls: ['./compartilhamento-bilhete-modal.component.css']
})
export class CompatilhamentoBilheteModal implements OnInit {
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }
}
