import { Component } from '@angular/core';
import {config} from '../../../shared/config';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent {

    get termsAndConditionsLink(): string[] {
        return [`/${config.SLUG}/informacoes/termos-condicoes`];
    }

    get privacyPolicyLink(): string[] {
        return [`/${config.SLUG}/informacoes/politica-privacidade`];
    }

    get termsOfServiceLink(): string[] {
        return [`/${config.SLUG}/informacoes/termos-servico`];
    }

}
