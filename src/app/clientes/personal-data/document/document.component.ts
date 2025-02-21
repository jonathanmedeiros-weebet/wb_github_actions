import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ClienteService, MessageService } from 'src/app/services';

export interface CustomerResponse {
    cpf: string;
    nome: string;
    sobrenome: string;
    dataNascimento: string;
    nationality: string;
    genero: string;
}

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
    customer: any;

    constructor(
        private clienteService: ClienteService,
        private messageService: MessageService,
        private translate: TranslateService,
    ) {}

    ngOnInit(): void {
        this.loadCustomer();
    }

    loadCustomer() {
        const user = JSON.parse(localStorage.getItem('user'));
        this.clienteService.getCliente(user.id)
            .subscribe({
                next: (res: CustomerResponse) => {
                    this.customer = res;
                },
                error: () => {
                    this.messageService.error(this.translate.instant('erroInesperado'));
                }
            });
    }
}
