import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ClienteService, MessageService } from 'src/app/services';

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

    constructor(
        private clienteService: ClienteService,
        private messageService: MessageService,
        private translate: TranslateService,
    ) {}

    ngOnInit(): void {
        this.loadCustomerPhone();
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
                next: (res) => {
                    console.log(res);
                    this.isEditingPhone = false;
                },
                error: () => {
                    this.handleError(this.translate.instant('erroInesperado'));
                }
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
}
