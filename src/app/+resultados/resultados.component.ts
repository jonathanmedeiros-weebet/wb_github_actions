import { Component, OnInit } from '@angular/core';

import { SorteioService, MessageService } from './../services';
import { Sorteio } from './../models';

import * as moment from 'moment';

@Component({
    selector: 'app-resultados',
    templateUrl: 'resultados.component.html',
    styleUrls: ['resultados.component.css']
})
export class ResultadosComponent implements OnInit {
    sorteios: Sorteio[];

    constructor(
        private sorteioService: SorteioService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        // let queryParams = {
        //     "data-final": moment().format("YYYY-MM-DD"),
        //     "tipo": "seninha"
        // };
        // console.log(queryParams);
        this.sorteioService.getSorteios().subscribe(
            sorteios => this.sorteios = sorteios,
            error => this.handleError(error)
        );
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
