import { Jogo } from './jogo';

export class Cotacao {
    _id: any;
    chave: string;
    nome: string;
    label: any;
    valor: number;
    valorFinal: any;
    jogoId: number;
    jogo: Jogo;
}
