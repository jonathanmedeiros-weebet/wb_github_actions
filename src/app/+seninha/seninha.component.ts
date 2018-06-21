import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

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
    numbers = _.range(1, 61);
    tiposAposta: TipoAposta[] = [];
    sorteios: Sorteio[] = [];
    tipoAposta: TipoAposta;
    aposta = new Aposta();
    itemForm: FormGroup;
    exibirPreBilhete = false;
    BANCA_NOME = config.BANCA_NOME;

    constructor(
        private apostaService: ApostaService,
        private tipoApostaService: TipoApostaService,
        private sorteioService: SorteioService,
        private messageService: MessageService,
        private printService: PrintService,
        private fb: FormBuilder
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

        this.createForms();
    }

    createForms() {
        this.itemForm = this.fb.group({
            valor: ['', Validators.required],
            sorteio_id: ['', Validators.required],
            numeros: this.fb.array([])
        });
    }

    get numeros() {
        return this.itemForm.get('numeros') as FormArray;
    }

    setNumeros(numeros: Number[]) {
        const numerosFCs = numeros.map(numeros => this.fb.control(numeros));
        const numerosFormArray = this.fb.array(numerosFCs);
        this.itemForm.setControl('numeros', numerosFormArray);
    }

    checkNumber(number) {
        let numeros = this.numeros.value;
        let index = numeros.findIndex(n => number == n);

        if (index < 0) {
            numeros.push(number);
            numeros.sort((a, b) => a - b);
            this.setNumeros(numeros);
        } else {
            this.numeros.removeAt(index);
        }
    }

    isChecked(number) {
        return this.numeros.value.find(n => number == n);
    }

    checkBetType(tipoAposta: TipoAposta) {
        let result = false;
        if (tipoAposta.qtdNumeros == this.numeros.length) {
            result = true;
            this.tipoAposta = tipoAposta;
        }
        return result;
    }

    generateGuess(length) {
        let numbers = [];
        for (let index = 0; index < length; index++) {
            let number = this.generateRandomNumber();
            numbers.push(number);
            numbers.sort((a, b) => a - b);
        }

        this.setNumeros(numbers);
    }

    generateRandomNumber() {
        let number = _.random(1, 61);
        let find = this.numeros.value.find(n => n == number);

        if (!find) {
            return number;
        } else {
            return this.generateRandomNumber();
        }
    }

    includeGuess() {
        let tipoAPosta = this.tiposAposta.find(tipoAposta => tipoAposta.qtdNumeros == this.numeros.length);

        if (tipoAPosta) {
            if (this.itemForm.valid) {
                // let item: Item = clone(this.item);
                let item = this.itemForm.value;
                item.premio = item.valor * this.tipoAposta.cotacao;

                this.aposta.valor += item.valor;
                this.aposta.premio += item.premio;
                this.aposta.itens.push(item);
                this.itemForm.reset();
            } else {
                alert('invalido');
            }
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

        //if(true){//no app

        let aposta = data.results;

        let bilhete = `{br}Weebet

#${aposta.id}
Data: ${moment(aposta.horario).format('DD/MM/YYYY HH:mm')}
Cambista: ${aposta.passador.nome}
Apostador: ${aposta.apostador}
Valor Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(aposta.valor)}
`;

        for(let i in aposta.itens){
            let item = aposta.itens[i];
            bilhete += `----------------------------
${item.sorteio_nome}
Dezenas: ${item.numeros.join(' - ')}
Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
Premio: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor * item.cotacao)}
`;
        }

        bilhete += `{br}`;

            parent.postMessage(bilhete, 'file://'); //file://
        //}
        /*else {
            this.printService.bilhete(data.results);
            this.aposta = new Aposta();
            this.messageService.success("Aposta realizada!");
        }*/
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
