import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SidebarService} from '../../shared/services/utils/sidebar.service';

@Component({
    selector: 'app-deposito',
    templateUrl: './deposito-cambista.component.html',
    styleUrls: ['./deposito-cambista.component.css']
})
export class DepositoCambistaComponent implements OnInit, OnDestroy {
    whatsapp;
    modalidade;
    pixCambista = false;
    hasApiPagamentos;

    constructor(
        private paramsLocais: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private router: Router,
        public activeModal: NgbActiveModal,
        private siderbarService: SidebarService,
    ) {
    }

    ngOnInit() {
        if (window.innerWidth >= 1025) {
            this.siderbarService.changeItens({contexto: 'cambista'});
            this.menuFooterService.setIsPagina(true);
        }

        this.pixCambista = this.paramsLocais.getOpcoes().pix_cambista;
        if (!this.pixCambista) {
            this.router.navigate(['esportes/futebol']);
        }
        this.hasApiPagamentos = !this.paramsLocais.getOpcoes().metodo_pagamento_desabilitado && this.paramsLocais.getOpcoes().api_pagamentos;
        this.modalidade = 'pix';
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }
}
