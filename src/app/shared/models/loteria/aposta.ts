import { HelperService } from './../../services/utils/helper.service';
import { Item } from './item';

export class Aposta {
    constructor() {
        this.chave = HelperService.guidGenerate();
    }

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
}
