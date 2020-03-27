import { Injectable } from '@angular/core';

import { DesafioItemBilhete } from '../../../models';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DesafioBilheteService {
    private itensSource = new BehaviorSubject<DesafioItemBilhete[]>([]);
    itensAtuais = this.itensSource.asObservable();

    constructor() { }

    atualizarItens(itens): void {
        this.itensSource.next(itens);
    }
}
