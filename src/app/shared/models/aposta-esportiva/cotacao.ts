import { Jogo } from './jogo';

export class Cotacao {
    _id: any;
    chave: string;
    nome: string;
    label: any;
    valor: number;
    valorFinal: number;
    jogoId: number;
    jogo: Jogo;
}
