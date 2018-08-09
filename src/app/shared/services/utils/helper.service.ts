import { Injectable } from '@angular/core';

import { config } from './../../config';
import * as moment from 'moment';

@Injectable()
export class HelperService {

    constructor() { }

    static timeSubtraction(timeOne, timeTwo) {
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

    static timeAddition(timeOne, timeTwo) {
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

    static hoursDecimalToTime(hoursDecimal) {
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

    static hoursTimeToDecimal(hoursTime) {
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

    static orderDate(dateOne, dateTwo) {
        let first = moment(dateOne, 'YYYY/MM/DD');
        let last = moment(dateTwo, 'YYYY/MM/DD');

        if (first.isAfter(last)) {
            const aux = dateOne;
            first = dateTwo;
            last = aux;
        }

        return [first, last];
    }

    static totalTimeByDateTime(dateTimeBegin, dateTimeEnd) {
        const initial = moment(dateTimeBegin);
        const end = moment(dateTimeEnd);

        // calculate the difference
        const ms = end.diff(initial);

        // calculate the duration
        const d = moment.duration(ms);

        // format a string result
        return Math.floor(d.asHours()) + moment.utc(ms).format(':mm');
    }

    static moneyFormat(value) {
        const money = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2
        }).format(value);


        // precisa ser assim para não quebrar na improssa termica. Não usar o currency do number format
        return `R$ ${money}`;
    }

    static guidGenerate() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    static sharedLotteryTicket(aposta) {
        parent.postMessage(
            {
                data: `${config.HOST}/aposta/${aposta.chave}`,
                action: 'shareURL'
            },
            'file://'
        );
    }

    static sharedSportsTicket(aposta) {
        parent.postMessage(
            {
                data: `${config.HOST}/aposta/${aposta.chave}`,
                action: 'shareURL'
            },
            'file://'
        );
    }
}
