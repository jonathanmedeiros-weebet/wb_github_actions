import { ItemApostaEsportiva } from "./item-aposta-esportiva";

export class ApostaEsportiva {
    constructor(chave) {
        this.chave = chave;
    }

    itens: ItemApostaEsportiva[] = [];
    cambistaId: number;
    apostador: string;
    horario: string;
    ativo: boolean;
    telefone: string;
    valor: number = 0;
    preco_final: number = 0;
    comissao: number = 0;
    comissao_gerente: number = 0;
    pago: boolean;
    resultado: string;
    combinacao: string;
    num_jogos: number;
    num_reimpressoes: number;
    status_pagamento: string;
    chave: string;
    versao_app: string = "1.0";
}
