import { Component, OnInit } from '@angular/core';
import { MessageService, SidebarService } from 'src/app/services';
import { AccordionItem } from 'src/app/shared/interfaces/accordion-item';
import { AddressComponent } from './address/address.component';
import { DocumentComponent } from './document/document.component';
import { EmailComponent } from './email/email.component';
import { PhoneComponent } from './phone/phone.component';
import { TermsComponent } from './terms/terms.component';
import { AccountVerificationService } from 'src/app/shared/services/account-verification.service';

@Component({
  selector: 'app-registration-validation',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})

export class PersonalDataComponent implements OnInit {
    
    public accordionItems: AccordionItem[] = [
        {
            key: "document",
            title: "Verificação de documentos",
            description: "Visão geral dos seus dados pessoais.",
            component: DocumentComponent,
            showVerificationStatus: false,
            isVerified: false,
            isVisible: false
        },
        {
            key: "address",
            title: "Endereço",
            description: "Confira e edite as informações referente ao seu endereço se necessário. Lembrando que todos os campos são obrigatórios e devem ser preenchidos para ser considerado completo.",
            component: AddressComponent,
            showVerificationStatus: false,
            isVerified: false,
            isVisible: false
        },
        {
            key: "email",
            title: "E-mail",
            description: "Confira e atualize o seu e-mail se necessário. Lembrando que o e-mail você deverá ter acesso para que seja enviado o código de verificação.",
            component: EmailComponent,
            showVerificationStatus: false,
            isVerified: false,
            isVisible: false
        },
        {
            key: "phone",
            title: "Telefone",
            description: "Confira e atualize o seu número de telefone se necessário. Lembrando que o número de telefone deverá ser valido para que seja enviado o código de verificação.",
            component: PhoneComponent,
            showVerificationStatus: false,
            isVerified: false,
            isVisible: false
        },
        {
            key: "terms",
            title: "Termos e aceites",
            description: "Termos de uso, política de privacidade e termos de serviço.",
            component: TermsComponent,
            showVerificationStatus: false,
            isVerified: false,
            isVisible: false
        }
    ];
    public customer: any;

    constructor(
        private messageService: MessageService,
        private sidebarService: SidebarService,
        private accountVerificationService: AccountVerificationService
    ) {}

    ngOnInit(): void {
        this.sidebarService.changeItens({contexto: 'cliente'});
        this.verifyAccountVerificationSteps();
    }

    private verifyAccountVerificationSteps() {
        this.accountVerificationService.verifiedSteps.subscribe(
            (verifiedSteps) => {
                this.accordionItems = this.accordionItems.map((item: AccordionItem) => ({
                    ...item,
                    showVerificationStatus: verifiedSteps[item.key] != undefined,
                    isVerified: Boolean(verifiedSteps[item.key])
                }))
            }
        )
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
