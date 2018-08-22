import { ItemBilheteEsportivo } from './item-bilhete-esportivo';

export class BilheteEsportivo {
    cambistaId: number;
    apostador: string;
    valor = 0;
    itens: ItemBilheteEsportivo[] = [];
    pre_aposta_id: number;
    versao_app = '1.0';
}
