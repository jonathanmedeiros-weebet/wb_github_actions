import { Component, Type } from "@angular/core";
import { DocumentComponent } from "src/app/clientes/personal-data/document/document.component";
import { EmailComponent } from "src/app/clientes/personal-data/email/email.component";
import { PhoneComponent } from "src/app/clientes/personal-data/phone/phone.component";
import { TermsComponent } from "src/app/clientes/personal-data/terms/terms.component";

export interface AccordionItem {
    key: string;
    title: string;
    description: string;
    component: Type<EmailComponent | PhoneComponent | DocumentComponent | TermsComponent>;
    isVerified: boolean;
    showVerificationStatus: boolean;
    isVisible: boolean;
}
