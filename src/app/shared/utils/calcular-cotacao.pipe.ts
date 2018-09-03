import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'calcularCotacao'
})
export class CalcularCotacaoPipe implements PipeTransform {

    transform(value: number, jogoId: string, chave: string): string {
        let result = value;
        const cotacoesLocais = JSON.parse(localStorage.getItem('cotacoes-locais'));
        const tiposAposta = JSON.parse(localStorage.getItem('tipos-aposta'));

        if (cotacoesLocais[`${jogoId}${chave}`]) {
            result = parseFloat(cotacoesLocais[`${jogoId}${chave}`]);
        }

        const tipoAposta = tiposAposta[chave];
        if (tipoAposta) {
            result *= parseFloat(tipoAposta.fator);

            if (result > tipoAposta.limite) {
                result = parseFloat(tipoAposta.limite);
            }
        }

        return result.toFixed(2);
    }
}
