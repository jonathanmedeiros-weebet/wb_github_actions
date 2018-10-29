import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    private open = true;
    private isOpenSource;
    isOpen;
    private itensSource = new BehaviorSubject<any>({
        contexto: 'esportes',
        itens: []
    });
    itens = this.itensSource.asObservable();

    constructor() {
        const width = window.innerWidth;
        this.open = width > 667 ? true : false;
        this.isOpenSource = new BehaviorSubject<boolean>(this.open);
        this.isOpen = this.isOpenSource.asObservable();
    }

    toggle(): void {
        this.open = !this.open;
        this.isOpenSource.next(this.open);
    }

    changeItens(itens, contexto) {
        this.itensSource.next({
            itens: itens,
            contexto: contexto
        });
    }
}
