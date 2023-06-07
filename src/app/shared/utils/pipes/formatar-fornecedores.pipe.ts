import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'formatarFornecedores'
})
export class FormatarFornecedoresPipe implements PipeTransform {

    transform(fornecedor: any): string {
        let fornecedorFormatado = '';
        switch (fornecedor) {
            case '7mojos':
                fornecedorFormatado = '7Mojos';
                break;
            case 'betsgames':
                fornecedorFormatado = 'BetGames';
                break;
            case 'betsoft':
                fornecedorFormatado = 'Betsoft';
                break;
            case 'caleta':
                fornecedorFormatado = 'Caleta';
                break;
            case 'crazybillions':
                fornecedorFormatado = 'Crazzy Billions';
                break;
            case 'dragongaming':
                fornecedorFormatado = 'Dragon Gaming';
                break;
            case 'ezugi':
                fornecedorFormatado = 'Ezugi';
                break;
            case 'gamzix':
                fornecedorFormatado = 'Gamzix';
                break;
            case 'high5games':
                fornecedorFormatado = 'High 5 Games';
                break;
            case 'mascot':
                fornecedorFormatado = 'Mascot';
                break;
            case 'ortiz':
                fornecedorFormatado = 'Ortiz';
                break;
            case 'pragmatic':
                fornecedorFormatado = 'Pragmatic';
                break;
            case 'salsa':
                fornecedorFormatado = 'Salsa Studio';
                break;
            case 'smartsoft':
                fornecedorFormatado = 'Smartsoft';
                break;
            case 'spribe':
                fornecedorFormatado = 'Spribe';
                break;
            case 'tomhorn':
                fornecedorFormatado = 'Tom Horn';
                break;
            case 'evoplay':
                fornecedorFormatado = 'Evoplay';
                break;
            case 'evolution':
                fornecedorFormatado = 'Evolution';
                break;
        }
        return fornecedorFormatado;
    }
}
