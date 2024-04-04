import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FinanceiroService, MenuFooterService, MessageService, ParametrosLocaisService, SidebarService } from 'src/app/services';

@Component({
  selector: 'app-transacoes-historico',
  templateUrl: './transacoes-historico.component.html',
  styleUrls: ['./transacoes-historico.component.css']
})
export class TransacoesHistoricoComponent implements OnInit, OnDestroy {
    showLoading = true;
    showLoadingModal = true;

    tabSelected: string = 'withdraws';

    withdraws = [];
    deposits = [];

    constructor(
        public activeModal: NgbActiveModal,
        private financeiroService: FinanceiroService,
        private menuFooterService: MenuFooterService,
        private messageService: MessageService,
        private sidebarService: SidebarService
    ) { }

    ngOnInit(): void {
        this.sidebarService.changeItens({ contexto: 'cliente' });

        this.getWithdraws();
    }

    ngOnDestroy(): void {
        this.menuFooterService.setIsPagina(false);
    }

    getTabs(): any[] {
        const tabs: any[] = [
            { id: 'withdraws', label: 'geral.saques' },
            { id: 'deposits', label: 'geral.depositos' }
        ];

        return tabs;
    }

    getWithdraws() {
        const queryParams: any = {
            'periodo': '',
            'tipo': 'saques',
        };

        this.financeiroService.getDepositosSaques(queryParams)
            .subscribe(
                response => {
                    this.withdraws = response;
                    this.showLoading = false;
                },
                error => {
                    this.errorHandler(error);
                }
            );
    }

    getDeposits() {
        const queryParams: any = {
            'periodo': "",
            'tipo': "depositos"
        }

        this.financeiroService.getDepositosSaques(queryParams)
            .subscribe(
                response => {
                    this.deposits = response;
                    this.showLoading = false;
                },
                error => {
                    this.errorHandler(error);
                }
            );
    }

    errorHandler(error: string) {
        this.messageService.error(error);
        this.menuFooterService.setIsPagina(false);
    }

    changeTab(tab) {
        this.showLoading = true;
        this.tabSelected = tab;
        switch (tab) {
            case 'withdraws':
                this.getWithdraws();
                break;
            case 'deposits':
                this.getDeposits();
                break;
        }
    }
}
