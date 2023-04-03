import { Component, OnInit, Input} from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-regras-bonus-modal',
  templateUrl: './regras-bonus-modal.component.html',
  styleUrls: ['./regras-bonus-modal.component.css']
})
export class RegrasBonusModalComponent implements OnInit {

	constructor(
		public activeModal: NgbActiveModal,
	) { }

    ngOnInit(): void {

    }
}
