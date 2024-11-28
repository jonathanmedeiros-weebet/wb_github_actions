import { Pipe, PipeTransform } from '@angular/core';

import { ParametrosLocaisService } from './../../services/parametros-locais.service';

@Pipe({
    name: 'oddCategoria'
})
export class OddCategoriaPipe implements PipeTransform {

    constructor(private paramsService: ParametrosLocaisService) { }

    transform(value: any, language?: string): any {
        const tiposAposta = this.paramsService.getTiposAposta();

        if (!tiposAposta[value]) {
            return '';
        }

        if (language) {
            return tiposAposta[value][`cat_nome_${language}`] ?? tiposAposta[value][`cat_nome_pt`];
        }

        return tiposAposta[value].cat_nome;
    }
}
