import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-canceled-bonus-confirm',
  templateUrl: './canceled-bonus-confirm.component.html',
  styleUrls: ['./canceled-bonus-confirm.component.css']
})
export class CanceledBonusConfirmComponent implements OnInit {
    @Input() title;
    @Input() msg;

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
    }
}
