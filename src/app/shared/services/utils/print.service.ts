import { Injectable } from '@angular/core';

import { AuthService } from './../auth/auth.service';
import { HelperService } from './helper.service';
import { ParametrosLocaisService } from './../parametros-locais.service';

import { config } from './../../config';
import * as moment from 'moment';

import EscPosEncoder from 'esc-pos-encoder';
import {ImagensService} from './imagens.service';

@Injectable({
    providedIn: 'root'
})
export class PrintService {
    private opcoes = this.paramsService.getOpcoes();
    private separatorLine = '================================';

    constructor(
        private auth: AuthService,
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService
    ) { }

    // Tabela Esportiva
    games(dias) {
        if (this.auth.isAppMobile()) {
            this.gamesAppMobile(dias);
        } else {
            this.gamesDestkop(dias);
        }
    }

    private gamesDestkop(dias) {
        let printContents, popupWin, html, styles;

        styles = `
        body{
            font-family: "Lucida Console", Monaco, monospace;
            font-size: 15px;
            background: #fff;
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
            font-size: 11px !important;
        }
        .jogo{
        }
        .jogo .jogo-nome{
            font-size: 11px;
            overflow: hidden;
            text-overflow: ellipsis;
            background: #eee !important;
            color: #000 !important;
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
            font-size: 10px;
            margin: 0 -15px;
        }
        .cotacoes-principais .cotacao{
            width: 33.33%;
            padding-right: 15px;
            padding-left: 15px
        }
        @page {
            margin: 0;
        }
        @media print {
            html, body {
                width: 100%;
                max-width: 78mm;
                padding: 0mm;
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
                                ${this.helperService.dateFormat(jogo.horario, 'HH:mm')}
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
          <body onload="window.print();">${printContents}</body>
        </html>`;

        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();
    }

    private gamesAppMobile(dias) {
        const cols = 5;
        const odds = this.paramsService.getOddsImpressao();
        const linhas = Math.ceil(odds.length / cols);

        const encoder = new EscPosEncoder();
        const jogosEscPos = encoder
            .initialize()
            .bold(true)
            .align('center')
            .raw([0x1B, 0x21, 0x10]) // Large Font Size
            .line(config.BANCA_NOME)
            .raw([0x1B, 0x21, 0x03])
            .size('normal')
            .text('Tabela de Jogos')
            .newline()
            .line(this.separatorLine)
            .size('small');

        dias.forEach(dia => {
            jogosEscPos
                .align('center')
                .bold(true)
                .text(dia.data_grupo);

            dia.camps.forEach(camp => {
                jogosEscPos
                    .newline()
                    .bold(true)
                    .text(this.helperService.removerAcentos(camp.nome));

                camp.jogos.forEach(jogo => {
                    const horario = moment(jogo.horario).format('HH:mm');
                    jogosEscPos
                        .newline()
                        .bold(false)
                        .text(horario + ' ' + this.helperService.removerAcentos(jogo.nome));

                    for (let i = 0; i < linhas; i++) {
                        let start = i * cols;

                        const oddPos1 = odds[start];
                        const oddPos2 = odds[++start];
                        const oddPos3 = odds[++start];
                        const oddPos4 = odds[++start];
                        const oddPos5 = odds[++start];

                        jogosEscPos
                            .newline()
                            .bold(true)
                            .text(this.helperService.removerAcentos(`${this.getSigla(oddPos1)} ${this.getSigla(oddPos2)} ${this.getSigla(oddPos3)} ${this.getSigla(oddPos4)} ${this.getSigla(oddPos5)}`))
                            .newline()
                            .bold(false)
                            .text(`${this.getValor(oddPos1, jogo.cotacoes)} ${this.getValor(oddPos2, jogo.cotacoes)} ${this.getValor(oddPos3, jogo.cotacoes)} ${this.getValor(oddPos4, jogo.cotacoes)} ${this.getValor(oddPos5, jogo.cotacoes)}`)
                            .newline();
                    }
                });
            });
        });
        jogosEscPos
            .newline()
            .newline()
            .newline()
            .newline();

        parent.postMessage({ data: jogosEscPos.encode(), action: 'printLottery' }, '*');
    }

    // Bilhete Loteria
    lotteryTicket(aposta) {
        if (this.auth.isAppMobile()) {
            this.lotteryTicketAppMobile(aposta);
        } else {
            this.lotteryTicketDestkop(aposta);
        }
    }

