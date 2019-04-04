import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, PrintService, HelperService } from './../../../../services';

@Component({
    selector: 'app-aposta-modal',
    templateUrl: './aposta-modal.component.html',
    styleUrls: ['./aposta-modal.component.css']
})
export class ApostaModalComponent implements OnInit {
    @Input() aposta;
    appMobile;

    constructor(
        public activeModal: NgbActiveModal,
        private auth: AuthService,
        private printService: PrintService,
        private helperService: HelperService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
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
