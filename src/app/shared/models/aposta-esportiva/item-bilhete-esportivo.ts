import { Jogo } from './jogo';
import { Cotacao } from './cotacao';

export class ItemBilheteEsportivo {
    constructor() { }

    ao_vivo: boolean;
    jogo_id: any;
    cotacao: Cotacao;
    jogo: Jogo;
}
