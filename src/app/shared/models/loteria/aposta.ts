import { Item } from './item';

export class Aposta {
    constructor() {
        this.chave = this.guidGenerate();
    }

    id: number;
    itens: Item[] = [];
    sorteioId: number;
    chave: string;
    cambistaId: number;
    apostador: string;
    telefone = '';
    versao_app = '1.0';
    valor = 0;
    premio = 0;
    ativo: boolean;
    pago: boolean;
    horario: string;
    resultado: string;
    tipo: string;
    codigo: string;

    guidGenerate() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}
