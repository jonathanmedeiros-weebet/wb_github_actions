import {Component, OnDestroy, OnInit} from '@angular/core';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {MenuFooterService} from "../../shared/services/utils/menu-footer.service";

@Component({
    selector: 'app-deposito',
    templateUrl: './deposito.component.html',
    styleUrls: ['./deposito.component.css']
})
export class DepositoComponent implements OnInit, OnDestroy {
    whatsapp;
    hasMpToken;

    constructor(
        private paramsLocais: ParametrosLocaisService,
        private menuFooterService: MenuFooterService
    ) {
    }

    ngOnInit() {
        if (this.paramsLocais.getOpcoes().whatsapp) {
            this.whatsapp = this.paramsLocais.getOpcoes().whatsapp.replace(/\D/g, '');
        }
        this.menuFooterService.setIsPagina(true);
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

}
