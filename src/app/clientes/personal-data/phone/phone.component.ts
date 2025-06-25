import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ClienteService, MessageService } from 'src/app/services';
import { AccountVerificationTypes } from 'src/app/shared/enums';
import { AccountVerificationService } from 'src/app/shared/services/account-verification.service';

export interface CustomerResponse {
    telefone: string;
}

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.css']
})
export class PhoneComponent implements OnInit  {
    @ViewChild('emailInput') emailInput!: ElementRef;
    phone: string;
    isEditingPhone: boolean;
    public verificationRequired: boolean = false;

    constructor(
        private clienteService: ClienteService,
        private messageService: MessageService,
        private translate: TranslateService,
        private accountVerificationService: AccountVerificationService,
    ) {}

    ngOnInit(): void {
        this.loadCustomerPhone();
        this.verifyAccountVerificationStep();
    }

    loadCustomerPhone() {
        const user = JSON.parse(localStorage.getItem('user'));
        this.clienteService.getCliente(user.id)
            .subscribe({
                next: (res: CustomerResponse) => {
                    this.phone = res.telefone;
                },
                error: () => {
                    this.handleError(this.translate.instant('erroInesperado'));
                }
            });
    }

    handleUpdatePhone() {
        this.clienteService.updatePhone(this.phone)
        .subscribe({
                next: () => {
                    this.isEditingPhone = false;
                    this.messageService.success(this.translate.instant('geral.alteracoesSucesso'));
                    this.accountVerificationService.getAccountVerificationDetail().toPromise();
                },
                error: (error) => this.handleError(error)
            });
    }

    handleActiveEditingPhone() {
        this.isEditingPhone = !this.isEditingPhone;
        if (this.isEditingPhone) {
            this.emailInput.nativeElement.focus();
            this.emailInput.nativeElement.select();
        } else {
            this.loadCustomerPhone();
        }
    }

    handleError(mensagem: string) {
        this.messageService.error(mensagem);
    }

    private verifyAccountVerificationStep() {
        this.accountVerificationService.verifiedSteps.subscribe(({phone}) => {
            if(phone != undefined) {
                this.verificationRequired = !Boolean(phone);
            }
        })
    }

    public handleVerification() {
        this.accountVerificationService.openModalPhoneOrEmailVerificationStep({
            type: AccountVerificationTypes.PHONE,
            value: this.phone
        });
    }
}
