import {Pipe, PipeTransform} from '@angular/core';
import {trim} from 'lodash';

@Pipe({
    name: 'formatarNomeJogoCassino'
})
export class FormatarNomeJogoCassinoPipe implements PipeTransform {

    transform(nomeJogo: any): string {
        if (nomeJogo.includes('Live')) {
            const nomeJogoFormatado = nomeJogo.split('-');
            return trim(nomeJogoFormatado[1]);
        } else {
            return nomeJogo;
        }
    }

}
