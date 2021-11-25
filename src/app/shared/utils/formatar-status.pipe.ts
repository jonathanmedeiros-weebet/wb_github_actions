import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'formatarStatus'
})
export class FormatarStatusPipe implements PipeTransform {

    transform(status: any): string {
        let statusFormatado = '';
        switch (status) {
            case 'PENDENTE':
                statusFormatado = 'Pendente';
                break;
            case 'pending':
                statusFormatado = 'Pendente';
                break;
            case 'PAGO':
                statusFormatado = 'Pago';
                break;
            default:
                statusFormatado = 'Movimentação';
                break;
        }
        return statusFormatado;
    }

}
