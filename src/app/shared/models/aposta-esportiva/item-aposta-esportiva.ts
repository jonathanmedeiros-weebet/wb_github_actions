import { Jogo } from './jogo';

export class ItemApostaEsportiva {
    constructor() { }

    aposta_id: number;
    aposta_tipo_id: number;
    jogo_id: number;
    jogo: Jogo;
    valor: number;
    preco: number;
    resultado: string;
    ao_vivo: boolean;
    removido: boolean;
}
