import { Jogo } from './jogo';
import { Cotacao } from './cotacao';

export class ItemBilheteEsportivo {
    constructor() { }

    aoVivo: boolean;
    jogo_id: any;
    cotacao: Cotacao;
    jogo: Jogo;
}
