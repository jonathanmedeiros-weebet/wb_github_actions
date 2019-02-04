import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'calcularCotacao'
})
export class CalcularCotacaoPipe implements PipeTransform {

    transform(value: number, chave: string, jogoId: number, favorito: string, aoVivo?: boolean): string {
        let result = value;
        const cotacoesLocais = JSON.parse(localStorage.getItem('cotacoes_locais'));
        const tiposAposta = JSON.parse(localStorage.getItem('tipos_aposta'));
        const opcoes = JSON.parse(localStorage.getItem('opcoes'));
        const tipoAposta = tiposAposta[chave];

        // Cotacação Local
        if (cotacoesLocais[jogoId] && cotacoesLocais[jogoId][chave]) {
            result = parseFloat(cotacoesLocais[jogoId][chave].valor);
        }

        if (tipoAposta) {
            if (aoVivo) {
                // Fator ao vivo
                let fatorAoVivo = parseFloat(tipoAposta.fator_ao_vivo);
                if (isNaN(fatorAoVivo) || !fatorAoVivo) {
                    fatorAoVivo = 1;
                }
                result *= fatorAoVivo;
            } else {
                // Fator
                let fator = parseFloat(tipoAposta.fator);
                if (!fator || isNaN(fator)) {
                    fator = 1;
                }
                result *= fator;

                if (favorito) {
                    // Favorito e Zebra
                    const cotacoesFavoritoZebra = [
                        'casa_90',
                        'fora_90',
                        'casa_empate_90',
                        'fora_empate_90'
                    ];

                    if (cotacoesFavoritoZebra.includes(chave)) {
                        if (/casa/.test(chave)) {
                            result *= favorito === 'casa' ? opcoes.fator_favorito : opcoes.fator_zebra;
                        } else {
                            result *= favorito === 'fora' ? opcoes.fator_favorito : opcoes.fator_zebra;
                        }
                    }
                }
            }

            // Limite
            if (result > tipoAposta.limite) {
                result = parseFloat(tipoAposta.limite);
            }

            if (result < 1) {
                result = 1;
            }
        }

        return result.toFixed(2);
    }
}
