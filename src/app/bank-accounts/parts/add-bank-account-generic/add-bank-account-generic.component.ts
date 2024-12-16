import { Component, Input } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AuthService, ClienteService, MenuFooterService, MessageService, SidebarService, UtilsService } from 'src/app/services';
import { Bank } from 'src/app/shared/models/bankAccounts/bank';

@Component({
  selector: 'app-add-bank-account-generic',
  templateUrl: './add-bank-account-generic.component.html',
  styleUrls: ['./add-bank-account-generic.component.css']
})
export class AddBankAccountGenericComponent {
    @Input() showHeader: boolean = false;
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
        private translate: TranslateService,
        private clienteService: ClienteService,
        public activeModal: NgbActiveModal,
    ){
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
            bank: [0],
            agencyNumber: [''],
            accountNumber: [''],
            accountType: [0]
        });
    }

    getBanks() {
        this.utilsService.getBanks().subscribe(
            bank => this.banks = bank,
            error => this.handleError(error)
        );
    }

    allBankAccounts() {
        this.clienteService.allBankAccounts().subscribe(
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

    onSubmit() {
        if (this.form.valid) {
            let values = this.form.value;

            this.clienteService
                .registerBankAccount(values)
                .subscribe(
                    () => {
                        this.messageService.success(this.translate.instant('geral.savedSuccessfully'))
                        this.resetForm();
                    } ,
                error => this.handleError(error)
            );
        }
    }

    resetForm() {
        this.form.reset();
        this.banks = [];
        this.getBanks() ;
        this.form.controls['bank'].setValue('0');
        this.form.controls['accountType'].setValue('0');
    }

    toBack(){
        this.activeModal.dismiss();
    }
}
