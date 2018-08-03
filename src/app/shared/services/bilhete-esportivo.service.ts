import { Injectable, Output, EventEmitter } from '@angular/core';

import { BilheteEsportivo } from '../../models';

@Injectable()
export class BilheteEsportivoService {
    @Output() emitirBilhete: EventEmitter<BilheteEsportivo> = new EventEmitter();
    bilhete: BilheteEsportivo = new BilheteEsportivo();

    constructor() { }

    atualizarBilhete(bilhete): void {
        this.bilhete = bilhete;

        this.emitirBilhete.emit(this.bilhete);
    }

    getBilhete() {
        return this.bilhete;
    }
}
