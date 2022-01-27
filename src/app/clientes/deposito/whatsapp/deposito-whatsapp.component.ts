import {Component, OnInit} from '@angular/core';
import {ParametrosLocaisService} from '../../../shared/services/parametros-locais.service';

@Component({
    selector: 'app-deposito-whatsapp',
    templateUrl: './deposito-whatsapp.component.html',
    styleUrls: ['./deposito-whatsapp.component.css']
})
export class DepositoWhatsappComponent implements OnInit {
    whatsapp;

    constructor(
        private paramsLocais: ParametrosLocaisService
    ) {
    }

    ngOnInit() {
        if (this.paramsLocais.getOpcoes().whatsapp) {
            this.whatsapp = this.paramsLocais.getOpcoes().whatsapp;
        }
    }

}
