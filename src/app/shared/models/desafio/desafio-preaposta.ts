import { DesafioApostaItem } from './desafio-aposta-item';

export class DesafioPreAposta {
    id: number;
    apostador: string;
    horario: string;
    cotacao: number;
    valor: number;
    premio: number;
    tipo: string;
    itens: DesafioApostaItem[] = [];
}
