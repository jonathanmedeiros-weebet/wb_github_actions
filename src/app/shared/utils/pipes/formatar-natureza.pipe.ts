import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'formatarNatureza'
})
export class FormatarNaturezaPipe implements PipeTransform {

    transform(natureza: any): string {
        let naturezaFormatada = '';
        switch (natureza) {
            case 'MOVIMENTACAO':
                naturezaFormatada = 'Movimentação';
                break;
            case 'APOSTA':
                naturezaFormatada = 'Aposta';
                break;
            case 'CANCELAMENTO_APOSTA':
                naturezaFormatada = 'Cancelamento Aposta';
                break;
            case 'REATIVACAO_APOSTA':
                naturezaFormatada = 'Reativação Aposta';
                break;
            case 'CREDITO_CARTAO_APOSTA':
                naturezaFormatada = 'Recarga Cartão Aposta';
                break;
            case 'DEBITO_CARTAO_APOSTA':
                naturezaFormatada = 'Saque Cartão Aposta';
                break;
            case 'PREMIO':
                naturezaFormatada = 'Prêmio';
                break;
            case 'AJUSTE_PREMIO':
                naturezaFormatada = 'Ajuste Prêmio';
                break;
            case 'CANCELAMENTO_PREMIO':
                naturezaFormatada = 'Cancelamento Prêmio';
                break;
            case 'COMISSAO_APOSTA':
                naturezaFormatada = 'Comissão Aposta';
                break;
            case 'AJUSTE_COMISSAO':
                naturezaFormatada = 'Ajuste Comissão';
                break;
            case 'DEPOSITO_CLIENTE':
                naturezaFormatada = 'Depósito';
                break;
            case 'SAQUE_CLIENTE':
                naturezaFormatada = 'Saque';
                break;
            case 'CREDITO_BONUS':
                naturezaFormatada = 'Bônus';
                break;
            case 'CANCELAMENTO_SAQUE':
                naturezaFormatada = 'Cancelamento de Saque';
                break;
            case 'CREDITO_INDICACAO':
                naturezaFormatada = 'Comissão do indique e ganhe';
                break;
            default:
                naturezaFormatada = 'Movimentação';
                break;
        }
        return naturezaFormatada;
    }

}
