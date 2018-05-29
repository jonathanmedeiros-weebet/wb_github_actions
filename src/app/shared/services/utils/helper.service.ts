import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable()
export class HelperService {

    constructor() { }

    timeSubtraction(timeOne, timeTwo) {
        const hourOneArray: any = timeOne.split(':');
        const hourTwoArray: any = timeTwo.split(':');

        const hourOne = parseInt(hourOneArray[0]);
        const minuteOne = parseInt(hourOneArray[1]);
        const hourTwo = parseInt(hourTwoArray[0]);
        const minuteTwo = parseInt(hourTwoArray[1]);
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

        if (firstChar1 === "-") {
            timeInMinutesOne = timeInMinutesOne * (-1);
        }
        if (firstChar2 === "-") {
            timeInMinutesTwo = timeInMinutesTwo * (-1);
        }

        let time = (timeInMinutesOne + timeInMinutesTwo) / 60;
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
        let hoursTimeArray: any = hoursTime.split(':');
        let hours: any = parseInt(hoursTimeArray[0]);
        let minutes: any = parseInt(hoursTimeArray[1]);
        let hoursFormat: any = 0;

        if (hoursTime.charAt(0) == '-') {
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
            let aux = dateOne;
            first = dateTwo;
            last = aux;
        }

        return [first, last];
    }

    totalTimeByDateTime(dateTimeBegin, dateTimeEnd) {
        let initial = moment(dateTimeBegin);
        let end = moment(dateTimeEnd);

        // calculate the difference
        let ms = end.diff(initial);

        // calculate the duration
        let d = moment.duration(ms);

        // format a string result
        return Math.floor(d.asHours()) + moment.utc(ms).format(':mm');
    }
}
