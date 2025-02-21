import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ClienteService, MessageService, SidebarService } from 'src/app/services';
import { AccordionItem } from 'src/app/shared/interfaces/accordion-item';
import { AddressComponent } from './address/address.component';
import { DocumentComponent } from './document/document.component';
import { EmailComponent } from './email/email.component';
import { PhoneComponent } from './phone/phone.component';
import { TermsComponent } from './terms/terms.component';

@Component({
  selector: 'app-registration-validation',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})

export class PersonalDataComponent implements OnInit {
    accordionItems: AccordionItem[] = [
        {
            title: "Verificação de documentos",
            description: "Visão geral dos seus dados pessoais.",
            component: DocumentComponent,
            isVerified: false,
            isVisible: false
        },
        {
            title: "Endereço",
            description: "Confira e edite as informações referente ao seu endereço se necessário. Lembrando que todos os campos são obrigatórios e devem ser preenchidos para ser considerado completo.",
            component: AddressComponent,
            isVerified: true,
            isVisible: false
        },
        {
            title: "E-mail",
            description: "Confira e atualize o seu e-mail se necessário. Lembrando que o e-mail você deverá ter acesso para que seja enviado o código de verificação.",
            component: EmailComponent,
            isVerified: false,
            isVisible: true
        },
        {
            title: "Telefone",
            description: "Confira e atualize o seu número de telefone se necessário. Lembrando que o número de telefone deverá ser valido para que seja enviado o código de verificação.",
            component: PhoneComponent,
            isVerified: false,
            isVisible: false
        },
        {
            title: "Termos e aceites",
            description: "Termos de uso, política de privacidade e termos de serviço.",
            component: TermsComponent,
            isVerified: false,
            isVisible: false
        }
    ];

    customer: any;

    constructor(
        private messageService: MessageService,
        private sidebarService: SidebarService,
    ) {}

    ngOnInit(): void {
        this.sidebarService.changeItens({contexto: 'cliente'});
    }


    toggleVisibilityItem(item: AccordionItem) {
        this.accordionItems.forEach((i) => {
            if (i != item) {
                i.isVisible = false;
            }
        })

        item.isVisible = !item.isVisible;
    }

    handleError(mensagem: string) {
        this.messageService.error(mensagem);
    }
}
