import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { Bank } from '../shared/models/bankAccounts/bank';
import { AuthService, MenuFooterService, MessageService, SidebarService, UtilsService } from '../services';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.css']
})
export class BankAccountsComponent implements OnInit, OnDestroy {
    public collapsed = false;
    form: FormGroup;
    public showLoading = false;
    public banks: Array<Bank>;
    public bankSelected: number;
    private unsub$ = new Subject();

    constructor(
        private fb: UntypedFormBuilder,
        private utilsService: UtilsService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private auth: AuthService,
        private menuFooterService: MenuFooterService,
    ){
        // super();
        this.banks = [];
        this.bankSelected = 0;
    }

    get isCliente() {
        return this.auth.isCliente();
    }

    ngOnInit(): void {
        this.createForm();
        this.getBanks();

        if (this.isCliente) {
            this.sidebarService.changeItens({contexto: 'cliente'});
        } else {
            this.sidebarService.changeItens({contexto: 'cambista'});
        }

        this.menuFooterService.setIsPagina(true);
    }

    createForm() {
        this.form = this.fb.group({
            bank: [''],
            agencyNumber: [''],
            accountNumber: [''],
            accountType: ['']
        });
    }

    onSubmit() {
      // if (this.form.valid) {
      //     if(this.twoFactorInProfileChangeEnabled) {
      //         this.validacaoMultifator();
      //     } else {
      //         this.submit();
      //     }
      // } else {
      //     this.checkFormValidations(this.form);
      // }
    }

    getBanks() {
        this.utilsService.getBanks().subscribe(
            bank => this.banks = bank,
            error => this.handleError(error)
        );
    }

    handleError(mensagem: string) {
        this.messageService.error(mensagem);
    }

    ngOnDestroy(): void {
        this.unsub$.next();
        this.unsub$.complete();
        this.menuFooterService.setIsPagina(false);

    }

}
