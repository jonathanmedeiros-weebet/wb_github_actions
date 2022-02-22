import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'depositoStatusPixPipe'
})
export class DepositoStatusPixPipePipe implements PipeTransform {

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
            case 'REPROVADO':
                statusFormatado = 'Reprovado';
                break;
            case 'approved':
                statusFormatado = 'Aprovado';
                break;
            case 'in_process':
                statusFormatado = 'Em Processo';
                break;
            case 'rejected':
                statusFormatado = 'Recusado';
                break;
            case 'CANCELADO':
                statusFormatado = 'Cancelado';
                break;
            default:
                statusFormatado = 'Movimentação';
                break;
        }
        return statusFormatado;
    }

}
