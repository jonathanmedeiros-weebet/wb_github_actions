import { Acumuladao } from './acumuladao';

export class AcumuladaoAposta {
    id: number;
    ativo: boolean;
    pago: boolean;
    status_pagamento: boolean;
    horario: string;
    cartao_aposta: string;
    apostador: string;
    resultado: string;
    premio: number;
    quantidade_acertos: number;
    valor: number;
    comissao: number;
    passador: any;
    itens: any[];
    acumuladao: Acumuladao;
    codigo: string;
}
