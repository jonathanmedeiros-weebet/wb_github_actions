import { ItemApostaEsportiva } from './item-aposta-esportiva';

export class ApostaEsportiva {
    id: number;
    itens: ItemApostaEsportiva[] = [];
    cambistaId: number;
    apostador: string;
    horario: string;
    ativo: boolean;
    telefone: string;
    valor = 0;
    cotacao = 0;
    premio = 0;
    comissao = 0;
    comissao_gerente = 0;
    pago: boolean;
    resultado: string;
    combinacao: string;
    num_jogos: number;
    num_reimpressoes: number;
    status_pagamento: string;
    versao_app = '1.0';
    chave: string;
}
