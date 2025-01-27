import { Injectable } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';

import { environment } from './../../../../environments/environment';
import { config } from './../../config';
import * as moment from 'moment';

import { ParametrosLocaisService } from '../parametros-locais.service';
import { SportIdService } from './sport-id.service';

declare var WeebetMessage: any;

@Injectable({
    providedIn: 'root',
})
export class HelperService {
    tiposAposta;
    cotacoesLocais;
    opcoes;
    CURRENCY_SYMBOL = getCurrencySymbol(environment.currencyCode, 'wide');
    casaDasApostasId;

    constructor(
        private paramsService: ParametrosLocaisService,
        private sportIdService: SportIdService
    ) {
        this.cotacoesLocais = this.paramsService.getCotacoesLocais();
        this.tiposAposta = this.paramsService.getTiposAposta();
        this.opcoes = this.paramsService.getOpcoes();
        this.casaDasApostasId = this.paramsService.getOpcoes().casa_das_apostas_id;
    }

    apostaTipoLabel(chave: string, field = 'nome', language?: string ): string {
        const tipoAposta = this.tiposAposta[chave];

        if (!tipoAposta) {
            return '';
        }

        if (language) {
            return tipoAposta[`nome_${language}`] ?? tipoAposta[`nome_pt`];
        }

        return tipoAposta[field];
    }

    apostaTipoLabelCustom(value: any, timeA: string, timeB: string, sportId = this.sportIdService.footballId): string {
        let result = '';

        if (this.tiposAposta[value]) {
            const nome = this.tiposAposta[value].nome;
            result = nome;

            if (sportId !== this.sportIdService.footballId) {
                if (nome.search(/casa/ig) >= 0) {
                    result = nome.replace(/casa/ig, timeA);
                }
                if (nome.search(/fora/ig) >= 0) {
                    result = nome.replace(/fora/ig, timeB);
                }
            }
        }

        return result;
    }

    cotacaoPermitida(cotacao) {
        return cotacao >= (this.opcoes.bloquear_cotacao_menor_que || 1.05);
    }

    calcularCotacao(value: number, chave: string, jogoEventId: number, favorito: string, aoVivo?: boolean): number {
        let result = value;
        const tipoAposta = this.tiposAposta[chave];

        // Cotacação Local
        if (this.cotacoesLocais[jogoEventId] && this.cotacoesLocais[jogoEventId][chave]) {
            result = parseFloat(this.cotacoesLocais[jogoEventId][chave].valor);
        }

        if (tipoAposta) {
            if (aoVivo) {
                // Fator ao vivo
                let fatorAoVivo = parseFloat(tipoAposta.fator_ao_vivo);
                if (isNaN(fatorAoVivo) || !fatorAoVivo) {
                    fatorAoVivo = 1;
                }
                result *= fatorAoVivo;
            } else {
                // Fator
                let fator = parseFloat(tipoAposta.fator);
                if (isNaN(fator) || !fator) {
                    fator = 1;
                }
                result *= fator;

                if (favorito) {
                    // Favorito e Zebra
                    const cotacoesFavoritoZebra = [
                        'casa_90',
                        'fora_90',
                        'casa_empate_90',
                        'fora_empate_90'
                    ];

                    if (cotacoesFavoritoZebra.includes(chave)) {
                        if (/casa/.test(chave)) {
                            result *= favorito === 'casa' ? this.opcoes.fator_favorito : this.opcoes.fator_zebra;
                        } else {
                            result *= favorito === 'fora' ? this.opcoes.fator_favorito : this.opcoes.fator_zebra;
                        }
                    }
                }
            }

            // Limite
            if (result > tipoAposta.limite) {
                result = parseFloat(tipoAposta.limite);
            }
        }

        return parseFloat(result.toFixed(2));
    }

    calcularCotacao2String(value: number, chave: string, jogoEventId: number, favorito: string, aoVivo?: boolean): string {
        return this.calcularCotacao(value, chave, jogoEventId, favorito, aoVivo).toFixed(2);
    }

    timeSubtraction(timeOne, timeTwo) {
        const hourOneArray: any = timeOne.split(':');
        const hourTwoArray: any = timeTwo.split(':');

        const hourOne = parseInt(hourOneArray[0], 10);
        const minuteOne = parseInt(hourOneArray[1], 10);
        const hourTwo = parseInt(hourTwoArray[0], 10);
        const minuteTwo = parseInt(hourTwoArray[1], 10);
        const timeInMinutesOne = hourOne * 60 + minuteOne;
        const timeInMinutesTwo = hourTwo * 60 + minuteTwo;
        const time = (timeInMinutesOne - timeInMinutesTwo) / 60;

        return this.hoursDecimalToTime(time);
    }

    timeAddition(timeOne, timeTwo) {
        const hourOneArray: any = timeOne.split(':');
        const hourTwoArray: any = timeTwo.split(':');
        const firstChar1 = hourOneArray[0].charAt(0);
        const firstChar2 = hourTwoArray[0].charAt(0);
        let hourOne, minuteOne, timeInMinutesOne, hourTwo, minuteTwo, timeInMinutesTwo;

        hourOne = Math.abs(hourOneArray[0]);
        minuteOne = Math.abs(hourOneArray[1]);
        timeInMinutesOne = hourOne * 60 + minuteOne;
        hourTwo = Math.abs(hourTwoArray[0]);
        minuteTwo = Math.abs(hourTwoArray[1]);
        timeInMinutesTwo = hourTwo * 60 + minuteTwo;

        if (firstChar1 === '-') {
            timeInMinutesOne = timeInMinutesOne * (-1);
        }
        if (firstChar2 === '-') {
            timeInMinutesTwo = timeInMinutesTwo * (-1);
        }

        const time = (timeInMinutesOne + timeInMinutesTwo) / 60;
        return this.hoursDecimalToTime(time);
    }

