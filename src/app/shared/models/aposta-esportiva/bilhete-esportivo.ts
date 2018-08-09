import { ItemBilheteEsportivo } from './item-bilhete-esportivo';
import { HelperService } from '../../services/utils/helper.service';

export class BilheteEsportivo {
    cambistaId: number;
    apostador: string;
    valor = 0;
    horario: string;
    itens: ItemBilheteEsportivo[] = [];
    versao_app = '1.0';
}
