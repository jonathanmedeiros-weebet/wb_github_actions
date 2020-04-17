import { Component, OnInit } from '@angular/core';

import { PaginaService } from './../../services';
import { Pagina } from './../../models';

@Component({
    templateUrl: './deposito.component.html'
})
export class DepositoComponent implements OnInit {
    pagina = new Pagina();

    constructor(
        private paginaService: PaginaService
    ) { }

    ngOnInit() {
        this.paginaService.getPaginaPorChave('deposito').subscribe(pagina => this.pagina = pagina);
    }
}