    private lotteryTicketDestkop(aposta) {
        let printContents, popupWin, html, styles;

        styles = `

        #comprovante {
            text-align: justify;
            text-transform: uppercase;
            padding: 15px;
            /*padding-right: 11px;*/
            background: #fff;
            margin: 0 auto;
            color: #000;
        }

        .bilhete-numeros{
            word-break: break-all;
        }

        .margin-top-15{
            margin-top: 15px;
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
                width: 100%;
                max-width: 78mm;
                padding: 0mm;
            }
        }
        `;

        printContents = `
            <div id="comprovante">
                <hr>
                <div class="text-center">${config.BANCA_NOME}</div>
                <hr class="margin-bottom-5">
                <div class="clearfix text-center margin-bottom-5">
                    ${aposta.codigo}
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
                        Cambista
                    </div>
                    <div style="float: right;">
                        ${aposta.passador.nome}
                    </div>
                </div>
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Apostador
                    </div>
                    <div style="float: right;">
                        ${aposta.apostador}
                    </div>
                </div>
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Modalidade
                    </div>
                    <div style="float: right;">
                        ${this.getNomeModalidadeLoteria(aposta.modalidade)}
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
                        Valor
                    </div>
                    <div style="float: right;">
                        ${this.helperService.moneyFormat(item.valor)}
                    </div>
                </div>`;



            if (item.tipo === 'seninha' && item.cotacao6 > 0) {
                content += `
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Retorno 6
                    </div>
                    <div style="float: right;">
                        ${this.helperService.calcularPremioLoteria(item.valor, item.cotacao6)}
                    </div>
                </div>
                `;
            }

            if (item.cotacao5 > 0) {
                content += `
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Retorno 5
                    </div>
                    <div style="float: right;">
                        ${this.helperService.calcularPremioLoteria(item.valor, item.cotacao5)}
                    </div>
                </div>`;
            }

            if (item.cotacao4 > 0) {
                content += `
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Retorno 4
                    </div>
                    <div style="float: right;">
                        ${this.helperService.calcularPremioLoteria(item.valor, item.cotacao4)}
                    </div>
                </div>`;
            }
            if (item.cotacao3 > 0) {
                content += `
                <div class="clearfix margin-bottom-5">
                    <div style="float: left;">
                        Retorno 3
                    </div>
                    <div style="float: right;">
                        ${this.helperService.calcularPremioLoteria(item.valor, item.cotacao3)}
                    </div>
                </div>`;
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
                        ${this.helperService.moneyFormat(aposta.valor)}
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
          <body onload="window.print();">${printContents}</body>
        </html>`;

        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();
    }

    private lotteryTicketAppMobile(aposta) {
        const encoder = new EscPosEncoder();

        const ticketEscPos = encoder
            .initialize()
            .bold(true)
            .align('center')
            .raw([0x1B, 0x21, 0x10]) // Large Font Size
            .line(config.BANCA_NOME)
            .line(aposta.codigo)
            .raw([0x1B, 0x21, 0x03])
            .align('left')
            .size('normal')
            .line(this.separatorLine)
            .bold(true)
            .text('Data: ')
            .bold(false)
            .text(this.helperService.dateFormat(aposta.horario, 'DD/MM/YYYY HH:mm'))
            .newline()
            .bold(true)
            .text('CAMBISTA: ')
            .bold(false)
            .text(this.helperService.removerAcentos(aposta.passador.nome))
            .newline()
            .bold(true)
            .text('APOSTADOR: ')
            .bold(false)
            .text(this.helperService.removerAcentos(aposta.apostador))
            .newline()
            .bold(true)
            .text('MODALIDADE: ')
            .bold(false)
            .text(this.getNomeModalidadeLoteria(aposta.modalidade))
            .newline()
            .bold(true)
            .text('VALOR TOTAL: ')
            .bold(false)
            .text(this.helperService.moneyFormat(aposta.valor))
            .newline();

        aposta.itens.forEach(item => {
            ticketEscPos
                .newline()
                .line(this.separatorLine)
                .align('center')
                .bold(true)
                .line(this.helperService.removerAcentos(item.sorteio_nome))
                .align('left')
                .line('DEZENAS: ')
                .bold(false)
                .line(item.numeros.join('-'))
                .bold(true)
                .newline()
                .text('VALOR: ')
                .bold(false)
                .text(this.helperService.moneyFormat(item.valor));

            if (item.tipo === 'seninha' && item.cotacao6 > 0) {
                ticketEscPos
                    .newline()
                    .bold(true)
                    .text('RETORNO 6: ')
                    .bold(false)
                    .text(this.helperService.calcularPremioLoteria(item.valor, item.cotacao6));
            }
            if (item.cotacao5 > 0) {
                ticketEscPos
                    .newline()
                    .bold(true)
                    .text('RETORNO 5: ')
                    .bold(false)
                    .text(this.helperService.calcularPremioLoteria(item.valor, item.cotacao5));
            }
            if (item.cotacao4 > 0) {
                ticketEscPos
                    .newline()
                    .bold(true)
                    .text('RETORNO 4: ')
                    .bold(false)
                    .text(this.helperService.calcularPremioLoteria(item.valor, item.cotacao4));
            }
            if (item.cotacao3 > 0) {
                ticketEscPos
                    .newline()
                    .bold(true)
                    .text('RETORNO 3: ')
                    .bold(false)
                    .text(this.helperService.calcularPremioLoteria(item.valor, item.cotacao3));
            }
        });

        parent.postMessage({ data: ticketEscPos.encode(), action: 'printLottery' }, '*'); // file://
    }

    // Bilhete Esportivo
    sportsTicket(aposta, dateTime?) {
        if (this.auth.isAppMobile()) {
            this.sportsTicketAppMobile(aposta, dateTime);
        } else {
            this.sportsTicketDestkop(aposta, dateTime);
        }
    }

    private sportsTicketDestkop(aposta, dateTime?) {
        let printContents, popupWin, html, styles;

        styles = `
        body{
            font-family: "Lucida Console", Monaco, monospace;
            font-size: 10px;
            background: #333;
            margin: 0;
        }

        #comprovante{
            padding: 15px;
            /*padding-right: 11px;*/
            background: #fff;
            margin: 0 auto;
            color: #000;
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
            font-size: 10px;
        }

        .item .campeonato{
            text-align: center;
            margin: 1px;
            font-weight: bold;
            font-size: 10px;
        }

        .item .horario{
            margin: 1px;
            font-size: 10px;
            text-transform: uppercase;
        }

        .item .jogo{
            margin: 1px;
            font-weight: bold;
            font-size: 10px;
        }

        .item .cotacao{
            margin: 1px;
            font-size: 10px;
        }

        .valores .total-jogos, .valores .aposta, .valores .ganho, .valores .cambista-paga{
            text-align: left;
            margin: 3px 3px 1px 1px;
            font-weight: bold;
            font-size: 10px;
        }

        .rodape{
            margin: 5px 1px 1px 1px;
            font-weight: normal;
            font-size: 10px;
            text-align: center;
        }

        @page {
            margin: 0;
        }

        @media print {
            html, body {
                width: 100%;
                max-width: 78mm;
                padding: 0mm;
            }
        }
        `;

        printContents = `
        <div id="comprovante">
            <div class="conteudo">
                <div style="text-align: center;">
                    <img style="max-height: 80px; max-width: 190px;"
                    alt="${config.BANCA_NOME}" src="${config.LOGO}" />
                </div>
                <h1 class="numero">
                    ${aposta.codigo}
                </h1>
                <hr>
                <hr>
                <div class="informacoes">
                    <p>
                        <b>CAMBISTA:</b> ${aposta.passador.nome}
                    </p>
                    <p>
                        <b>APOSTADOR:</b> ${aposta.apostador}
                    </p>
                    <p>
                        <b>HORÁRIO:</b> ${this.helperService.dateFormat(aposta.horario, 'DD/MM/YYYY [ÀS] HH:mm')}
                    </p>
                </div>
                <hr>
                <hr>
                `;

        aposta.itens.forEach((item, index, array) => {
            printContents += `
                <div class="item">
                    <p class="campeonato">
                        ${item.campeonato_nome}
                    </p>
                    <p class="horario">
                        ${this.helperService.dateFormat(item.jogo_horario, 'DD/MM/YYYY [ÀS] HH:mm')}
                    </p>
                    <p class="jogo">
                        ${item.time_a_nome} x ${item.time_b_nome}
                    </p>
                    <p class="cotacao">
                        ${item.categoria_nome}: ${item.odd_nome} ( ${parseFloat(item.cotacao).toFixed(2)} )`;
            if (item.ao_vivo) {
                printContents += ` | <b>AO VIVO</b>`;
            }
            if (item.status != null) {
                printContents += ` | <b>${item.status.toUpperCase()}</b>`;
            }
            printContents += `
                    </p>
                </div>
                <hr>
            `;
        });

        printContents += `
                <hr>
                <div class="valores">
                    <p class="total-jogos">
                        QUANTIDADE DE JOGOS: <span style="float:right">${aposta.itens.length}</span>
                    </p>
                    <p class="aposta">
                        COTAÇÃO: <span style="float:right">${this.helperService.moneyFormat(aposta.possibilidade_ganho / aposta.valor, false)}</span>
                    </p>
                    <p class="aposta">
                        VALOR APOSTADO: <span style="float:right">${this.helperService.moneyFormat(aposta.valor)}</span>
                    </p>
                    <p class="ganho">
                        POSSÍVEL RETORNO: <span style="float:right">${this.helperService.moneyFormat(aposta.possibilidade_ganho)}</span>
                    </p>
                    <p class="ganho">
                        PRÊMIO: <span style="float:right">${this.helperService.moneyFormat(aposta.premio)}</span>
                    </p>`;

        if (aposta.passador.percentualPremio > 0) {
            let cambistaPaga = 0;

            if (aposta.resultado) {
                cambistaPaga = aposta.premio * ((100 - aposta.passador.percentualPremio) / 100);
            } else {
                cambistaPaga = aposta.possibilidade_ganho * ((100 - aposta.passador.percentualPremio) / 100);
            }

            printContents += `   <p class="cambista-paga">
                            CAMBISTA PAGA: <span style="float:right">${this.helperService.moneyFormat(cambistaPaga)}</span>
                        </p>`;
        }

        printContents += `
                    <hr>
                    <hr>
                    </div>
                <p class="rodape">
                    ${this.opcoes.informativo_rodape}
                </p>
                <br>
                <small style="font-size: 6px">impresso em ${dateTime}</small>
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
          <body onload="window.print();">${printContents}</body>
        </html>`;

        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();
    }

    private sportsTicketAppMobile(aposta, dateTime?) {
        const logoHtml = document.createElement('div');
        logoHtml.innerHTML = '<div style="width: 360px; background-color:gray; text-align:center">\n' +
            '  <img src="data:image/png;base64,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" height="60" />\n' +
            '</div>';
        let logoCanvas;
        html2canvas(logoHtml).then(function(canvas) {
            logoCanvas = canvas;
        });

        const logoImg = new Image();
        logoImg.src = 'data:image/png;base64,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';

        const encoder = new EscPosEncoder();

        logoImg.onload = () => {
            const ticketEscPos = encoder
                .initialize()
                .image(logoImg, 368, 128, 'atkinson')
                .newline()
                .newline()
                .raw([0x1b, 0x4d, 0x01])
                .text('teste de Fonte B')
                .raw([0x1b, 0x4d, 0x00])
                .text('teste de Fonte A')
                .bold(true)
                .align('center')
                .raw([0x1B, 0x21, 0x10]) // Large Font Size
                .line(aposta.codigo);
                /*.raw([0x1B, 0x21, 0x03])
                .align('left')
                .size('normal')
                .line(this.separatorLine)
                .bold(true)
                .text('CAMBISTA:')
                .bold(false)
                .text(this.helperService.removerAcentos(aposta.passador.nome))
                .newline()
                .bold(true)
                .text('APOSTADOR:')
                .bold(false)
                .text(this.helperService.removerAcentos(aposta.apostador))
                .newline()
                .bold(true)
                .text('HORARIO:')
                .bold(false)
                .text(this.helperService.dateFormat(aposta.horario, 'DD/MM/YYYY HH:mm'))
                .newline();

            aposta.itens.forEach(item => {
                ticketEscPos
                    .newline()
                    .line(this.separatorLine)
                    .align('center')
                    .bold(true)
                    .line(this.helperService.removerAcentos(item.campeonato_nome))
                    .bold(false)
                    .align('left')
                    .line(this.helperService.dateFormat(item.jogo_horario, 'DD/MM/YYYY HH:mm'))
                    .line(this.helperService.removerAcentos(item.time_a_nome + ' x ' + item.time_b_nome))
                    .line(this.helperService.removerAcentos(item.categoria_nome) + ': ')
                    .text(this.helperService.removerAcentos(item.odd_nome) + '(' + item.cotacao.toFixed(2) + ')');

                if (item.ao_vivo) {
                    ticketEscPos
                        .text(' | AO VIVO');
                }
            });

            ticketEscPos
                .newline()
                .align('left')
                .line(this.separatorLine)
                .bold(true)
                .text('QUANTIDADE DE JOGOS: ')
                .bold(false)
                .text(aposta.itens.length)
                .newline()
                .bold(true)
                .text('COTACAOO: ')
                .bold(false)
                .text(this.helperService.moneyFormat(aposta.possibilidade_ganho / aposta.valor, false))
                .newline()
                .bold(true)
                .text('VALOR APOSTADO: ')
                .bold(false)
                .text(this.helperService.moneyFormat(aposta.valor))
                .newline()
                .bold(true)
                .text('POSSIVEL RETORNO: ')
                .bold(false)
                .text(this.helperService.moneyFormat(aposta.possibilidade_ganho))
                .newline()
                .bold(true)
                .text('PREMIO: ')
                .bold(false)
                .text(this.helperService.moneyFormat(aposta.premio))
                .newline();

            if (aposta.passador.percentualPremio > 0) {
                let cambistaPaga = 0;

                if (aposta.resultado) {
                    cambistaPaga = aposta.premio * ((100 - aposta.passador.percentualPremio) / 100);
                } else {
                    cambistaPaga = aposta.possibilidade_ganho * ((100 - aposta.passador.percentualPremio) / 100);
                }

                ticketEscPos
                    .newline()
                    .bold(true)
                    .text('CAMBISTA PAGA: ')
                    .bold(false)
                    .text(this.helperService.moneyFormat(cambistaPaga));
            }

            ticketEscPos
                .newline()
                .align('center')
                .line(this.helperService.removerAcentos(this.opcoes.informativo_rodape))
                .newline()
                .align('left')
                .size('small')
                .line('impresso em ' + dateTime)
                .newline()
                .newline()
                .newline()
                .newline();*/

            parent.postMessage({ data: ticketEscPos.encode(), action: 'printLottery' }, '*'); // file://
        };
    }

    // Bilhete Acumuladão
    bilheteAcumuladao(aposta) {
        if (this.auth.isAppMobile()) {
            this.bilheteAcumuladaoMobile(aposta);
        } else {
            this.bilheteAcumuladaoDesktop(aposta);
        }
    }

    private bilheteAcumuladaoMobile(aposta) {
        const encoder = new EscPosEncoder();

        const ticketEscPos = encoder
            .initialize()
            .bold(true)
            .align('center')
            .raw([0x1B, 0x21, 0x10]) // Large Font Size
            .line(config.BANCA_NOME)
            .line(aposta.codigo)
            .raw([0x1B, 0x21, 0x03])
            .align('left')
            .size('normal')
            .line(this.separatorLine)
            .bold(true)
            .text('CAMBISTA:')
            .bold(false)
            .text(this.helperService.removerAcentos(aposta.passador.nome))
            .newline()
            .bold(true)
            .text('APOSTADOR:')
            .bold(false)
            .text(this.helperService.removerAcentos(aposta.apostador))
            .newline()
            .bold(true)
            .text('HORARIO:')
            .bold(false)
            .text(this.helperService.dateFormat(aposta.horario, 'DD/MM/YYYY HH:mm'))
            .newline()
            .text(this.separatorLine)
            .newline()
            .bold(true)
            .text(this.helperService.removerAcentos(aposta.acumuladao.nome))
            .bold(false)
            .newline()
            .text(this.separatorLine);

        if (aposta.resultado) {
            ticketEscPos
                .newline()
                .bold(true)
                .text('TOTAL DE ACERTOS: ')
                .bold(false)
                .text(aposta.quantidade_acertos)
                .newline()
                .bold(true)
                .text('PREMIO RECEBIDO: ')
                .bold(false)
                .text(this.helperService.moneyFormat(aposta.premio));
        } else {
            aposta.acumuladao.premios.forEach(premio => {
                ticketEscPos
                    .newline()
                    .bold(true)
                    .text('POSSIVEL PREMIO ' + premio.quantidade_acertos)
                    .text(' ACERTOS: ' + this.helperService.moneyFormat(premio.valor))
                    .bold(false);
            });
        }

        aposta.itens.forEach(item => {
            ticketEscPos
                .newline()
                .line(this.separatorLine)
                .line(this.helperService.dateFormat(item.jogo.horario, 'DD/MM/YYYY HH:mm'))
                .line(this.helperService.removerAcentos(item.jogo.time_a_nome + ' x ' + item.jogo.time_b_nome))
                .bold(true)
                .text('PALPITE: ')
                .bold(false)
                .text(item.time_a_resultado + ' x ' + item.time_b_resultado);
        });

        ticketEscPos
            .newline()
            .line(this.separatorLine)
            .align('center')
            .text('Caso o ACUMULADAO tenha mais de um ganhador, o premio sera dividido em partes iguais entre todos os vencedores.');

        parent.postMessage({ data: ticketEscPos.encode(), action: 'printLottery' }, '*'); // file://
    }

    private bilheteAcumuladaoDesktop(aposta) {
        let printContents, popupWin, html, styles;

        styles = `
        body{
            font-family: "Lucida Console", Monaco, monospace;
            font-size: 10px;
            background: #333;
            margin: 0;
        }

        #comprovante{
            padding: 15px;
            /*padding-right: 11px;*/
            background: #fff;
            margin: 0 auto;
            color: #000;
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
            font-size: 10px;
        }
        .item .horario{
            margin:0;
            font-size: 10px;
            text-transform: uppercase;
        }
        .item .nome{
            margin:0;
            font-size: 10px;
        }

