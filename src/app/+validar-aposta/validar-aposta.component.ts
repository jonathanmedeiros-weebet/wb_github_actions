import { Component, OnInit, OnDestroy } from '@angular/core';

import { MessageService, ApostaEsportivaService } from '../services';
import { ApostaEsportiva } from '../models';

@Component({
    selector: 'app-validar-aposta',
    templateUrl: 'validar-aposta.component.html',
    styleUrls: ['./validar-aposta.component.css']
})
export class ValidarApostaComponent implements OnInit, OnDestroy {
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

    validarAposta() {
        this.messageService.success('aposta validada com sucesso!');
    }

    success(msg) {
        this.messageService.success(msg);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
