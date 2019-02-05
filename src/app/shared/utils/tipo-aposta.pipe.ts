import { Pipe, PipeTransform } from '@angular/core';

import { ParametrosLocais } from './parametros-locais';

@Pipe({
    name: 'tipoAposta'
})
export class TipoApostaPipe implements PipeTransform {

    constructor() { }

    transform(value: any): any {
        const tiposAposta = ParametrosLocais.getTiposAposta();

        return tiposAposta[value] ? tiposAposta[value].nome : '';
    }
}
