import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { BaseFormComponent } from '../shared/base-form/base-form.component';
import {
    TipoApostaService, MessageService,
    SorteioService, ApostaService,
    PrintService, HelperService
} from '../services';
import { TipoAposta, Aposta, Item, Sorteio } from '../models';
import { config } from './../shared/config';

import * as _ from 'lodash';

@Component({
    selector: 'app-seninha',
    templateUrl: 'seninha.component.html'
})
export class SeninhaComponent extends BaseFormComponent implements OnInit {
    numbers = _.range(1, 61);
    tiposAposta: TipoAposta[] = [];
    sorteios: Sorteio[] = [];
    tipoAposta: TipoAposta;
    aposta = new Aposta();
    displayPreTicker = false;
    BANCA_NOME = config.BANCA_NOME;
    appMobile;

    constructor(
        private apostaService: ApostaService,
        private tipoApostaService: TipoApostaService,
        private sorteioService: SorteioService,
        private messageService: MessageService,
        private printService: PrintService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        const queryParams = { tipo: 'seninha' };

        this.tipoApostaService.getTiposAposta(queryParams).subscribe(
            tiposAposta => this.tiposAposta = tiposAposta,
            error => this.messageService.error(error)
        );
        this.sorteioService.getSorteios(queryParams).subscribe(
            sorteios => this.sorteios = sorteios,
            error => this.messageService.error(error)
        );

        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            valor: ['', Validators.required],
            sorteio_id: ['', Validators.required],
            sorteio_nome: [''],
            numeros: this.fb.array([])
        });
    }

    /* Incluir palpite */
    submit() {
        const tipoAPosta = this.tiposAposta.find(tipoAposta => tipoAposta.qtdNumeros === this.numeros.length);

        if (tipoAPosta) {
            // let item: Item = clone(this.item);
            const item = this.form.value;
            item.premio = item.valor * this.tipoAposta.cotacao;

            this.aposta.valor += item.valor;
            this.aposta.premio += item.premio;
            this.aposta.itens.push(item);
            this.form.reset();
            this.setNumeros([]);
        } else {
            this.messageService.warning('Quantidade de dezenas insuficiente.');
        }
    }

    /* Remover palpite */
    removeGuess(index) {
        this.aposta.itens.splice(index, 1);
    }

    /* Finalizar aposta */
    create(action) {
        if (this.aposta.itens.length) {
            this.apostaService.create(this.aposta).subscribe(
                result => this.success(result, action),
                error => this.handleError(error)
            );
        } else {
            this.messageService.warning('Por favor, inclua um palpite.');
        }
    }

    success(data, action) {
        if (action === 'compartilhar') {
            HelperService.sharedLotteryTicket(data.results);
        } else {
            this.printService.lotteryTicket(data.results);
        }

        this.aposta = new Aposta();
        this.messageService.success('Aposta realizada!');
        this.closeCupom();
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    get numeros() {
        return this.form.get('numeros') as FormArray;
    }

    setNumeros(numeros: Number[]) {
        const numerosFCs = numeros.map(n => this.fb.control(n));
        const numerosFormArray = this.fb.array(numerosFCs);
        this.form.setControl('numeros', numerosFormArray);
    }

    setSorteioNome() {
        const sorteioId = this.form.value.sorteio_id;
        const sorteio = this.sorteios.find(s => s.id === sorteioId);
        if (sorteio) {
            if (sorteio) {
                this.form.patchValue({ sorteio_nome: sorteio.nome });
            }
        }
    }

    /* Selecionar número */
    checkNumber(number) {
        const numeros = this.numeros.value;
        const index = numeros.findIndex(n => number === n);

        if (index < 0) {
            numeros.push(number);
            numeros.sort((a, b) => a - b);
            this.setNumeros(numeros);
        } else {
            this.numeros.removeAt(index);
        }
    }


    /* Verificar se o número está selecionado */
    isChecked(number) {
        return this.numeros.value.find(n => number === n);
    }

    /* Verificar  a quantidade de números selecionados */
    checkBetType(tipoAposta: TipoAposta) {
        let result = false;
        if (tipoAposta.qtdNumeros === this.numeros.length) {
            result = true;
            this.tipoAposta = tipoAposta;
        }
        return result;
    }

    /* Geração dos números aleatórios */
    generateGuess(length) {
        const numbers = [];

        for (let index = 0; index < length; index++) {
            const number = this.generateRandomNumber(numbers);
            numbers.push(number);
        }

        numbers.sort((a, b) => a - b);
        this.setNumeros(numbers);
    }

    /* Gerar número randômico */
    generateRandomNumber(numbers: Number[]) {
        const number = _.random(1, 60);

        const find = numbers.find(n => n === number);

        if (!find) {
            return number;
        } else {
            return this.generateRandomNumber(numbers);
        }
    }

    controlInvalid(control) {
        return control.invalid && (control.dirty || control.touched);
    }

    openCupom() {
        this.displayPreTicker = true;
    }

    closeCupom() {
        this.displayPreTicker = false;
    }
}
