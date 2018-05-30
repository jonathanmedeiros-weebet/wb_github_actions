import { Component, OnInit } from '@angular/core';

import { TipoApostaService, MessageService } from '../services';
import { TipoAposta } from '../models';

import * as _ from 'lodash';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
    private numbers = _.range(1, 61);
    private checkeds: number[] = [];
    private tiposAposta: TipoAposta[] = [];

    constructor(
        private tipoApostaService: TipoApostaService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.tipoApostaService.getTiposAposta().subscribe(
            tiposAposta => this.tiposAposta = tiposAposta,
            error => this.messageService.error(error)
        );
    }

    checkNumber(number) {
        let index = this.checkeds.findIndex(n => number == n);
        if (index < 0) {
            this.checkeds.push(number);
        } else {
            this.checkeds.splice(index, 1);
        }
    }

    isChecked(number) {
        return this.checkeds.find(n => number == n);
    }

    checkBetType(tipoAposta) {
        return tipoAposta.qtdNumeros == this.checkeds.length;
    }
}
