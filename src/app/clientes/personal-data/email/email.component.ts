import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ClienteService, MessageService } from 'src/app/services';

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

    constructor(
        private clienteService: ClienteService,
        private messageService: MessageService,
        private translate: TranslateService,
    ) {}

    ngOnInit(): void {
        this.loadCustomerEmail();
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
                    console.log(res);
                    this.isEditingEmail = false;
                    this.messageService.success("Email atualizado com sucesso!")
                },
                error: () => {
                    this.handleError(this.translate.instant('erroInesperado'));
                }
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
}
