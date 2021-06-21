import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, HelperService, MessageService } from './../../../../services';
import { config } from '../../../config';
let newNavigator: any;
newNavigator = window.navigator;

@Component({
    selector: 'app-pre-aposta-modal',
    templateUrl: './pre-aposta-modal.component.html',
    styleUrls: ['./pre-aposta-modal.component.css']
})
export class PreApostaModalComponent implements OnInit {
    @Input() codigo;
    permitirCompartilhamento = false;
    appMobile;

    constructor(
        public activeModal: NgbActiveModal,
        private auth: AuthService,
        private helperService: HelperService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();

        if (this.appMobile) {
            this.permitirCompartilhamento = true;
        } else if (location.protocol == 'https:') {
            this.permitirCompartilhamento = true;
        }
    }

    compartilhar() {
        if (this.appMobile) {
            this.helperService.compartilharPreAposta(this.codigo);
        } else {
            if (newNavigator.share) {
                newNavigator.share({
                    title: config.BANCA_NOME,
                    text: `${config.BANCA_NOME} PRÉ APOSTA: ${this.codigo.id}`
                });
            } else {
                this.messageService.error('Compartilhamento não suportado pelo seu navegador');
            }
        }
    }
}