    hoursDecimalToTime(hoursDecimal) {
        let time: any = '';
        let hours: any = Math.trunc(hoursDecimal);
        let minutes: any = '';

        let decimalMinutes = parseFloat(hoursDecimal) - hours;

        if (decimalMinutes >= 0) {
            minutes = Math.round(decimalMinutes * 60);

            if (hours >= 0 && hours < 10) {
                hours = `0${hours}`;
            } else if (hours < 0 && hours > -10) {
                hours *= -1;
                hours = `-0${hours}`;
            }
        } else {
            decimalMinutes *= -1;
            minutes = Math.round(decimalMinutes * 60);

            if (hours <= 0 && hours > -10) {
                hours *= -1;
                hours = `-0${hours}`;
            }
        }

        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        time = `${hours}:${minutes}`;

        return time;
    }

    hoursTimeToDecimal(hoursTime) {
        const hoursTimeArray: any = hoursTime.split(':');
        const hours: any = parseInt(hoursTimeArray[0], 10);
        const minutes: any = parseInt(hoursTimeArray[1], 10);
        let hoursFormat: any = 0;

        if (hoursTime.charAt(0) === '-') {
            hoursFormat = hours - minutes / 60;
        } else {
            hoursFormat = hours + minutes / 60;
        }

        return parseFloat(hoursFormat.toFixed(2));
    }

    orderDate(dateOne, dateTwo) {
        let first = moment(dateOne, 'YYYY/MM/DD');
        let last = moment(dateTwo, 'YYYY/MM/DD');

        if (first.isAfter(last)) {
            const aux = dateOne;
            first = dateTwo;
            last = aux;
        }

        return [first, last];
    }

    totalTimeByDateTime(dateTimeBegin, dateTimeEnd) {
        const initial = moment(dateTimeBegin);
        const end = moment(dateTimeEnd);

        // calculate the difference
        const ms = end.diff(initial);

        // calculate the duration
        const d = moment.duration(ms);

        // format a string result
        return Math.floor(d.asHours()) + moment.utc(ms).format(':mm');
    }

    moneyFormat(value, symbol = true) {
        const money = new Intl.NumberFormat(environment.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);

        if (symbol) {
            // precisa ser assim para não quebrar na impressora termica. Não usar o currency do number format
            return `${this.CURRENCY_SYMBOL}${money}`;
        }

        return `${money}`;

    }

    guidGenerate() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    compartilharPreAposta(codigo) {
        const dataToSend = {
            message: `[${config.BANCA_NOME}] PRÉ APOSTA: ${codigo}`,
            data: `[${config.BANCA_NOME}] PRÉ APOSTA: ${codigo}`,
            action: 'shareURL'
        };
        WeebetMessage.postMessage(JSON.stringify(dataToSend));
    }

    sharedTicket(aposta, file) {
        let url;
        if (aposta.tipo === 'loteria') {
            url = `https://${config.HOST}/aposta/${aposta.codigo}`;
        } else {
            url = `https://${config.SHARED_URL}/bilhete/${aposta.codigo}`;
        }

        let message = `\r${config.BANCA_NOME} \n\nSeu Bilhete: \n${url} \n`;
        if (this.casaDasApostasId) {
            message += `\nCasa das Apostas: \nhttp://casadasapostas.net/bilhete?banca=${this.casaDasApostasId}&codigo=${aposta.codigo}`;
        }

        const dataToSend = {
            message: message,
            file: file,
            data: url,
            action: 'shareURL'
        };

        WeebetMessage.postMessage(JSON.stringify(dataToSend));
    }

    sharedDepositoPix(file) {
        const dataToSend = {
            message: `Deposito PIX`,
            file: file,
            data: `Qrcode para deposito PIX`,
            action: 'shareURL'
        };
        WeebetMessage.postMessage(JSON.stringify(dataToSend));
    }

    sharedRecargaCartao(recarga, file) {
        const dataToSend = {
            message: `Comprovante de Recarga`,
            file: file,
            data: `Comprovante de Recarga`,
            action: 'shareURL'
        };
        WeebetMessage.postMessage(JSON.stringify(dataToSend));
    }

    shareFile(message, file) {
        const dataToSend = {
            message: message,
            file: file,
            data: message,
            action: 'shareURL'
        };
        WeebetMessage.postMessage(JSON.stringify(dataToSend));
    }

    sendExternalUrl(url) {
        const dataToSend = {
            message: `URL Externa`,
            data: url,
            action: 'externalURL'
        };
        WeebetMessage.postMessage(JSON.stringify(dataToSend));
    }

    dateFormat(date: string, format?: string) {
        return format ? moment(date).format(format) : moment(date).format();
    }

    calcularPremioLoteria(valor, cotacao) {
        let result = valor * cotacao;

        if (result > this.opcoes.valor_max_premio_loterias) {
            result = this.opcoes.valor_max_premio_loterias;
        }

        return this.moneyFormat(result);
    }

    calcularPremioLiquidoLoteria(valor, cotacao, percentualPremio) {
        let result = valor * cotacao;

        if (result > this.opcoes.valor_max_premio_loterias) {
            result = this.opcoes.valor_max_premio_loterias;
        }

        result = result * (100 - percentualPremio) / 100;

        return this.moneyFormat(result);
    }

    removerAcentos(stringToSanitize) {
        return stringToSanitize.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    injectBetbyScript(fileUrl: string) {
        return new Promise((resolve, reject) => {

            const existingScript = document.querySelector(`script[src="${fileUrl}"]`);
            if (existingScript) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = fileUrl;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}
