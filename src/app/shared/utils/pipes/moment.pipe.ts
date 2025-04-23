import {Pipe, PipeTransform} from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'moment'
})
export class MomentPipe implements PipeTransform {
    transform(value: any, format?: any, calendar = false): any {
        let result: string = null;

        if (value && !calendar) {
            result = moment(value).format(format);
        }

        moment.updateLocale('pt', {
            weekdays: [
                'Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'
            ]
        });

        if (value && calendar) {
            result = moment(value).calendar({
                sameDay: '[Hoje]',
                nextDay: '[Amanhã]',
                nextWeek: 'dddd',
                lastDay: '[Ontem]',
                lastWeek: '[Último] dddd',
                sameElse: 'DD/MM/YYYY'
            });
        }

        return result;
    }
}
