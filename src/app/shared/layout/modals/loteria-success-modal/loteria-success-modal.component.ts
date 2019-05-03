import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, PrintService, HelperService } from './../../../../services';

@Component({
    selector: 'app-loteria-success-modal',
    templateUrl: './loteria-success-modal.component.html'
})
export class LoteriaSuccessModalComponent implements OnInit {
    @Input() mensagem;
    @Input() aposta;
    appMobile;
    isLoggedIn;

    constructor(
        public activeModal: NgbActiveModal,
        private auth: AuthService,
        private printService: PrintService,
        private helperService: HelperService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.isLoggedIn = this.auth.isLoggedIn();
    }

    printTicket() {
        this.printService.lotteryTicket(this.aposta);
    }

    shareTicket() {
        this.helperService.sharedLotteryTicket(this.aposta);
    }
}
