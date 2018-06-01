import { Component, OnInit } from '@angular/core';

import { TipoApostaService, MessageService, SorteioService, ApostaService } from '../services';
import { TipoAposta, Aposta, Item, Sorteio } from '../models';

import * as _ from 'lodash';
import * as clone from 'clone';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
    private numbers = _.range(1, 61);
    private tiposAposta: TipoAposta[] = [];
    private sorteios: Sorteio[] = [];
    private tipoAposta: TipoAposta;
    private aposta = new Aposta();
    private item = new Item();

    constructor(
        private apostaService: ApostaService,
        private tipoApostaService: TipoApostaService,
        private sorteioService: SorteioService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.tipoApostaService.getTiposAposta().subscribe(
            tiposAposta => this.tiposAposta = tiposAposta,
            error => this.messageService.error(error)
        );
        this.sorteioService.getSorteios().subscribe(
            sorteios => this.sorteios = sorteios,
            error => this.messageService.error(error)
        );
    }

    checkNumber(number) {
        let index = this.item.numeros.findIndex(n => number == n);
        if (index < 0) {
            this.item.numeros.push(number);
        } else {
            this.item.numeros.splice(index, 1);
        }
    }

    isChecked(number) {
        return this.item.numeros.find(n => number == n);
    }

    checkBetType(tipoAposta: TipoAposta) {
        let result = false;
        if (tipoAposta.qtdNumeros == this.item.numeros.length) {
            result = true;
            this.tipoAposta = tipoAposta;
        }
        return result;
    }

    generateGuess(length) {
        this.item.numeros = [];
        for (let index = 0; index < length; index++) {
            let number = this.generateRandomNumber();
            this.item.numeros.push(number);
        }
    }

    generateRandomNumber() {
        let number = _.random(1, 61);
        let find = this.item.numeros.find(n => n == number);

        if (!find) {
            return number;
        } else {
            return this.generateRandomNumber();
        }
    }

    resetGuess() {
        this.item = new Item();
    }

    includeGuess() {
        let tipoAPosta = this.tiposAposta.find(tipoAposta => tipoAposta.qtdNumeros == this.item.numeros.length);

        if (tipoAPosta) {
            // let item: Item = clone(this.item);
            this.item.premio = this.item.valor * this.tipoAposta.cotacao;

            this.aposta.valor += this.item.valor;
            this.aposta.premio += this.item.premio;
            this.aposta.itens.push(this.item);
            this.resetGuess();
        } else {
            this.messageService.warning('Quantidade de dezenas insuficiente.');
        }
    }

    save() {
        if (this.aposta.itens.length) {
            this.apostaService.create(this.aposta).subscribe(
                result => this.success(result.message),
                error => this.handleError(error)
            );
        } else {
            this.messageService.warning('Por favor, inclua um palpite.');
        }
    }

    success(msg) {
        this.aposta = new Aposta();
        this.messageService.success(msg);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
