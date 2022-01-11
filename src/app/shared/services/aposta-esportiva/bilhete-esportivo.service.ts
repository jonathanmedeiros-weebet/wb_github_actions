import { Injectable } from '@angular/core';

import { ItemBilheteEsportivo } from '../../../models';
import { BehaviorSubject } from 'rxjs';
import {MenuFooterService} from '../utils/menu-footer.service';

@Injectable({
    providedIn: 'root'
})
export class BilheteEsportivoService {
    private itensSource = new BehaviorSubject<ItemBilheteEsportivo[]>([]);
    itensAtuais = this.itensSource.asObservable();
    bilheteIsOpen = false;
    private openBilheteSource = new BehaviorSubject<boolean>(false);
    openBilhete = this.openBilheteSource.asObservable();

    constructor(
        private menuFooterService: MenuFooterService
    ) {
        const itens = this.getItens();

        if (itens) {
            this.atualizarItens(itens);
        }
    }

    atualizarItens(itens): void {
        const itensSerializado = JSON.stringify(itens);
        localStorage.setItem('itens-bilhete-esportivo', itensSerializado);

        this.menuFooterService.atualizarQuantidade(itens.length);

        this.itensSource.next(itens);
    }

    getItens() {
        return JSON.parse(localStorage.getItem('itens-bilhete-esportivo'));
    }

    toggleBilhete() {
        this.bilheteIsOpen = !this.bilheteIsOpen;
        this.openBilheteSource.next(this.bilheteIsOpen);
    }
}
