import { ItemBilheteEsportivo } from './item-bilhete-esportivo';
import { HelperService } from '../../services/utils/helper.service';

export class BilheteEsportivo {
    constructor() {
        this.chave = HelperService.guidGenerate();
    }

    cambistaId: number;
    apostador: string;
    valor = 0;
    horario: string;
    itens: ItemBilheteEsportivo[] = [];
    chave: string;
    versao_app = '1.0';
}
