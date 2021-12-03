import { Injectable } from '@angular/core';

import { DesafioItemBilhete } from '../../../models';
import { BehaviorSubject } from 'rxjs';
import {MenuFooterService} from '../utils/menu-footer.service';

@Injectable()
export class DesafioBilheteService {
    private itensSource = new BehaviorSubject<DesafioItemBilhete[]>([]);
    itensAtuais = this.itensSource.asObservable();

    constructor(
        private menuFooterService: MenuFooterService
    ) { }

    atualizarItens(itens): void {
        this.menuFooterService.atualizarQuantidade(itens.length);
        this.itensSource.next(itens);
    }
}
