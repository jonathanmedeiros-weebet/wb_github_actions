import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    private open = false;
    private isOpenSource = new BehaviorSubject<boolean>(this.open);
    isOpen = this.isOpenSource.asObservable();

    constructor() { }

    toggle(): void {
        this.open = !this.open;
        this.isOpenSource.next(this.open);
    }
}
