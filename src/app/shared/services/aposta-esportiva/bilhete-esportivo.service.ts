import { Injectable } from '@angular/core';

import { ItemBilheteEsportivo } from '../../../models';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BilheteEsportivoService {
    private itensSource = new BehaviorSubject<ItemBilheteEsportivo[]>([]);
    itensAtuais = this.itensSource.asObservable();

    constructor() {
        const itens = this.getItens();

        if (itens) {
            this.atualizarItens(itens);
        }
    }

    atualizarItens(itens): void {
        const itensSerializado = JSON.stringify(itens);
        localStorage.setItem('itens-bilhete-esportivo', itensSerializado);

        this.itensSource.next(itens);
    }

    getItens() {
        return JSON.parse(localStorage.getItem('itens-bilhete-esportivo'));
    }
}
