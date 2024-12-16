import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBankAccountModalComponent } from '../modals/add-bank-account-modal/add-bank-account-modal.component';
import { ClienteService } from 'src/app/services';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-bank-accounts',
  templateUrl: './list-bank-accounts.component.html',
  styleUrls: ['./list-bank-accounts.component.scss']
})
export class ListBankAccountsComponent {
  @Input() showHeaderMobile: boolean = false;

  public accounts: any[] = []

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.loadPage();
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

  public toBack() {
    this.activeModal.dismiss();
  }
}
