import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, MenuFooterService, SidebarService } from '../services';

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.css']
})
export class BankAccountsComponent implements OnInit, OnDestroy {

  constructor(
    private auth: AuthService,
    private sidebarService: SidebarService,
    private menuFooterService: MenuFooterService,
  ) {}

  get isCliente() {
    return this.auth.isCliente();
  }

  ngOnInit() {
    if (this.isCliente) {
        this.sidebarService.changeItens({contexto: 'cliente'});
    } else {
        this.sidebarService.changeItens({contexto: 'cambista'});
    }

    this.menuFooterService.setIsPagina(true);
  }

  ngOnDestroy(): void {
    this.menuFooterService.setIsPagina(false);
  }
}
