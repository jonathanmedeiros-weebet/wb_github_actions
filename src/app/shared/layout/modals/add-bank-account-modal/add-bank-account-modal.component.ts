import { Component, ElementRef, Input } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ClienteService, MessageService, UtilsService } from 'src/app/services';
import { Bank } from 'src/app/shared/models/bankAccounts/bank';

@Component({
  selector: 'app-add-bank-account-modal',
  templateUrl: './add-bank-account-modal.component.html',
  styleUrls: ['./add-bank-account-modal.component.css']
})
export class AddBankAccountModalComponent {
  @Input() showHeader: boolean = false;
  public form: FormGroup;
  public banks: Array<Bank> = [];
  public bankSelected: number = 0;
  loading = true;

  config = {
    placeholder: this.translate.instant('bankAccounts.OptionBank'),
    search: true,
    limitTo: 0,
    height: "250px",
    displayKey: "nome",
    noResultsFound: 'Sem resultados',
    searchPlaceholder:'Procurar'
  }

  constructor(
      private fb: UntypedFormBuilder,
      private utilsService: UtilsService,
      private messageService: MessageService,
      private translate: TranslateService,
      private clienteService: ClienteService,
      public activeModal: NgbActiveModal,
      private elRef: ElementRef
  ){}

  ngOnInit(): void {
      this.createForm();
      this.getBanks();
  }

  createForm() {
      this.form = this.fb.group({
          bank: ['', [Validators.required]],
          agencyNumber: ['', [Validators.required]],
          accountNumber: ['', [Validators.required]],
          accountType: ['', [Validators.required]],
          accountDigit: ['', [Validators.required]]
      });
  }

  getBanks() {
    this.utilsService.getBanks().subscribe(
        banks => {this.banks = banks; this.loading = false},
        error => this.handleError(error)
    );
  }

  handleError(mensagem: string) {
      this.messageService.error(mensagem);
  }

  onSubmit() {
      if (this.form.valid) {
          let values = this.form.value;
          values.bank = this.form.get('bank').value.id;

          this.clienteService
              .registerBankAccount(values)
              .subscribe(
                  () => {
                      this.messageService.success(this.translate.instant('geral.savedSuccessfully'))
                      this.resetForm();
                      this.activeModal.close({isReload: true})
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

  onDropdownClick() {
    setTimeout(() => {
      const searchInput: HTMLInputElement = this.elRef.nativeElement.querySelector('.ngx-dropdown-container input');
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }
}
