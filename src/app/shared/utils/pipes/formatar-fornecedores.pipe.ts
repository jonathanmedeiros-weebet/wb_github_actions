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
                fornecedorFormatado = 'Crazy Billions';
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
            case 'pgsoft':
                fornecedorFormatado = 'PG Soft';
                break;
            case 'blueprint':
                fornecedorFormatado = 'Blueprint';
                break;
            case 'rubyplay':
                fornecedorFormatado = 'Ruby Play';
                break;
            case 'soline':
                fornecedorFormatado = 'Soline';
                break;
            case 'mga':
                fornecedorFormatado = 'MGA';
                break;
            case 'espressogames':
                fornecedorFormatado = 'Espresso Games';
                break;
            case 'beterlive':
                fornecedorFormatado = 'Beter Live';
                break;
            case 'hacksaw':
                fornecedorFormatado = 'Hacksaw';
                break;
            case 'aviatrix':
                fornecedorFormatado = 'Aviatrix';
                break;
            case 'vivogaming':
                fornecedorFormatado = 'Vivo Gaming';
                break;
            case 'absolutelivegaming':
                fornecedorFormatado = 'Absolute Live Gaming';
                break;
            case 'pascal':
                fornecedorFormatado = 'Pascal';
                break
            case 'playtech':
                fornecedorFormatado = 'Playtech';
                break
            case 'wazdan':
                fornecedorFormatado = 'Wazdan';
                break
            case 'kagaming':
                fornecedorFormatado = 'KA Gaming';
                break

        }
        return fornecedorFormatado;
    }
}
