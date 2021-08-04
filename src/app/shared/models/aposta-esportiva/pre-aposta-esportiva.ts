import { ItemPreApostaEsportiva } from './item-pre-aposta-esportiva';

export class PreApostaEsportiva {
    id: number;
    codigo: string;
    apostador: string;
    horario: string;
    cotacao: number;
    valor: number;
    premio: number;
    tipo: string;
    itens: ItemPreApostaEsportiva[] = [];
}
