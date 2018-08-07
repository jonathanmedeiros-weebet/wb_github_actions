import { Component, OnInit, OnDestroy } from '@angular/core';

import { MessageService, ApostaEsportivaService } from '../services';
import { ApostaEsportiva } from '../models';

@Component({
    selector: 'app-consultar-aposta',
    templateUrl: 'consultar-aposta.component.html',
    styleUrls: ['./consultar-aposta.component.css']
})
export class ConsultarApostaComponent implements OnInit, OnDestroy {
    codigo;
    aposta: ApostaEsportiva;

    constructor(
        private apostaEsportivaService: ApostaEsportivaService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    consultarAposta() {
        this.apostaEsportivaService.apostaPorCodigo(this.codigo)
            .subscribe(
                aposta => this.aposta = aposta,
                error => this.handleError(error)
            );
    }

    success(msg) {
        this.messageService.success(msg);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
