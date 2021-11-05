import {Component, OnInit} from '@angular/core';
import {ParametrosLocaisService} from '../../../shared/services/parametros-locais.service';

@Component({
    selector: 'app-deposito-whatsapp',
    templateUrl: './deposito-whatsapp.component.html',
    styleUrls: ['./deposito-whatsapp.component.css']
})
export class DepositoWhatsappComponent implements OnInit {
    contatoSolicitacaoSaque;

    constructor(
        private paramsLocais: ParametrosLocaisService
    ) {
    }

    ngOnInit() {
        if (this.paramsLocais.getOpcoes().contato_solicitacao_saque) {
            this.contatoSolicitacaoSaque = this.paramsLocais.getOpcoes().contato_solicitacao_saque;
        }
    }

}
