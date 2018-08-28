import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'tipoaposta'
})
export class TipoApostaPipe implements PipeTransform {
    transform(value: any): any {
        let result = '';
        const tiposAposta = JSON.parse(localStorage.getItem('tipos-aposta'));

        if (value) {
            result = tiposAposta[value] ? tiposAposta[value].nome : '';
        }

        return result;
    }
}
