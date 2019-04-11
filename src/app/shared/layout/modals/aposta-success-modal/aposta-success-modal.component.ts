import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExibirBilheteEsportivoComponent } from './../../exibir-bilhete/esportes/exibir-bilhete-esportivo.component';
import { AuthService, PrintService, HelperService } from './../../../../services';

@Component({
    selector: 'app-aposta-success-modal',
    templateUrl: './aposta-success-modal.component.html',
    styleUrls: ['./aposta-success-modal.component.css']
})
export class ApostaSuccessModalComponent implements OnInit {
    @ViewChild(ExibirBilheteEsportivoComponent) bilheteEsportivoComponent: ExibirBilheteEsportivoComponent;
    @Input() aposta;
    @Input() codigo;
    title = '';
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

        if (this.isLoggedIn) {
            this.title = 'Aposta Realizada';
        } else {
            this.title = 'Atenção';
        }
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
            this.bilheteEsportivoComponent.shared();
        } else {
            this.helperService.sharedLotteryTicket(this.aposta);
        }
    }
}
