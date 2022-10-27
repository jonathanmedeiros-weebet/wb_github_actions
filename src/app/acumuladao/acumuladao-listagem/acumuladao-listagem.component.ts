import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Acumuladao } from './../../models';
import { AcumuladaoService, MessageService } from './../../services';

import * as moment from 'moment';

@Component({
    selector: 'app-acumuladao-listagem',
    templateUrl: './acumuladao-listagem.component.html',
    styleUrls: ['./acumuladao-listagem.component.css']
})
export class AcumuladaoListagemComponent implements OnInit {
    acumuladoes: Acumuladao[];

    constructor(
        private router: Router,
        private acumuladaoService: AcumuladaoService,
        private messageService: MessageService,
    ) { }

    ngOnInit() {
        this.acumuladaoService.getAcumuladoes()
            .subscribe(
                acumuladoes => {
                    this.acumuladoes = acumuladoes;
                },
                error => this.handleError(error)
            );
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    gotTo(id) {
        this.router.navigate([`acumuladao/form/${id}`]);
    }

    verificarEncerramento(dataEncerramento) {
        return moment().isAfter(dataEncerramento);
    }
}
