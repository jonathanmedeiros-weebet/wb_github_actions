import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountVerificationService, ClienteService, MessageService } from 'src/app/services';
import { VerificationTypes } from 'src/app/shared/enums';

export interface CustomerResponse {
    email: string;
}

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
    @ViewChild('emailInput') emailInput!: ElementRef;
    email: string;
    isEditingEmail: boolean;
    public verificationRequired: boolean = false;

    constructor(
        private clienteService: ClienteService,
        private messageService: MessageService,
        private translate: TranslateService,
        private accountVerificationService: AccountVerificationService
    ) {}

    ngOnInit(): void {
        this.loadCustomerEmail();
        this.verifyAccountVerificationStep();
    }

    loadCustomerEmail() {
        const user = JSON.parse(localStorage.getItem('user'));
        this.clienteService.getCliente(user.id)
            .subscribe({
                next: (res: CustomerResponse) => {
                    this.email = res.email;
                },
                error: () => {
                    this.handleError(this.translate.instant('erroInesperado'));
                }
            });
    }

    handleUpdateEmail() {
        this.clienteService.updateEmail(this.email)
        .subscribe({
                next: (res) => {
                    this.isEditingEmail = false;
                    this.messageService.success(this.translate.instant('geral.alteracoesSucesso'));
                    this.accountVerificationService.getAccountVerificationDetail().toPromise();
                },
                error: (error) => this.handleError(error)
            });
    }

    handleActiveEditingEmail() {
        this.isEditingEmail = !this.isEditingEmail;
        if (this.isEditingEmail) {
            this.emailInput.nativeElement.focus();
            this.emailInput.nativeElement.select();
        } else {
            this.loadCustomerEmail();
        }
    }

    handleError(mensagem: string) {
        this.messageService.error(mensagem);
    }

    private verifyAccountVerificationStep() {
        this.accountVerificationService.verifiedSteps.subscribe(({email}) => {
            if(email != undefined) {
                this.verificationRequired = !Boolean(email);
            }
        })
    }

    public handleVerification() {
        this.accountVerificationService.openModalPhoneOrEmailVerificationStep({
            type: VerificationTypes.EMAIL,
            value: this.email
        });
    }
}
