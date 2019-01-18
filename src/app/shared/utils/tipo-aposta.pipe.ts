import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tipoAposta'
})
export class TipoApostaPipe implements PipeTransform {

    transform(value: any): any {
        const tiposAposta = JSON.parse(localStorage.getItem('tipos_aposta'));

        return tiposAposta[value] ? tiposAposta[value].nome : '';
    }
}
