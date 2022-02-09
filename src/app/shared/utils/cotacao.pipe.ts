import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'cotacao'
})
export class CotacaoPipe implements PipeTransform {

    transform(cotacao: any): string {
        return cotacao.toFixed(2);
    }

}
