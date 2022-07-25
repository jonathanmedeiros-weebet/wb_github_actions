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
        contexto: '',
        itens: []
    });
    itens = this.itensSource.asObservable();

    private collapsed;
    collapsedSource;

    constructor() {
        const width = window.innerWidth;
        this.open = width > 1024;
        this.isOpenSource = new BehaviorSubject<boolean>(this.open);
        this.isOpen = this.isOpenSource.asObservable();

        this.collapsed = !!localStorage.getItem('navigation_callapsed');

        this.collapsedSource = new BehaviorSubject<boolean>(this.collapsed);
    }

    toggle(): void {
        this.open = !this.open;
        this.isOpenSource.next(this.open);
    }

    close(): void {
        this.open = false;
        this.isOpenSource.next(this.open);
    }

    changeItens(dados) {
        this.itensSource.next(dados);
    }

    collapseSidebar() {
        this.collapsed = !this.collapsed;

        this.collapsedSource.next(this.collapsed);

        if (this.collapsed) {
            localStorage.setItem('navigation_callapsed', 'collapsed');
        } else {
            localStorage.removeItem('navigation_callapsed');
        }
    }
}
