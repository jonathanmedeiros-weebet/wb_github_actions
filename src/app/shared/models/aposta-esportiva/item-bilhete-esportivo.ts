import { Cotacao } from './cotacao';

export class ItemBilheteEsportivo {
    constructor() { }

    jogo_nome: string;
    jogo_id: number;
    ao_vivo: boolean;
    cotacao: Cotacao;
}
