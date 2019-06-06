import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, HelperService } from './../../../../services';

@Component({
    selector: 'app-pre-aposta-modal',
    templateUrl: './pre-aposta-modal.component.html',
    styleUrls: ['./pre-aposta-modal.component.css']
})
export class PreApostaModalComponent implements OnInit {
    @Input() codigo;
    appMobile;

    constructor(
        public activeModal: NgbActiveModal,
        private auth: AuthService,
        private helperService: HelperService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
    }

    compartilhar() {
        this.helperService.compartilharPreAposta(this.codigo);
    }
}
