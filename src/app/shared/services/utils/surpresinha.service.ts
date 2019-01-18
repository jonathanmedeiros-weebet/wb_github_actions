import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SupresinhaService {
    private numerosSource = new BehaviorSubject<any>([]);
    numeros = this.numerosSource.asObservable();

    constructor() { }

    atualizarSupresinha(numeros): void {
        this.numerosSource.next(numeros);
    }
}
