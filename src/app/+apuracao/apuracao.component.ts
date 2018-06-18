import { Component, OnInit } from '@angular/core';

import { ApostaService, MessageService } from './../services';
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
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.apostaService.getApostas().subscribe(
            apostas => {
                this.apostas = apostas;
                console.log(apostas);
            },
            error => this.handleError(error)
        );
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
