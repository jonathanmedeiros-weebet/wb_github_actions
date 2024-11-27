import { Jogo } from './jogo';

export class Cotacao {
    _id: any;
    chave: string;
    nome: string;
    nome_pt: string;
    nome_en: string;
    nome_es: string;
    label: any;
    valor: number;
    valorFinal: any;
    jogoId: number;
    jogo: Jogo;
}