        .item .palpite{
            margin: 0;
            font-weight: bold;
            font-size: 10px;
        }

        .rodape{
            margin: 5px 1px 1px 1px;
            font-weight: normal;
            font-size: 10px;
            text-align: center;
        }

        @page {
            margin: 0;
        }

        @media print {
            html, body {
                width: 100%;
                max-width: 78mm;
                padding: 0mm;
            }
        }
        `;

        printContents = `
        <div id="comprovante">
            <div class="conteudo">
                <div style="text-align: center;">
                    <img style="max-height: 80px; max-width: 190px;"
                    alt="${config.BANCA_NOME}" src="${config.LOGO}" />
                </div>
                <h1 class="numero">
                    ${aposta.codigo}
                </h1>
                <hr>
                <hr>
                <div class="informacoes">
                    <p>
                        <b>CAMBISTA:</b> ${aposta.passador.nome}
                    </p>
                    <p>
                        <b>APOSTADOR:</b> ${aposta.apostador}
                    </p>
                    <p>
                        <b>HORÁRIO:</b> ${this.helperService.dateFormat(aposta.horario, 'DD/MM/YYYY [ÀS] HH:mm')}
                    </p>
                </div>
                <hr>
                <hr>
                <div class="acumuladao">
                    <div class="nome">
                       <b>${aposta.acumuladao.nome}</b>
                    </div>
                `;

        if (aposta.resultado) {
            printContents += `
                    <div>
                        <b>TOTA DE ACERTOS:</b> ${aposta.quantidade_acertos}
                    </div>
                    <div>
                        <b>PRÊMIO RECEBIDO:</b> ${this.helperService.moneyFormat(aposta.premio)}
                    </div>
                `;
        } else {
            aposta.acumuladao.premios.forEach(premio => {
                printContents += `
                <div class="premio">
                    <b>POSSÍVEL PRÊMIO: ${premio.quantidade_acertos} acertos:</b>
                    ${this.helperService.moneyFormat(premio.valor)}
                </div>`;
            });
        }

        printContents += `
            </div>
            <hr>
        `;

        aposta.itens.forEach((item, index, array) => {
            printContents += `
                <div class="item">
                    <p class="horario">
                        ${this.helperService.dateFormat(item.jogo.horario, 'DD/MM/YYYY [ÀS] HH:mm')}
                    </p>
                    <p class="nome">
                        ${item.jogo.time_a_nome} x ${item.jogo.time_b_nome}
                    </p>
                    <p class="palpite">
                        PALPITE: ${item.time_a_resultado} x ${item.time_b_resultado}
                    </p>`;

            if (item.resultado) {
                printContents += `
                <p class="jogo-resultado">
                ${item.resultado}
                </p>
                `;
            }
            printContents += `
                </div>
                <hr>
            `;
        });

        printContents += `
                <hr>
                <p class="rodape">
                    Caso o ACUMULADÃO tenha mais de um ganhador, o prêmio será dividido em partes iguais entre todos os
                    vencedores.
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
          <body onload="window.print();">${printContents}</body>
        </html>`;

        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();
    }

    // Bilhete Desafio
    desafioTicket(aposta) {
        if (this.auth.isAppMobile()) {
            this.desafioTicketAppMobile(aposta);
        } else {
            this.desafioTicketDestkop(aposta);
        }
    }

    private desafioTicketDestkop(aposta) {
        let printContents, popupWin, html, styles;

        styles = `
        body{
            font-family: "Lucida Console", Monaco, monospace;
            font-size: 10px;
            background: #333;
            margin: 0;
        }

