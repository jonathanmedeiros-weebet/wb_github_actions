import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from 'src/app/shared/layout/base-form/base-form.component';
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
export class RolloverComponent extends BaseFormComponent implements OnInit, OnDestroy {

    rollovers: Rollover[] = [];
    showLoading = true;
    smallScreen = false;
    page = 1;
    whatsapp;
    mobileScreen;
    queryParams;

    constructor(
        private paramsLocais: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private financeiroService: FinanceiroService,
        private sidebarService: SidebarService,
        public activeModal: NgbActiveModal,
        private messageService: MessageService,
        private fb: FormBuilder,
    ) { super();}

    ngOnInit(): void {
        this.mobileScreen = window.innerWidth <= 1024;
        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cliente'});
            this.menuFooterService.setIsPagina(true);
        }
        this.whatsapp = this.paramsLocais.getOpcoes().whatsapp.replace(/\D/g, '');
        this.smallScreen = window.innerWidth < 669;
        this.getRollovers();
        this.createForm();
    }

    getRollovers(queryParams?: any) {
        this.showLoading = true;
        this.financeiroService.getRollovers(queryParams)
        .subscribe(
            response => {
                this.rollovers = response;
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

    createForm() {
        this.form = this.fb.group({
            status: ['ativo'],
        });

        this.submit();
    }

    submit() {
        this.queryParams = this.form.value;
        const queryParams: any = {
            'status': this.queryParams.status,
        };
        this.getRollovers(queryParams);
    }


}
