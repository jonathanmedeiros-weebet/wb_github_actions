import { Pipe, PipeTransform } from '@angular/core';

import { ParametrosLocaisService } from '../services/parametros-locais.service';

@Pipe({
    name: 'tipoApostaEsports'
})
export class TipoApostaEsportsPipe implements PipeTransform {

    constructor(private paramsService: ParametrosLocaisService) { }

    transform(value: any, timeA: string, timeB: string): any {
        let result = '';
        const tiposAposta = this.paramsService.getTiposAposta();

        if (tiposAposta[value]) {
            const nome = tiposAposta[value].nome;
            result = nome;

            if (nome.search(/casa/ig) >= 0) {
                result = nome.replace(/casa/ig, timeA);
            }
            if (nome.search(/fora/ig) >= 0) {
                result = nome.replace(/fora/ig, timeB);
            }
        }

        return result;
    }
}
