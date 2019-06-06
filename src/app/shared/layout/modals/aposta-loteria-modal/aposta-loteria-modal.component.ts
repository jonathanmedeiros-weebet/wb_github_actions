import { ExibirBilheteLoteriaComponent } from './../../exibir-bilhete/loteria/exibir-bilhete-loteria.component';
import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './../../../../services';

@Component({
    selector: 'app-aposta-loteria-modal',
    templateUrl: './aposta-loteria-modal.component.html'
})
export class ApostaLoteriaModalComponent implements OnInit {
    @ViewChild(ExibirBilheteLoteriaComponent) bilheteLoteriaComponent: ExibirBilheteLoteriaComponent;
    @Input() aposta;
    @Input() showCancel = false;
    appMobile;
    isLoggedIn;

    constructor(
        public activeModal: NgbActiveModal,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.isLoggedIn = this.auth.isLoggedIn();
    }

    printTicket() {
        this.bilheteLoteriaComponent.print();
    }

    shareTicket() {
        this.bilheteLoteriaComponent.shared();
    }
}
