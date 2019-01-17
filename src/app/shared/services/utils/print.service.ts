import { Injectable } from '@angular/core';

import { AuthService } from './../auth/auth.service';
import { ParametroService } from '../parametros.service';
import { HelperService } from './helper.service';

import { config } from './../../config';
import * as moment from 'moment';
import * as clone from 'clone';

@Injectable({
    providedIn: 'root'
})
export class PrintService {
    private opcoes = JSON.parse(localStorage.getItem('opcoes'));

    constructor(
        private auth: AuthService,
        private parametroService: ParametroService
    ) { }

    // Tabela Esportiva
    games(dias) {
        if (this.auth.isAppMobile()) {
            this.gamesAppMobile(dias);
        } else {
            this.gamesDestkop(dias);
        }
    }

    gamesDestkop(dias) {
        let printContents, popupWin, html, styles;

        styles = `
        body{
            font-family: "Lucida Console", Monaco, monospace;
            font-size: 15px;
            background: #333;
            margin: 0;
        }
        .dia-header{
            font-weight:bolder;
            padding: 10px 10px;
            text-align: center;
            background: #ffffff;
            color: #d99595;
        }
        .campeonato-header{
            padding: 0 12px !important;
            font-size: .9em !important;
            height: 14px;
            margin: 5px 0;
        }
        .jogo{
            padding: 0 10px !important;
        }
        .jogo .jogo-nome{
            font-size: 1.1em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background: #eee !important;
            color: #000 !important;
            height: 14px;
            margin-bottom: 0 !important;
            line-height: 16px !important;
        }
        .jogo .jogo-nome span{
            padding: 0 10px !important;
            font-size: .9em;
        }
        .cotacoes-principais{
            display:flex;
            flex-wrap:wrap;
        }
        .cotacoes-principais .cotacao{
            width: 33.33%;
            padding-right: 15px;
            padding-left: 15px
            margin-bottom: 3px;
        }
        @page {
            margin: 0;
        }
        @media print {
            html, body {
                padding: 4mm;
            }
        }
        `;

        printContents = `
        <div id="impressao-tabela">
            <div class="conteudo">
                <div style="text-align: center;">
                    <img style="max-height: 150px; "
                    alt="${config.BANCA_NOME}" src="${config.LOGO}" />
                </div>
                `;

        dias.forEach(dia => {
            printContents += `
                    <div class="dia-header">
                        ${dia.data_grupo}
                    </div>
                `;

            dia.camps.forEach(campeonato => {
                printContents += `
                    <div class="campeonato-header">
                        ${campeonato.nome}
                    </div>`;

                campeonato.jogos.forEach(jogo => {
                    printContents += `
                    <div class="jogo">
                        <div class="jogo-nome">
                            <span style="padding: 10px;">
                                ${HelperService.dateFormat(jogo.horario, 'HH:mm')}
                            </span>
                            <span style="font-weight: bold;">${jogo.nome}</span>
                        </div>
                    </div>`;

                    printContents += `<div class="cotacoes-principais">`;

                    jogo.cotacoes.forEach(cotacao => {
                        printContents += `
                        <div class="cotacao">
                            <span class="aposta-tipo-sigla">${this.getSigla(cotacao.chave)}</span>
                            <span class="valor pull-right"><b>${cotacao.valor}</b></span>
                        </div>`;
                    });

                    printContents += `</div>`;
                });
            });
        });

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

    gamesAppMobile(dias) {
        const cols = 5;
        const odds = this.parametroService.getOddsImpressao();
        const linhas = Math.ceil(odds.length / cols);

        let text = `${config.BANCA_NOME}

        Tabela de Jogos`;

        dias.forEach(dia => {
            text += `

==== ${dia.data_grupo} ====`;

            dia.camps.forEach(camp => {
                text += `

${camp.nome}
`;


                camp.jogos.forEach(jogo => {
                    // "2018-11-23T18:00:00.000Z"
                    const horario = moment(jogo.horario).format('HH:mm');
                    text += `
${horario} ${jogo.nome}
`;
                    for (let i = 0; i < linhas; i++) {
                        let start = i * cols;

                        const oddPos1 = odds[start];
                        const oddPos2 = odds[++start];
                        const oddPos3 = odds[++start];
                        const oddPos4 = odds[++start];
                        const oddPos5 = odds[++start];

                        text += `${this.getSigla(oddPos1)} ${this.getSigla(oddPos2)} ${this.getSigla(oddPos3)} ${this.getSigla(oddPos4)} ${this.getSigla(oddPos5)}
`;
                        text += `${this.getValor(oddPos1, jogo.cotacoes)} ${this.getValor(oddPos2, jogo.cotacoes)} ${this.getValor(oddPos3, jogo.cotacoes)} ${this.getValor(oddPos4, jogo.cotacoes)} ${this.getValor(oddPos5, jogo.cotacoes)}
`;
                    }
                });
            });

        });

        parent.postMessage({ data: text, action: 'printLottery' }, 'file://'); // file://
    }

    getValor(chave, cotacoes) {
        const cotacao = cotacoes.find(c => c.chave == chave);
        if (cotacao) {
            let result = cotacao.valor.toFixed(2);
            if (cotacao.valor < 10) {
                result = `${result} `;
            }
            return result;
        }
        return '     ';
    }

    getSigla(chave) {
        if (chave) {
            const tiposAposta = JSON.parse(localStorage.getItem('tipos_aposta'));
            const sigla = `${tiposAposta[chave].sigla}     `;
            return sigla.substr(0, 5);
        }
        return '    ';
    }

    // Bilhete Loteria
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
                <div class="clearfix text-center margin-bottom-5">
                    #${aposta.id}
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
                `;

        aposta.itens.forEach((item, index, array) => {
            let content = `
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
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Retorno 3
                    </div>
                    <div style="float: right;">
                        ${HelperService.calcularPremioLoteria(item.valor, item.cotacao3)}
                    </div>
                </div>
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Retorno 4
                    </div>
                    <div style="float: right;">
                        ${HelperService.calcularPremioLoteria(item.valor, item.cotacao4)}
                    </div>
                </div>
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Retorno 5
                    </div>
                    <div style="float: right;">
                        ${HelperService.calcularPremioLoteria(item.valor, item.cotacao5)}
                    </div>
                </div>
            `;

            if (item.tipo === 'seninha') {
                content += `
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Retorno 6
                    </div>
                    <div style="float: right;">
                        ${HelperService.calcularPremioLoteria(item.valor, item.cotacao6)}
                    </div>
                </div>
                `;
            }


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
Data: ${HelperService.dateFormat(aposta.horario, 'DD/MM/YYYY HH:mm')}
Cambista: ${aposta.passador.nome}
Apostador: ${aposta.apostador}
Valor Total: ${HelperService.moneyFormat(aposta.valor)}`;

        aposta.itens.forEach(item => {
            ticket += `
-------------------------------
${item.sorteio_nome} (${item.tipo})
Dezenas: ${item.numeros.join('-')}
Valor: ${HelperService.moneyFormat(item.valor)}
Retorno 3: ${HelperService.calcularPremioLoteria(item.valor, item.cotacao3)}
Retorno 4: ${HelperService.calcularPremioLoteria(item.valor, item.cotacao4)}
Retorno 5: ${HelperService.calcularPremioLoteria(item.valor, item.cotacao5)}
`;

            if (item.tipo === 'seninha') {
                ticket += `Retorno 6: ${HelperService.calcularPremioLoteria(item.valor, item.cotacao6)}`;
            }
        });
        // console.log(ticket);
        parent.postMessage({ data: ticket, action: 'printLottery' }, 'file://'); // file://
    }

