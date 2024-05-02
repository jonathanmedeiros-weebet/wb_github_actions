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
    modalidade = 'pix';
    pixCambista = false;
    hasPaymentMethodsAvailableForBettors;

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

        this.hasPaymentMethodsAvailableForBettors = !!this.paramsLocais.getOpcoes().payment_methods_available_for_bettors.length;
        if (!this.hasPaymentMethodsAvailableForBettors) {
            this.router.navigate(['esportes/futebol']);
        }
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }
}
