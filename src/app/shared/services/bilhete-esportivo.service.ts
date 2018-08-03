import { Injectable, Output, EventEmitter } from '@angular/core';

import { BilheteEsportivo } from '../../models';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BilheteEsportivoService {
    private bilheteSource = new BehaviorSubject<BilheteEsportivo>(new BilheteEsportivo());
    bilheteAtual = this.bilheteSource.asObservable();

    constructor() {
        const bilhete = this.getBilheteEsportivo();

        if (bilhete) {
            this.atualizarBilhete(bilhete);
        }
    }

    atualizarBilhete(bilhete): void {
        const bilheteSerializado = JSON.stringify(bilhete);
        localStorage.setItem('bilhete-esportivo', bilheteSerializado);

        this.bilheteSource.next(bilhete);
    }

    getBilheteEsportivo() {
        return JSON.parse(localStorage.getItem('bilhete-esportivo'));
    }
}
