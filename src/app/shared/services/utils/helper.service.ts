import { Injectable } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';

import { environment } from './../../../../environments/environment';
import { config } from './../../config';
import * as moment from 'moment';

import { ParametrosLocaisService } from '../parametros-locais.service';

@Injectable({
    providedIn: 'root',
})
export class HelperService {
    CURRENCY_SYMBOL = getCurrencySymbol(environment.currencyCode, 'wide');

    constructor(private paramsService: ParametrosLocaisService) { }

    calcularCotacao(value: number, chave: string, jogoEventId: number, favorito: string, aoVivo?: boolean): number {
        let result = value;
        const cotacoesLocais = this.paramsService.getCotacoesLocais();
        const tiposAposta = this.paramsService.getTiposAposta();
        const opcoes = this.paramsService.getOpcoes();

        const tipoAposta = tiposAposta[chave];

        // Cotacação Local
        if (cotacoesLocais[jogoEventId] && cotacoesLocais[jogoEventId][chave]) {
            result = parseFloat(cotacoesLocais[jogoEventId][chave].valor);
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
                            result *= favorito === 'casa' ? opcoes.fator_favorito : opcoes.fator_zebra;
                        } else {
                            result *= favorito === 'fora' ? opcoes.fator_favorito : opcoes.fator_zebra;
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
        parent.postMessage(
            {
                data: `[${config.BANCA_NOME}] PRÉ APOSTA: ${codigo}`,
                action: 'shareURL'
            },
            '*'
        );
    }

    sharedTicket(aposta, file) {
        let data;
        if (aposta.tipo === 'loteria') {
            data = `http:${config.HOST}/aposta/${aposta.codigo}`;
        } else {
            data = `${location.origin}/bilhete/${aposta.codigo}`;
        }

        parent.postMessage(
            {
                message: `${config.BANCA_NOME}: ${data}`,
                file: file,
                data: data,
                action: 'shareURL'
            },
            '*'
        );
    }

    sharedRecargaCartao(recarga, file) {
        parent.postMessage(
            {
                message: `Comprovante de Recarga`,
                file: file,
                data: `Comprovante de Recarga`,
                action: 'shareURL'
            },
            '*'
        );
    }

    sharedCasaDasApostaUrl(url) {
        parent.postMessage(
            {
                message: `Casa das Apostas`,
                data: `[${config.BANCA_NOME}] Casa das Apostas: ${url}`,
                action: 'shareURL'
            },
            '*'
        );
    }


    dateFormat(date: string, format?: string) {
        return format ? moment(date).format(format) : moment(date).format();
    }

    calcularPremioLoteria(valor, cotacao) {
        const opcoes = this.paramsService.getOpcoes();
        let result = valor * cotacao;

        if (result > opcoes.valor_max_premio_loterias) {
            result = opcoes.valor_max_premio_loterias;
        }

        return this.moneyFormat(result);
    }

    removerAcentos(stringToSanitize) {
        return stringToSanitize.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
}
