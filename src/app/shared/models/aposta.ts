import { Item } from './item';

export class Aposta {
    constructor() { }

    itens: Item[] = [];
    sorteioId: number;
    chave: string = "xxx";
    cambistaId: number;
    apostador: string;
    telefone: string;
    versao_app: string = "1.0";
    valor: number = 0;
    premio: number = 0;
}