        #comprovante{
            padding: 15px;
            /*padding-right: 11px;*/
            background: #fff;
            margin: 0 auto;
            color: #000;
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
            font-size: 10px;
        }

        .item .categoria{
            text-align: center;
            margin: 1px;
            font-weight: bold;
            font-size: 10px;
        }

        .item .desafio{
            margin: 1px;
            font-weight: bold;
            font-size: 10px;
        }

        .item .cotacao{
            margin: 1px;
            font-size: 10px;
        }

        .valores .total-desafios, .valores .aposta, .valores .ganho, .valores .cambista-paga{
            text-align: left;
            margin: 3px 3px 1px 1px;
            font-weight: bold;
            font-size: 10px;
        }

        .rodape{
            margin: 5px 1px 1px 1px;
            font-weight: normal;
            font-size: 10px;
            text-align: center;
        }

        @page {
            margin: 0;
        }

        @media print {
            html, body {
                width: 100%;
                max-width: 78mm;
                padding: 0mm;
            }
        }
        `;

        printContents = `
        <div id="comprovante">
            <div class="conteudo">
                <div style="text-align: center;">
                    <img style="max-height: 80px; max-width: 190px;"
                    alt="${config.BANCA_NOME}" src="${config.LOGO}" />
                </div>
                <h1 class="numero">
                    ${aposta.codigo}
                </h1>
                <hr>
                <hr>
                <div class="informacoes">
                    <p>
                        <b>CAMBISTA:</b> ${aposta.passador.nome}
                    </p>
                    <p>
                        <b>APOSTADOR:</b> ${aposta.apostador}
                    </p>
                    <p>
                        <b>HORÁRIO:</b> ${this.helperService.dateFormat(aposta.horario, 'DD/MM/YYYY [ÀS] HH:mm')}
                    </p>
                </div>
                <hr>
                <hr>
                `;

        aposta.itens.forEach((item, index, array) => {
            printContents += `
                <div class="item">
                    <p class="categoria">
                        ${item.odd.desafio.categoria.nome}
                    </p>
                    <p class="desafio">
                        ${item.odd.desafio.nome}
                    </p>
                    <p class="cotacao">
                        RESPOSTA: ${item.odd_nome} ( ${parseFloat(item.cotacao).toFixed(2)} )`;
            if (item.status != null) {
                printContents += ` | <b>${item.status.toUpperCase()}</b>`;
            }
            printContents += `
                    </p>
                </div>
                <hr>
            `;
        });

        printContents += `
                <hr>
                <div class="valores">
                    <p class="total-desafios">
                        QUANTIDADE DE DESAFIOS: <span style="float:right">${aposta.itens.length}</span>
                    </p>
                    <p class="aposta">
                        COTAÇÃO: <span style="float:right">${this.helperService.moneyFormat(aposta.possibilidade_ganho / aposta.valor, false)}</span>
                    </p>
                    <p class="aposta">
                        VALOR APOSTADO: <span style="float:right">${this.helperService.moneyFormat(aposta.valor)}</span>
                    </p>
                    <p class="ganho">
                        POSSÍVEL RETORNO: <span style="float:right">${this.helperService.moneyFormat(aposta.possibilidade_ganho)}</span>
                    </p>`;

        if (aposta.passador.percentualPremio > 0) {
            let cambistaPaga = 0;

            if (aposta.resultado) {
                cambistaPaga = aposta.premio * ((100 - aposta.passador.percentualPremio) / 100);
            } else {
                cambistaPaga = aposta.possibilidade_ganho * ((100 - aposta.passador.percentualPremio) / 100);
            }

            printContents += `   <p class="cambista-paga">
                            CAMBISTA PAGA: <span style="float:right">${this.helperService.moneyFormat(cambistaPaga)}</span>
                        </p>`;
        }

        printContents += `
                    <hr>
                    <hr>
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
          <body onload="window.print();">${printContents}</body>
        </html>`;

        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();
    }

    private desafioTicketAppMobile(aposta) {
        const encoder = new EscPosEncoder();

        const ticketEscPos = encoder
            .initialize()
            .bold(true)
            .align('center')
            .raw([0x1B, 0x21, 0x10]) // Large Font Size
            .line(config.BANCA_NOME)
            .line(aposta.codigo)
            .raw([0x1B, 0x21, 0x03])
            .align('left')
            .size('normal')
            .line(this.separatorLine)
            .bold(true)
            .text('CAMBISTA:')
            .bold(false)
            .text(this.helperService.removerAcentos(aposta.passador.nome))
            .newline()
            .bold(true)
            .text('APOSTADOR:')
            .bold(false)
            .text(this.helperService.removerAcentos(aposta.apostador))
            .newline()
            .bold(true)
            .text('HORARIO:')
            .bold(false)
            .text(this.helperService.dateFormat(aposta.horario, 'DD/MM/YYYY HH:mm'))
            .newline();

        aposta.itens.forEach(item => {
            ticketEscPos
                .line(this.separatorLine)
                .bold(true)
                .align('center')
                .line(this.helperService.removerAcentos(item.odd.desafio.categoria.nome))
                .bold(false)
                .align('left')
                .text(item.odd.desafio.nome)
                .bold(true)
                .newline()
                .text('RESPOSTA: ')
                .bold(false)
                .text(this.helperService.removerAcentos(item.odd_nome) + ' (' + item.cotacao.toFixed(2) + ')');
        });

        ticketEscPos
            .newline()
            .line(this.separatorLine)
            .bold(true)
            .text('QUANTIDADE DE DESAFIOS: ')
            .bold(false)
            .text(aposta.itens.length)
            .newline()
            .bold(true)
            .text('COTACAO: ')
            .bold(false)
            .text(this.helperService.moneyFormat(aposta.possibilidade_ganho / aposta.valor, false))
            .newline()
            .bold(true)
            .text('VALOR APOSTADO: ')
            .bold(false)
            .text(this.helperService.moneyFormat(aposta.valor))
            .newline()
            .bold(true)
            .text('POSSIVEL RETORNO: ')
            .bold(false)
            .text(this.helperService.moneyFormat(aposta.possibilidade_ganho));

        if (aposta.passador.percentualPremio > 0) {
            let cambistaPaga = 0;

            if (aposta.resultado) {
                cambistaPaga = aposta.premio * ((100 - aposta.passador.percentualPremio) / 100);
            } else {
                cambistaPaga = aposta.possibilidade_ganho * ((100 - aposta.passador.percentualPremio) / 100);
            }
            ticketEscPos
                .newline()
                .bold(true)
                .text('CAMBISTA PAGA: ')
                .bold(false)
                .text(this.helperService.moneyFormat(cambistaPaga));
        }

        ticketEscPos
            .newline()
            .line(this.separatorLine)
            .text(this.helperService.removerAcentos(this.opcoes.informativo_rodape));

        parent.postMessage({ data: ticketEscPos.encode(), action: 'printLottery' }, '*'); // file://
    }

    // Cartão
    card(card) {
        if (this.auth.isAppMobile()) {
            this.cardMobile(card);
        } else {
            this.cardDesktop(card);
        }
    }

    private cardMobile(card) {
        const encoder = new EscPosEncoder();

        const cardPrintEscPos = encoder
            .initialize()
            .bold(true)
            .align('center')
            .raw([0x1B, 0x21, 0x10]) // Large Font Size
            .line(config.BANCA_NOME)
            .raw([0x1B, 0x21, 0x03])
            .align('left')
            .size('normal')
            .line(this.separatorLine)
            .bold(true)
            .text('Cartao: ')
            .bold(false)
            .text(card.chave)
            .newline()
            .bold(true)
            .text('Criacao: ')
            .bold(false)
            .text(this.helperService.dateFormat(card.data_registro, 'DD/MM/YYYY HH:mm'))
            .newline()
            .bold(true)
            .text('Cambista: ')
            .bold(false)
            .text(this.helperService.removerAcentos(card.passador.nome))
            .newline()
            .bold(true)
            .text('Apostador: ')
            .bold(false)
            .text(this.helperService.removerAcentos(card.apostador))
            .newline()
            .bold(true)
            .text('Premios: ')
            .bold(false)
            .text(this.helperService.moneyFormat(card.premios))
            .newline()
            .bold(true)
            .text('Saldo: ')
            .bold(false)
            .text(this.helperService.moneyFormat(card.saldo))
            .newline();

        parent.postMessage({ data: cardPrintEscPos.encode(), action: 'printCard' }, '*'); // file://
    }

    private cardDesktop(card) {
        let printContents, popupWin, html, styles;

        styles = `
        body{
            font-family: "Lucida Console", Monaco, monospace;
            font-size: 15px;
            background: #333;
            margin: 0;
        }

        #comprovante{
            padding: 15px;
            /*padding-right: 11px;*/
            background: #fff;
            margin: 0 auto;
            color: #000;
        }

        .margin-bottom-15 {
            margin-bottom: 15px;
        }

        .margin-bottom-5 {
            margin-bottom: 5px;
        }

        .informacoes{
            font-size:10px;
        }

        .chave{
            font-size:15px;
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
                width: 100%;
                max-width: 78mm;
                padding: 0mm;
            }
        }
        `;

        printContents = `
        <div id="comprovante">
            <div class="conteudo">
                <div style="text-align: center;">
                    <img style="max-height: 50;"
                    alt="${config.BANCA_NOME}" src="${config.LOGO}" />
                </div>
                <h1 class="chave margin-bottom-15">
                    Cartão ${card.chave}
                </h1>
                <div class="informacoes">
                    <div class="margin-bottom-5">
                        <b>Apostador: </b>${card.apostador}
                    </div>
                    <div class="margin-bottom-5">
                        <b>Cambista: </b>${card.passador.nome}
                    </div>
                    <div class="margin-bottom-5">
                        <b>Bônus: </b>${this.helperService.moneyFormat(card.bonus)}
                    </div>
                    <div class="margin-bottom-5">
                        <b>Saldo atual: </b>${this.helperService.moneyFormat(card.saldo)}
                    </div>
                    <div class="margin-bottom-5">
                        <b>Criação: </b>${this.helperService.dateFormat(card.data_registro, 'DD/MM/YYYY HH:mm')}
                    </div>
                </div>
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
          <body onload="window.print();">${printContents}</body>
        </html>`;

        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();
    }

    comprovanteRecarga(recarga) {
        if (this.auth.isAppMobile()) {
            this.comprovanteRecargaMobile(recarga);
        } else {
            this.comprovanteRecargaDesktop(recarga);
        }
    }

    private comprovanteRecargaMobile(recarga) {
        const encoder = new EscPosEncoder();

        const cardRecargaEscPos = encoder
            .initialize()
            .bold(true)
            .align('center')
            .raw([0x1B, 0x21, 0x10]) // Large Font Size
            .line(config.BANCA_NOME)
            .raw([0x1B, 0x21, 0x03])
            .align('left')
            .size('normal')
            .line(this.separatorLine)
            .bold(true)
            .text('Cartao: ')
            .bold(false)
            .text(recarga.cartao_aposta)
            .newline()
            .bold(true)
            .text('Cambista: ')
            .bold(false)
            .text(this.helperService.removerAcentos(recarga.passador))
            .newline()
            .bold(true)
            .text('Valor: ')
            .bold(false)
            .text(this.helperService.moneyFormat(recarga.valor))
            .newline()
            .bold(true)
            .text('Data/Hora: ')
            .bold(false)
            .text(this.helperService.dateFormat(recarga.data, 'DD/MM/YYYY HH:mm'))
            .newline()
            .align('center')
            .size('small')
            .bold(true)
            .text(recarga.autenticacao)
            .newline();

        parent.postMessage({ data: cardRecargaEscPos.encode(), action: 'printCard' }, '*'); // file://
    }

    private comprovanteRecargaDesktop(recarga) {
        let printContents, popupWin, html, styles;

        styles = `
        body{
            font-family: "Lucida Console", Monaco, monospace;
            font-size: 15px;
            background: #333;
            margin: 0;
        }

        #comprovante{
            padding: 15px;
            /*padding-right: 11px;*/
            background: #fff;
            margin: 0 auto;
            color: #000;
        }

        .margin-bottom-5 {
            margin-bottom: 5px;
        }

        .margin-bottom-15 {
            margin-bottom: 15px;
        }

        .informacoes{
            font-size:10px;
        }

        .chave{
            font-size:15px;
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
                width: 100%;
                max-width: 78mm;
                padding: 0mm;
            }
        }
        `;

        printContents = `
        <div id="comprovante">
            <div class="conteudo">
                <div style="text-align: center;">
                    <img style="max-height: 50;"
                    alt="${config.BANCA_NOME}" src="${config.LOGO}" />
                </div>
                <h1 class="chave margin-bottom-15">
                    Comprovante de Recarga
                </h1>
                <div class="informacoes">
                    <div class="margin-bottom-5">
                        <b>Cartão:</b> ${recarga.cartao_aposta}
                    </div>
                    <div class="margin-bottom-5">
                        <b>Cambista:</b> ${recarga.passador}
                    </div>
                    <div class="margin-bottom-5">
                        <b>Valor:</b> ${this.helperService.moneyFormat(recarga.valor)}
                    </div>
                    <div class="margin-bottom-5">
                        <b>Data/Hora:</b> ${this.helperService.dateFormat(recarga.data, 'DD/MM/YYYY HH:mm')}
                    </div>
                    <div class="margin-bottom-5">
                        ${recarga.autenticacao}
                    </div>
                </div>
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
          <body onload="window.print();">${printContents}</body>
        </html>`;

        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();
    }

    // Utils
    listPrinters() {
        const message = {
            data: '',
            action: 'listPrinters',
        };

        parent.postMessage(message, '*'); // file://
        console.log('listPrinters');
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
            const tiposAposta = this.paramsService.getTiposAposta();
            const sigla = `${tiposAposta[chave].sigla}     `;
            return sigla.substr(0, 5);
        }
        return '    ';
    }

    getNomeModalidadeLoteria(modalidade) {
        if (modalidade === 'seninha') {
            return this.paramsService.getSeninhaNome();
        } else {
            return this.paramsService.getQuininhaNome();
        }
    }

    getApostaTipoNome(apostaTipo, jogo) {
        let result = apostaTipo.nome;
        if (jogo.sport == '9') {
            if (result.search(/casa/ig) >= 0) {
                result = result.replace(/casa/ig, jogo.time_a_nome);
            }
            if (result.search(/fora/ig) >= 0) {
                result = result.replace(/fora/ig, jogo.time_b_nome);
            }
        }
        return result;
    }
}
