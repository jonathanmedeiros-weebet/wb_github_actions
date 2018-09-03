import { Pipe, PipeTransform } from '@angular/core';

import { Cotacao } from './../../models';

@Pipe({
    name: 'calcularCotacao'
})
export class CalcularCotacaoPipe implements PipeTransform {

    transform(value: number, chave: string, jogoId: number, cotacoes: Cotacao[]): string {
        let result = value;
        const cotacoesLocais = JSON.parse(localStorage.getItem('cotacoes-locais'));
        const tiposAposta = JSON.parse(localStorage.getItem('tipos-aposta'));
        const opcoes = JSON.parse(localStorage.getItem('opcoes'));

        const tipoAposta = tiposAposta[chave];

        // Cotacação Local
        if (cotacoesLocais[`${jogoId}${chave}`]) {
            result = parseFloat(cotacoesLocais[`${jogoId}${chave}`]);
        }

        if (tipoAposta) {
            // Fator
            result *= parseFloat(tipoAposta.fator);

            // Limite
            if (result > tipoAposta.limite) {
                result = parseFloat(tipoAposta.limite);
            }

            // Favorito e Zebra
            const cotacoesFavoritoZebra = [
                'casa_90',
                'fora_90'
            ];

            if (cotacoesFavoritoZebra.includes(chave)) {
                const cotacaoCasaFora = [
                    'casa_90',
                    'fora_90'
                ];
                const filtrados = cotacoes.filter(cotacao => cotacaoCasaFora.includes(cotacao.chave));
                const casa = filtrados.find(cotacao => cotacao.chave === 'casa_90');
                const fora = filtrados.find(cotacao => cotacao.chave === 'fora_90');

                let favorito;
                if (casa.valor < fora.valor) {
                    favorito = 'casa';
                } else {
                    favorito = 'fora';
                }

                if (/casa/.test(chave)) {
                    result *= favorito === 'casa' ? opcoes.fator_favorito : opcoes.fator_zebra;
                } else {
                    result *= favorito === 'fora' ? opcoes.fator_favorito : opcoes.fator_zebra;
                }
            }
        }

        return result.toFixed(2);
    }
}
