import { Pipe, PipeTransform } from '@angular/core';

import { ParametrosLocaisService } from './../../services/parametros-locais.service';

@Pipe({
    name: 'tipoAposta'
})
export class TipoApostaPipe implements PipeTransform {

    constructor(private paramsService: ParametrosLocaisService) { }

    transform(value: any, field = 'nome', language?: string): any {
        const tiposAposta = this.paramsService.getTiposAposta();

        if (!tiposAposta[value]) {
            return '';
        }

        if (language) {
            return tiposAposta[value][`nome_${language}`] ?? tiposAposta[value][`nome_pt`];
        }

        return tiposAposta[value][field];
    }
}
