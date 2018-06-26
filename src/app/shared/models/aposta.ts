import { Item } from './item';

export class Aposta {
    constructor(chave) {
        this.chave = chave;
    }

    itens: Item[] = [];
    sorteioId: number;
    chave: string;
    cambistaId: number;
    apostador: string;
    telefone: string;
    versao_app: string = "1.0";
    valor: number = 0;
    premio: number = 0;
    ativo: boolean;
    pago: boolean;
    horario: string;
    resultado: string;
    tipo: string;
}
