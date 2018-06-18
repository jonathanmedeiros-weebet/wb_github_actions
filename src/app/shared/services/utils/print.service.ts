import { Injectable } from '@angular/core';

import { config } from './../../config';
import * as moment from 'moment';

@Injectable()
export class PrintService {
    constructor() { }

    bilhete(aposta) {
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
            let content = `
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        ${item.sorteio_nome}
                    </div>
                </div>
                <div class="text-center bilhete-numeros">
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
                        R$ ${item.cotacao * item.valor}
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
                        R$ ${aposta.valor}
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
}
