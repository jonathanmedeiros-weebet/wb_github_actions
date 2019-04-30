import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, PrintService, HelperService } from '../../../../services';

@Component({
    selector: 'app-recarga-success-modal',
    templateUrl: './recarga-success-modal.component.html',
    styleUrls: ['./recarga-success-modal.component.css']
})
export class RecargaSuccessModalComponent implements OnInit {
    @Input() recarga;
    appMobile;

    constructor(
        public activeModal: NgbActiveModal,
        private auth: AuthService,
        private printService: PrintService,
        private helper: HelperService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
    }

    printTicket() {
        this.printService.comprovanteRecarga(this.recarga);
    }

    shareTicket() {
        this.helper.sharedRecargaCartao(this.recarga);
    }
}
