import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from 'src/app/services';
import { AccountVerificationService } from 'src/app/shared/services/account-verification.service';

@Component({
  selector: 'app-terms-accepted',
  templateUrl: './terms-accepted.component.html',
  styleUrls: ['./terms-accepted.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TermsAcceptedComponent  implements OnInit {
  public title: string;
  public description: string;
  public cancelTerms: boolean = false;

  constructor(
    private accountVerificationService: AccountVerificationService,
    private activeModal: NgbActiveModal,
    private clientService: ClienteService,
  ) {}

  ngOnInit(): void {
    this.prepareInfo();
  }

  private prepareInfo() {
    this.title = !this.cancelTerms ? "Olá, tivemos uma atualização em nossos termos e aceites." : "Tem certeza? Para continuar sua diversão é preciso aceitar os novos termos.";
    this.description = `<p>Atualizamos nossos <a href="/informacoes/termos-condicoes">Termos de uso</a>. Para continuar utilizando a nossa plataforma, é necessário concordar com os novos termos.</p><br><p>Essa atualização garante mais transparência e segurança.</p>`;
  }

  public logout() {
    this.activeModal.close(false);
  };

  changeButton(){
    this.cancelTerms = !this.cancelTerms;
    this.title = !this.cancelTerms ? "Olá, tivemos uma atualização em nossos termos e aceites." : "Tem certeza? Para continuar sua diversão é preciso aceitar os novos termos.";
    return this.cancelTerms;
  }

  acceptedTerms() {
    this.clientService.acceptTerms()
      .toPromise()
      .then(() => {this.accountVerificationService.getAccountVerificationDetail().toPromise();
          this.activeModal.close(true);
      });
  }

}

