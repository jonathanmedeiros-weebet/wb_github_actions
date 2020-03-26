import { Injectable } from '@angular/core';

import { ItemBilheteEsportivo } from '../../../models';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DesafioBilheteService {
    private itensSource = new BehaviorSubject<ItemBilheteEsportivo[]>([]);
    itensAtuais = this.itensSource.asObservable();

    constructor() { }

    atualizarItens(itens): void {
        this.itensSource.next(itens);
    }
}
