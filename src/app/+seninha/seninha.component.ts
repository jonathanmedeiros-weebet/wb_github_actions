import { Component, OnInit } from '@angular/core';

import { TipoApostaService, MessageService, SorteioService, ApostaService } from '../services';
import { TipoAposta, Aposta, Item, Sorteio } from '../models';
import { config } from './../shared/config/config';

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
    BANCA_NOME = config.BANCA_NOME;

    constructor(
        private apostaService: ApostaService,
        private tipoApostaService: TipoApostaService,
        private sorteioService: SorteioService,
        private messageService: MessageService
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

    print() {
        let printContents, popupWin, html, styles;

        styles = `
        #comprovante {
            text-align: justify;
            text-transform: uppercase;
        }

        .margin-top-30 {
            margin-top: 30px;
        }

        .margin-top-15{
            margin-top: 15px;
        }

        .margin-bottom-30 {
            margin-bottom: 30px;
        }

        .margin-bottom-15 {
            margin-bottom: 15px;
        }

        .margin-bottom-10 {
            margin-bottom: 10px;
        }

        .margin-bottom-5 {
            margin-bottom: 5px;
        }

        hr {
            margin-top: 5px;
            margin-bottom: 5px;
            border: 1px dashed black;
        }

        @page {
            margin: 0;
        }

        @media print {
            html, body {
                width: 75mm;
                padding: 4mm;
            }
        }
        `;

        printContents = `
            <div id="comprovante">
                <hr>
                <div class="text-center">${this.BANCA_NOME}</div>
                <hr class="margin-bottom-5">
                <div class="margin-bottom-5 text-center">
                    COMPROVANTE
                </div>
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        ${moment().format('DD/MM/YYYY')}
                    </div>
                    <div style="float: right;">
                        ${moment().format('HH:mm')}
                    </div>
                </div>
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Cliente
                    </div>
                    <div style="float: right;">
                        ${this.aposta.apostador}
                    </div>
                </div>
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Telefone
                    </div>
                    <div style="float: right;">
                        ${this.aposta.telefone}
                    </div>
                 </div>
                `;

        this.aposta.itens.forEach((item, index, array) => {
            let content = `
                <div class="clearfix margin-bottom-5">
                <div style="float: left;">
                    Sorteio  ${item.sorteio_id}
                </div>
                </div>
                <div class="text-center">
                    ${item.numeros.toString()}
                </div>
                <div class="clearfix margin-bottom-5">
                <div style="float: left;">
                    Valor
                </div>
                <div style="float: right;">
                    R$ ${item.valor}
                </div>
                </div>
                <div class="clearfix">
                    <div style="float: left;">
                        Prêmio
                    </div>
                    <div style="float: right;">
                        R$ ${item.premio}
                    </div>
                </div>
            `;
            if (array.length > 1) {
                if (index == 0) {
                    printContents += `
                        <hr>
                        ${content}
                        <hr>
                    `;
                } else {
                    printContents += `
                        ${content}
                        <hr>
                    `;
                }
            } else {
                printContents += `
                    <hr>
                    ${content}
                    <hr>
                    `;
            }
        });

        printContents += `
            <div class="clearfix margin-top-15 margin-bottom-10">
                    <div style="float: left;">
                        Total
                    </div>
                    <div style="float: right;">
                        R$ ${this.aposta.valor}
                    </div>
                </div>
            </div>
        `;

        html = `
        <html>
          <head>
            <title>Print tab</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
            <style>
            ${styles}
            </style>
          </head>
          <body onload="window.print();window.close()">${printContents}</body>
        </html>`;

        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();
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
        // this.print();
        this.aposta = new Aposta();
        this.messageService.success(msg);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
