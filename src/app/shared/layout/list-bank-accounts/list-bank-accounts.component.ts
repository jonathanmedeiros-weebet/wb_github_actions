import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBankAccountModalComponent } from '../modals/add-bank-account-modal/add-bank-account-modal.component';
import { ClienteService, MessageService, UtilsService } from 'src/app/services';
import { ConfirmModalComponent } from '../modals';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Bank } from '../../models/bankAccounts/bank';

@Component({
  selector: 'app-list-bank-accounts',
  templateUrl: './list-bank-accounts.component.html',
  styleUrls: ['./list-bank-accounts.component.scss']
})
export class ListBankAccountsComponent {
    @Input() showHeaderMobile: boolean = false;
    public accounts: any[] = []
    unsub$ = new Subject();
    public banks: Array<Bank> = [];

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private clienteService: ClienteService,
        private messageService: MessageService,
        private translate: TranslateService,
        private utilsService: UtilsService,
    ) {}

    ngOnInit() {
        this.loadPage();
        this.getBanks();
    }

    private loadPage() {
        this.clienteService
        .allBankAccounts()
        .toPromise()
        .then((allBanks) => this.accounts = allBanks);
    }

    public openAddBankAccount() {
        const modalRef = this.modalService.open(AddBankAccountModalComponent);
        modalRef.componentInstance.showHeader = this.showHeaderMobile;

        modalRef.result.then(({isReload}) => {
        if(Boolean(isReload)) this.loadPage();
        });
    }

    public openConfirmModal(accountItem) {
        const modalConfirm = this.modalService.open(ConfirmModalComponent, { centered: true });
        modalConfirm.componentInstance.title = 'Excluir Conta Bancária';
        modalConfirm.componentInstance.msg = 'Tem certeza que deseja excluir a conta bancária ?';

        modalConfirm.result.then(
            (result) => {
                this.clienteService.deleteBankAccount({ id: accountItem.id})
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        () => {
                            this.messageService.success(this.translate.instant('geral.successfullyDeleted'))
                            this.loadPage()
                        },
                        error => this.handleError(error)
                    );
            },
            (reason) => { }
        );
    }
    
    handleError(mensagem: string) {
        this.messageService.error(mensagem);
    }

    public toBack() {
        this.activeModal.dismiss();
    }

    getBanks() {
        this.utilsService.getBanks().subscribe(
            banks => this.banks = banks,
            error => this.handleError(error)
        );
    }
}
