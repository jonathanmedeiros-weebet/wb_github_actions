import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {MessageService} from '../../shared/services/utils/message.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import { SidebarService, FinanceiroService } from 'src/app/services';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Rollover} from '../../models';

@Component({
    selector: 'app-rollover',
    templateUrl: './rollover.component.html',
    styleUrls: ['./rollover.component.css']
})
export class RolloverComponent implements OnInit, OnDestroy {

    $rollovers: Rollover[] = [];
    showLoading = true;
    smallScreen = false;
    page = 1;
    whatsapp;
    mobileScreen;

    constructor(
        private paramsLocais: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private financeiroService: FinanceiroService,
        private sidebarService: SidebarService,
        public activeModal: NgbActiveModal,
        private messageService: MessageService,
    ) { }

    ngOnInit(): void {
        this.mobileScreen = window.innerWidth <= 1024;
        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cliente'});
            this.menuFooterService.setIsPagina(true);
        }


        this.whatsapp = this.paramsLocais.getOpcoes().whatsapp.replace(/\D/g, '');

        this.smallScreen = window.innerWidth < 669;

        this.financeiroService.getRollovers()
        .subscribe(
            response => {
                this.$rollovers = response;
                this.showLoading = false;
            },
            error => {
                this.handleError(error);
                this.showLoading = false;
            }
        );

    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }



}
