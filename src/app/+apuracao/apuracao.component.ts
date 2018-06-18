import { Component, OnInit } from '@angular/core';

import { ApostaService, MessageService, PrintService } from './../services';
import { Aposta } from './../models';

@Component({
    selector: 'app-apuracao',
    templateUrl: 'apuracao.component.html',
    styleUrls: ['apuracao.component.css']
})
export class ApuracaoComponent implements OnInit {
    apostas: Aposta[];

    constructor(
        private apostaService: ApostaService,
        private messageService: MessageService,
        private printService: PrintService
    ) { }

    ngOnInit() {
        this.apostaService.getApostas().subscribe(
            apostas => this.apostas = apostas,
            error => this.handleError(error)
        );
    }

    imprimirBilhete(aposta) {
        this.printService.bilhete(aposta);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
