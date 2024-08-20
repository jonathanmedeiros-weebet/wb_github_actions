import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'formatarPromocao'
})
export class FormatarPromocaoPipe implements PipeTransform {

    transform(fornecedor: any): string {
        let promocaoFormatada = '';
        switch (fornecedor) {
            case 'manual_bonus':
                promocaoFormatada = 'Bônus Manual';
                break;
            case 'cadastro_bonus':
                promocaoFormatada = 'Bônus Cadastro';
                break;
            case 'primeiro_deposito_bonus':
                promocaoFormatada = 'Bônus Primeiro Depósito';
                break;
            case 'rodada_gratis_manual':
                promocaoFormatada = 'Bônus Rodada Grátis';
                break;
            case 'primeiro_deposito_rodada_gratis':
                promocaoFormatada = 'Bônus Rodada Grátis';
                break;
            case 'cadastro_rodada_gratis':
                promocaoFormatada = 'Bônus Rodada Grátis';
                break;
        }
        return promocaoFormatada;
    }
}
