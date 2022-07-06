import { Passador } from '../passador';

export class ApostaCasino {
    passador: Passador;
    id: number;
    apostador: string;
    horario: string;
    ativo: boolean;
    telefone: string;
    valor = 0;
    premio = 0;
    comissao = 0;
    pago: boolean;
    resultado: string;
    status_pagamento: string;
    versao_app = '1.0';
    chave: string;
    cartao_aposta: string;
    codigo: string;
    is_bonus: boolean;
    game: string;
}
