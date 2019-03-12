import { Jogo } from './jogo';

export class Cotacao {
    _id: any;
    chave: string;
    valor: number;
    jogoId: number;
    jogo: Jogo;
}
