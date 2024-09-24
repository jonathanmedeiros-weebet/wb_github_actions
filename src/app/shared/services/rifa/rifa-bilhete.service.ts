import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DesafioItemBilhete} from '../../models/desafio/desafio-item-bilhete';
import {MenuFooterService} from '../utils/menu-footer.service';
import {ItemBilheteEsportivo} from '../../models/aposta-esportiva/item-bilhete-esportivo';

@Injectable({
  providedIn: 'root'
})
export class RifaBilheteService {

    private sorteioSource = new BehaviorSubject<Object>(null);
    sorteio = this.sorteioSource.asObservable();
    bilheteIsOpen = false;
    private openBilheteSource = new BehaviorSubject<boolean>(false);

    setSorteio(sorteio) {
        this.sorteioSource.next(sorteio);
    }

    get soterio() {
        return this.sorteio;
    }


    constructor(
        private menuFooterService: MenuFooterService
    ) { }

    selecionarSorteio(sorteio) {
        this.setSorteio(sorteio);
    }

    toggleBilhete() {
        this.bilheteIsOpen = !this.bilheteIsOpen;
        this.openBilheteSource.next(this.bilheteIsOpen);
    }
}
