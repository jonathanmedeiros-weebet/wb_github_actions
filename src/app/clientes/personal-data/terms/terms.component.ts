import { Component } from '@angular/core';
import {config} from '../../../shared/config';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent {
    public termsAndConditionsLink: string[] = [`/informacoes/termos-condicoes`];
    public privacyPolicyLink: string[] = [`/informacoes/politica-privacidade`];
    public termsOfServiceLink: string[] = [`/informacoes/termos-servico`];
    public showTermsAndConditions: boolean = true;
    public showPrivacyPolicy: boolean = true;
    public showTermsOfService: boolean = false;
}
