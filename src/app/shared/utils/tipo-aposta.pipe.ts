import { Pipe, PipeTransform } from '@angular/core';

import { ParametrosLocaisService } from './../services/parametros-locais.service';

@Pipe({
    name: 'tipoAposta'
})
export class TipoApostaPipe implements PipeTransform {

    constructor(private paramsService: ParametrosLocaisService) { }

    transform(value: any): any {
        const tiposAposta = this.paramsService.getTiposAposta();
        return tiposAposta[value] ? tiposAposta[value].nome : '';
    }
}
