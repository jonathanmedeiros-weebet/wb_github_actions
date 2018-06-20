import { Component, OnInit } from '@angular/core';

import {
    TipoApostaService, MessageService,
    SorteioService, ApostaService,
    PrintService
} from '../services';
import { TipoAposta, Aposta, Item, Sorteio } from '../models';
import { config } from './../shared/config';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'app-seninha',
    templateUrl: 'seninha.component.html',
    styleUrls: ['seninha.component.css']
})
export class SeninhaComponent implements OnInit {
    private numbers = _.range(1, 61);
    private tiposAposta: TipoAposta[] = [];
    private sorteios: Sorteio[] = [];
    private tipoAposta: TipoAposta;
    private aposta = new Aposta();
    private item = new Item();
    private exibirPreBilhete = false;
    BANCA_NOME = config.BANCA_NOME;

    constructor(
        private apostaService: ApostaService,
        private tipoApostaService: TipoApostaService,
        private sorteioService: SorteioService,
        private messageService: MessageService,
        private printService: PrintService
    ) { }

    ngOnInit() {
        let queryParams = { tipo: "seninha" };

        this.tipoApostaService.getTiposAposta(queryParams).subscribe(
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
            this.item.numeros.sort((a, b) => a - b);
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
            this.item.numeros.sort((a, b) => a - b);
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

    create() {
        if (this.aposta.itens.length) {
            this.apostaService.create(this.aposta).subscribe(
                result => this.success(result),
                error => this.handleError(error)
            );
        } else {
            this.messageService.warning('Por favor, inclua um palpite.');
        }
    }

    success(data) {
        this.printService.bilhete(data.results);
        this.aposta = new Aposta();
        this.messageService.success("Aposta realizada!");
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    openCupom(){
        this.exibirPreBilhete = true;
    }

    closeCupom(){
        this.exibirPreBilhete = false;
    }
}
