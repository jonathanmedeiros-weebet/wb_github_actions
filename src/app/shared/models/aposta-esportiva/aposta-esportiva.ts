import { ItemApostaEsportiva } from './item-aposta-esportiva';
import { Passador } from '../passador';

export class ApostaEsportiva {
    passador: Passador;
    id: number;
    itens: ItemApostaEsportiva[] = [];
    cambistaId: number;
    cambista: any;
    apostador: string;
    horario: string;
    ativo: boolean;
    telefone: string;
    valor = 0;
    cotacao = 0;
    premio = 0;
    comissao = 0;
    comissao_gerente = 0;
    possibilidade_ganho: number;
    pago: boolean;
    resultado: string;
    combinacao: string;
    num_jogos: number;
    num_reimpressoes: number;
    status_pagamento: string;
    versao_app = '1.0';
    chave: string;
    cartao_aposta: string;
    codigo: string;
    is_bonus: boolean;

    ultima_aposta: string;
}
