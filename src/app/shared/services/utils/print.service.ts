import { Injectable } from '@angular/core';

import { AuthService } from './../auth/auth.service';
import { HelperService } from './helper.service';
import { ParametrosLocaisService } from './../parametros-locais.service';

import { config } from './../../config';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PrintService {
    private opcoes = this.paramsService.getOpcoes();

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
          <body onload="window.print();window.close()">${printContents}</body>
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
          <body onload="window.print();window.close()">${printContents}</body>
        </html>`;

        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();
    }

    private lotteryTicketAppMobile(aposta) {
        let ticket = `
${config.BANCA_NOME}

#${aposta.id}
Data: ${this.helperService.dateFormat(aposta.horario, 'DD/MM/YYYY HH:mm')}
Cambista: ${aposta.passador.nome}
Apostador: ${aposta.apostador}
Modalidade: ${this.getNomeModalidadeLoteria(aposta.modalidade)}
Valor Total: ${this.helperService.moneyFormat(aposta.valor)}`;

        aposta.itens.forEach(item => {
            ticket += `
-------------------------------
${item.sorteio_nome}
Dezenas: ${item.numeros.join('-')}
Valor: ${this.helperService.moneyFormat(item.valor)}`;
            if (item.tipo === 'seninha' && item.cotacao6 > 0) {
                ticket += `
Retorno 6: ${this.helperService.calcularPremioLoteria(item.valor, item.cotacao6)}`;
            }
            if (item.cotacao5 > 0) {
                ticket += `
Retorno 5: ${this.helperService.calcularPremioLoteria(item.valor, item.cotacao5)}`;
            }
            if (item.cotacao4 > 0) {
                ticket += `
Retorno 4: ${this.helperService.calcularPremioLoteria(item.valor, item.cotacao4)}`;
            }
            if (item.cotacao3 > 0) {
                ticket += `
Retorno 3: ${this.helperService.calcularPremioLoteria(item.valor, item.cotacao3)}`;
            }
        });

        ticket += `
        `;

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

    private sportsTicketDestkop(aposta) {
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
                    #${aposta.id}
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
                        COTAÇÃO: <span style="float:right">${this.helperService.moneyFormat(aposta.possibilidade_ganho / aposta.valor).replace('R$ ', '')}</span>
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

    private sportsTicketAppMobile(aposta) {
        let ticket = `${config.BANCA_NOME}
#${aposta.id}
CAMBISTA: ${aposta.passador.nome}
APOSTADOR: ${aposta.apostador}
HORARIO: ${this.helperService.dateFormat(aposta.horario, 'DD/MM/YYYY HH:mm')}
-------------------------------`;

        aposta.itens.forEach(item => {
            ticket += `
-------------------------------
${item.campeonato_nome}
${this.helperService.dateFormat(item.jogo_horario, 'DD/MM/YYYY HH:mm')}
${item.time_a_nome} x ${item.time_b_nome}
${item.categoria_nome}: ${item.odd_nome} ( ${item.cotacao.toFixed(2)} )`;
            if (item.ao_vivo) {
                ticket += ` | AO VIVO`;
            }
        });

        ticket += `
-------------------------------
-------------------------------
QUANTIDADE DE JOGOS: ${aposta.itens.length}
COTAÇÃO: ${this.helperService.moneyFormat(aposta.possibilidade_ganho / aposta.valor).replace('R$ ', '')}
VALOR APOSTADO: ${this.helperService.moneyFormat(aposta.valor)}
POSSIVEL RETORNO: ${this.helperService.moneyFormat(aposta.possibilidade_ganho)}
PREMIO: ${this.helperService.moneyFormat(aposta.premio)}
`;

        if (aposta.passador.percentualPremio > 0) {
            let cambistaPaga = 0;

            if (aposta.resultado) {
                cambistaPaga = aposta.premio * ((100 - aposta.passador.percentualPremio) / 100);
            } else {
                cambistaPaga = aposta.possibilidade_ganho * ((100 - aposta.passador.percentualPremio) / 100);
            }

            ticket += `CAMBISTA PAGA: ${this.helperService.moneyFormat(cambistaPaga)}`;
        }

        ticket += `
-------------------------------
-------------------------------
${this.opcoes.informativo_rodape}
        `;

        parent.postMessage({ data: ticket, action: 'printLottery' }, 'file://'); // file://
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
        let ticket = `${config.BANCA_NOME}
#${aposta.id}
CAMBISTA: ${aposta.passador.nome}
APOSTADOR: ${aposta.apostador}
HORARIO: ${this.helperService.dateFormat(aposta.horario, 'DD/MM/YYYY HH:mm')}
-------------------------------
-------------------------------
${aposta.acumuladao.nome}`;

        if (aposta.resultado) {
            ticket += `
TOTA DE ACERTOS: ${aposta.quantidade_acertos}
PREMIO RECEBIDO: ${this.helperService.moneyFormat(aposta.premio)}`;
        } else {
            aposta.acumuladao.premios.forEach(premio => {
                ticket += `
POSSÍVEL PREMIO ${premio.quantidade_acertos} ACERTOS: ${this.helperService.moneyFormat(premio.valor)}`;
            });
        }

        ticket += `
-------------------------------`;

        aposta.itens.forEach(item => {
            ticket += `
${this.helperService.dateFormat(item.jogo.horario, 'DD/MM/YYYY HH:mm')}
${item.jogo.time_a_nome} x ${item.jogo.time_b_nome}
PALPITE: ${item.time_a_resultado} x ${item.time_b_resultado}
-------------------------------`;
        });

        ticket += `
-------------------------------
Caso o ACUMULADAO tenha mais de um ganhador, o premio sera dividido em partes iguais entre todos os vencedores.

`;

        parent.postMessage({ data: ticket, action: 'printLottery' }, 'file://'); // file://

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
                    #${aposta.id}
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
          <body onload="window.print();window.close()">${printContents}</body>
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
                    #${aposta.id}
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
                        COTAÇÃO: <span style="float:right">${this.helperService.moneyFormat(aposta.possibilidade_ganho / aposta.valor).replace('R$ ', '')}</span>
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
          <body onload="window.print();window.close()">${printContents}</body>
        </html>`;

        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();
    }

    private desafioTicketAppMobile(aposta) {
        let ticket = `${config.BANCA_NOME}
#${aposta.id}
CAMBISTA: ${aposta.passador.nome}
APOSTADOR: ${aposta.apostador}
HORARIO: ${this.helperService.dateFormat(aposta.horario, 'DD/MM/YYYY HH:mm')}
-------------------------------`;

        aposta.itens.forEach(item => {
            ticket += `
-------------------------------
${item.odd.desafio.categoria.nome}
${item.odd.desafio.nome}
RESPOSTA: ${item.odd_nome} ( ${item.cotacao.toFixed(2)} )`;
        });

        ticket += `
-------------------------------
-------------------------------
QUANTIDADE DE DESAFIOS: ${aposta.itens.length}
COTAÇÃO: ${this.helperService.moneyFormat(aposta.possibilidade_ganho / aposta.valor).replace('R$ ', '')}
VALOR APOSTADO: ${this.helperService.moneyFormat(aposta.valor)}
POSSIVEL RETORNO: ${this.helperService.moneyFormat(aposta.possibilidade_ganho)}
`;

        if (aposta.passador.percentualPremio > 0) {
            let cambistaPaga = 0;

            if (aposta.resultado) {
                cambistaPaga = aposta.premio * ((100 - aposta.passador.percentualPremio) / 100);
            } else {
                cambistaPaga = aposta.possibilidade_ganho * ((100 - aposta.passador.percentualPremio) / 100);
            }

            ticket += `CAMBISTA PAGA: ${this.helperService.moneyFormat(cambistaPaga)}`;
        }

        ticket += `
-------------------------------
-------------------------------
${this.opcoes.informativo_rodape}
        `;

        parent.postMessage({ data: ticket, action: 'printLottery' }, 'file://'); // file://
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
        const print = `${config.BANCA_NOME}
Cartão ${card.chave}
Criação: ${this.helperService.dateFormat(card.data_registro, 'DD/MM/YYYY HH:mm')}
Cambista: ${card.passador.nome}
Apostador: ${card.apostador}
Bônus: ${this.helperService.moneyFormat(card.bonus)}
Saldo: ${this.helperService.moneyFormat(card.saldo)}
`;

        parent.postMessage({ data: print, action: 'printCard' }, 'file://'); // file://
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
          <body onload="window.print();window.close()">${printContents}</body>
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
        const print = `${config.BANCA_NOME}
Cartão ${recarga.cartao_aposta}
Cambista: ${recarga.passador}
Valor: ${this.helperService.moneyFormat(recarga.valor)}
Data/Hora: ${this.helperService.dateFormat(recarga.data, 'DD/MM/YYYY HH:mm')}
${recarga.autenticacao}
`;

        parent.postMessage({ data: print, action: 'printCard' }, 'file://'); // file://
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
          <body onload="window.print();window.close()">${printContents}</body>
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

        parent.postMessage(message, 'file://'); // file://
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
