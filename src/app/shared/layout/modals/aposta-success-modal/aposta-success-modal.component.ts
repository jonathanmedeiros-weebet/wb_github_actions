import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, PrintService, HelperService } from './../../../../services';

@Component({
    selector: 'app-aposta-success-modal',
    templateUrl: './aposta-success-modal.component.html'
})
export class ApostaSuccessModalComponent implements OnInit {
    @Input() aposta;
    @Input() codigo;
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
        if (this.aposta.tipo === 'esportes') {
            this.printService.sportsTicket(this.aposta);
        } else {
            this.printService.lotteryTicket(this.aposta);
        }
    }

    shareTicket() {
        if (this.aposta.tipo === 'esportes') {
            this.helperService.sharedSportsTicket(this.aposta);
        } else {
            this.helperService.sharedLotteryTicket(this.aposta);
        }
    }
}