    // Bilhete Esportivo
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

        .valores .total-jogos, .valores .aposta{
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
            margin: 10px 1px 1px 1px;
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
                    <img style="max-height: 80px; max-width: 190;"
                    alt="${config.BANCA_NOME}" src="${config.LOGO}" />
                </div>
                <h1 class="numero">
                    #${aposta.id}
                </h1>
                `;

        aposta.itens.forEach((item, index, array) => {
            printContents += `
                <div class="item">
                    <p class="campeonato">
                        ${item.campeonato.nome}
                    </p>
                    <p class="horario">
                        ${HelperService.dateFormat(item.jogo.horario, 'dddd, DD MMMM YYYY [ÀS] HH:mm')}
                    </p>
                    <p class="jogo">
                        ${item.jogo.nome}
                    </p>
                    <p class="cotacao">
                        ${item.aposta_tipo.nome} ( ${item.cotacao.toFixed(2)} )`;
            if (item.ao_vivo) {
                printContents += ` | AO VIVO`;
            }
            printContents += `
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
                        HORÁRIO: ${HelperService.dateFormat(aposta.horario, 'DD/MM/YYYY HH:mm')}
                    </p>
                </div>
                <hr>
                <div class="valores">
                    <p class="total-jogos">
                        TOTAL DE JOGOS: ${aposta.itens.length}
                    </p>
                    <p class="aposta">
                        VALOR DA APOSTA: ${HelperService.moneyFormat(aposta.valor)}
                    </p>
                    <p class="ganho">
                        ESTIMATIVA DE GANHO: ${HelperService.moneyFormat(aposta.premio)}
                    </p>`;

        if (this.opcoes.percentual_premio_cambista > 0) {
            const cambistaPaga = aposta.premio * ((100 - this.opcoes.percentual_premio_cambista) / 100);
            printContents += `   <p class="cambista-paga">
                            CAMBISTA PAGA: ${HelperService.moneyFormat(cambistaPaga)}
                        </p>`;
        }

        printContents += `
                    </div>
                <p class="rodape">
                    ${this.opcoes.informativo_rodape}
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

    sportsTicketAppMobile(aposta) {
        let ticket = `${config.BANCA_NOME}
#${aposta.id}
Data: ${HelperService.dateFormat(aposta.horario, 'DD/MM/YYYY HH:mm')}
Cambista: ${aposta.cambista.nome}
Apostador: ${aposta.apostador}
Valor Aposta: ${HelperService.moneyFormat(aposta.valor)}
Estimativa Ganho: ${HelperService.moneyFormat(aposta.premio)}
Total Jogos: ${aposta.itens.length}`;

        aposta.itens.forEach(item => {
            ticket += `
-------------------------------
${item.campeonato.nome}
${HelperService.dateFormat(item.jogo.horario, 'dddd, DD MMMM YYYY, HH:mm')}
${item.jogo.nome}
${item.aposta_tipo.nome} ( ${item.cotacao.toFixed(2)} )`;
            if (item.ao_vivo) {
                ticket += ` | AO VIVO`;
            }
        });

        ticket += `
-------------------------------

${this.opcoes.informativo_rodape}
        `;

        parent.postMessage({ data: ticket, action: 'printLottery' }, 'file://'); // file://
    }

    listPrinters() {
        const message = {
            data: '',
            action: 'listPrinters',
        };

        parent.postMessage(message, 'file://'); // file://
        console.log('listPrinters');
    }
}
