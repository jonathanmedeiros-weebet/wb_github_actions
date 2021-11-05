import {Component, OnInit} from '@angular/core';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';

@Component({
    selector: 'app-deposito',
    templateUrl: './deposito.component.html',
    styleUrls: ['./deposito.component.css']
})
export class DepositoComponent implements OnInit {
    contatoSolicitacaoSaque;

    constructor(
        private paramsLocais: ParametrosLocaisService
    ) {
    }

    ngOnInit() {
        if (this.paramsLocais.getOpcoes().contato_solicitacao_saque) {
            this.contatoSolicitacaoSaque = this.paramsLocais.getOpcoes().contato_solicitacao_saque.replace(/\D/g, '');
        }
    }

}
