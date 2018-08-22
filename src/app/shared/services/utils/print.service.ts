import { Injectable } from '@angular/core';

import { AuthService } from './../auth/auth.service';
import { HelperService } from './helper.service';

import { config } from './../../config';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class PrintService {
    constructor(
        private auth: AuthService
    ) { }

    lotteryTicket(aposta) {
        if (this.auth.isAppMobile()) {
            this.lotteryTicketAppMobile(aposta);
        } else {
            this.lotteryTicketDestkop(aposta);
        }
    }

    lotteryTicketDestkop(aposta) {
        let printContents, popupWin, html, styles;

        styles = `
        #comprovante {
            text-align: justify;
            text-transform: uppercase;
        }

        .bilhete-numeros{
            word-break: break-all;
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
                <div class="text-center">${config.BANCA_NOME}</div>
                <hr class="margin-bottom-5">
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
                        ${aposta.apostador}
                    </div>
                </div>
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Telefone
                    </div>
                    <div style="float: right;">
                        ${aposta.telefone}
                    </div>
                 </div>
                `;

        aposta.itens.forEach((item, index, array) => {
            const content = `
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        ${item.sorteio_nome}
                    </div>
                </div>
                <div class="text-center bilhete-numeros">
                    ${item.numeros.join('-')}
                </div>
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Tipo
                    </div>
                    <div style="float: right;">
                        ${item.tipo}
                    </div>
                </div>
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Valor
                    </div>
                    <div style="float: right;">
                        ${HelperService.moneyFormat(item.valor)}
                    </div>
                </div>
                <div class="clearfix">
                    <div style="float: left;">
                        Prêmio
                    </div>
                    <div style="float: right;">
                        ${HelperService.moneyFormat(item.cotacao * item.valor)}
                    </div>
                </div>
            `;
            if (array.length > 1) {
                if (index === 0) {
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
                        ${HelperService.moneyFormat(aposta.valor)}
                    </div>
                </div>
            </div>
        `;

        html = `
        <html>
          <head>
            <title>Print tab</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
            integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
            integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
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

    lotteryTicketAppMobile(aposta) {
        let ticket = `${config.BANCA_NOME}

#${aposta.id}
Data: ${moment(aposta.horario).format('DD/MM/YYYY HH:mm')}
Cambista: ${aposta.passador.nome}
Apostador: ${aposta.apostador}
Valor Total: ${HelperService.moneyFormat(aposta.valor)}
`;

        for (const i in aposta.itens) {
            if (aposta.itens.hasOwnProperty(i)) {
                const item = aposta.itens[i];
                ticket += `----------------------------
                ${item.sorteio_nome}
                Dezenas: ${item.numeros.join('-')}
Valor: ${HelperService.moneyFormat(item.valor)}
Premio: ${HelperService.moneyFormat(item.valor * item.cotacao)}
`;
            }
        }


        parent.postMessage({ data: ticket, action: 'printLottery' }, 'file://'); // file://
    }

    sportsTicket(aposta) {
        if (this.auth.isAppMobile()) {
            this.sportsTicketAppMobile(aposta);
        } else {
            this.sportsTicketDestkop(aposta);
        }
    }

    sportsTicketDestkop(aposta) {
        let printContents, popupWin, html, styles;

        styles = `
        body{
            font-family: "Lucida Console", Monaco, monospace;
            font-size: 15px;
            background: #333;
            margin: 0;
        }

        #comprovante{
            width: 19.27em;
            padding: 1em;
            background: #fff;
            margin: 2em auto;
        }

        .margin-top-30 {
            margin-top: 30px;
        }

        .margin-top-15{
            margin-top: 15px;
        }

        .margin-top-10 {
            margin-top: 10px;
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

        .numero{
            text-align: center;
            font-weight: bold;
            margin-bottom: 5px;
            margin-top:15px;
        }

        .informacoes p{
            margin: 1px;
            font-size: 12px;
        }

        .item .campeonato{
            text-align: center;
            margin: 1px;
            font-weight: bold;
            font-size: 12px;
        }

        .item .horario{
            margin: 1px;
            font-size: 12px;
            text-transform: uppercase;
        }

        .item .jogo{
            margin: 1px;
            font-weight: bold;
            font-size: 14px;
        }

        .item .cotacao{
            margin: 1px;
            font-size: 12px;
        }

        .valores .aposta{
            text-align: center;
            margin: 1px;
            font-weight: bold;
            font-size: 12px;
        }

        .valores .ganho{
            text-align: center;
            margin: 5px 1px 1px 1px;
            font-weight: bold;
            font-size: 14px;
        }

        .valores .cambista-paga{
           text-align: center;
           margin: 5px 1px 1px 1px;
           font-weight: bold;
           font-size: 14px;
        }

        .rodape{
            margin: 15px 1px 1px 1px;
            font-weight: bold;
            font-size: 14px;
            text-align: center;
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
            <div class="conteudo">
                <div style="text-align: center;">
                    <img style="max-height: 180px; max-width: 290px;"
                    alt="${config.BANCA_NOME}" src="${config.LOGO}" />
                </div>
                <h1 class="numero">
                    #${aposta.id}
                </h1>
                `;

        aposta.itens.forEach((item, index, array) => {
            printContents += `
                <div class="item margin-top-10">
                    <p class="campeonato">
                        ${item.campeonato.nome}
                    </p>
                    <p class="horario">
                        ${moment(item.jogo.horario).format('dddd, DD MMMM YYYY, HH:mm')}
                    </p>
                    <p class="jogo">
                        ${item.jogo.nome}
                    </p>
                    <p class="cotacao">
                        ${item.aposta_tipo.nome} ( ${item.cotacao} )
                    </p>
                </div>
            `;
        });

        printContents += `
                <hr>
                <div class="informacoes">
                    <p>
                        CAMBISTA: ${aposta.cambista.nome}
                    </p>
                    <p>
                        APOSTADOR: ${aposta.apostador}
                    </p>
                    <p>
                        HORÁRIO: ${aposta.horario}
                    </p>
                </div>
                <hr>
                <br>
                <div class="valores">
                    <p class="aposta">
                        VALOR DA APOSTA: ${HelperService.moneyFormat(aposta.valor)}
                    </p>
                    <p class="ganho">
                        ESTIMATIVA DE GANHO: ${HelperService.moneyFormat(aposta.premio)}
                    </p>
                </div>
                <p class="rodape">
                    Jogue consciente, leia as regras no site! Seu possível premio está impresso no bilhete
                </p>
            </div>
        </div>`;

        html = `
        <html>
          <head>
            <title>Print tab</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
            integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
            integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
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

    sportsTicketAppMobile(aposta) { }
}
