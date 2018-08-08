import { ItemApostaEsportiva } from './item-aposta-esportiva';

export class ApostaEsportiva {
    itens: ItemApostaEsportiva[] = [];
    cambistaId: number;
    apostador: string;
    horario: string;
    ativo: boolean;
    telefone: string;
    valor = 0;
    preco_final = 0;
    comissa = 0;
    comissao_gerente = 0;
    pago: boolean;
    resultado: string;
    combinacao: string;
    num_jogos: number;
    num_reimpressoes: number;
    status_pagamento: string;
    versao_app = '1.0';
}
