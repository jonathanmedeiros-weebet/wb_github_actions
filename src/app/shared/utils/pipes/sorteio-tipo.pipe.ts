import { Pipe, PipeTransform } from '@angular/core';

import { ParametrosLocaisService } from './../../services/parametros-locais.service';

@Pipe({
    name: 'sorteioTipo'
})
export class SorteioTipoPipe implements PipeTransform {

    constructor(private paramsService: ParametrosLocaisService) { }

    transform(value: any): any {
        if (value === 'seninha') {
            return this.paramsService.getSeninhaNome();
        } else {
            return this.paramsService.getQuininhaNome();
        }
    }
}
