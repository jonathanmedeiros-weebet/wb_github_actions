import { Component, OnDestroy, OnInit } from '@angular/core';
import { FinanceiroService, MessageService, SidebarService } from 'src/app/services';
import {Rollover} from '../../models';

@Component({
  selector: 'app-promocao',
  templateUrl: './promocao.component.html',
  styleUrls: ['./promocao.component.css']
})
export class PromocaoComponent {
    showLoading = true;
    queryParams;
    loading = true;
    rollovers: Rollover[] = [];
    
    tabSelected = 'bonus';


    constructor (
        private financeiroService: FinanceiroService,
        private sidebarService:SidebarService,
        private messageService: MessageService
    ) {  }

    ngOnInit() {
        this.sidebarService.changeItens({contexto: 'cliente'});

    }

    changeTab(tab) {
        this.tabSelected = tab;
        this.getPromotion();
        // this.getApostas();
    }

    getPromotion() {
        this.loading = true;

        const queryParams: any = {
            'status': this.queryParams.status,
        };

        switch(this.tabSelected) {
            case 'bonus':
                this.getRollovers();
                break;
            case 'rodada-gratis':
                break;
            default: 
                break
        }

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


}
