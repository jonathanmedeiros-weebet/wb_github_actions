import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'calcularCotacao'
})
export class CalcularCotacaoPipe implements PipeTransform {

    transform(value: number, jogoId: string, chave: string): number {
        let result: number = value;
        const cotacoesLocais = JSON.parse(localStorage.getItem('cotacoes-locais'));
        const tiposAposta = JSON.parse(localStorage.getItem('tipos-aposta'));

        if (cotacoesLocais[`${jogoId}${chave}`]) {
            result = parseFloat(cotacoesLocais[`${jogoId}${chave}`]);
        }

        if (tiposAposta[chave]) {
            result *= parseFloat(tiposAposta[chave].fator);
        }

        console.log(typeof result);
        // result = result.toFixed(2);
        return result;
    }
}
