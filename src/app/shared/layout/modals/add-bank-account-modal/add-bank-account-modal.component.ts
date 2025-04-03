import { Component, Input } from '@angular/core';
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

  constructor(
      private fb: UntypedFormBuilder,
      private utilsService: UtilsService,
      private messageService: MessageService,
      private translate: TranslateService,
      private clienteService: ClienteService,
      public activeModal: NgbActiveModal,
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
          banks => this.banks = banks,
          error => this.handleError(error)
      );
  }

  handleError(mensagem: string) {
      this.messageService.error(mensagem);
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
}
