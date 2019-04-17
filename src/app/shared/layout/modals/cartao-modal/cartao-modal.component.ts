import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, PrintService } from './../../../../services';
import { CartaoAposta } from './../../../../models';

@Component({
    selector: 'app-cartao-modal',
    templateUrl: './cartao-modal.component.html',
    styleUrls: ['./cartao-modal.component.css']
})
export class CartaoModalComponent implements OnInit {
    @Input() cartao: CartaoAposta = new CartaoAposta();
    appMobile;

    constructor(
        public activeModal: NgbActiveModal,
        private auth: AuthService,
        private printService: PrintService,
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
    }

    print() {
        this.printService.card(this.cartao);
    }

    shared() {
        alert('AINDA NÃO FOI FEITO!');
    }
}
