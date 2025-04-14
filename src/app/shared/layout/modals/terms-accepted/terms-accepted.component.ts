import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, ClienteService } from 'src/app/services';
import { AccountVerificationService } from 'src/app/shared/services/account-verification.service';

@Component({
  selector: 'app-terms-accepted',
  templateUrl: './terms-accepted.component.html',
  styleUrls: ['./terms-accepted.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TermsAcceptedComponent implements OnInit {
  public title: string;
  public description: string;
  public cancelTerms: boolean = false;
  private shouldUserLogout: boolean = false;

  constructor(
    private accountVerificationService: AccountVerificationService,
    private activeModal: NgbActiveModal,
    private clientService: ClienteService,
    private authService: AuthService,
    private router: Router
  ) {}

  get confirmLogoutText() {
    return this.shouldUserLogout ? 'Sair da minha conta' : 'Desejo recusar os termos'
  }

  ngOnInit(): void {
    this.prepareInfo();
  }

  private prepareInfo() {
    this.title = !this.cancelTerms ? "Olá, tivemos uma atualização em nossos termos e aceites." : "Tem certeza? Para continuar sua diversão é preciso aceitar os novos termos.";
    this.description = `<p>Atualizamos nossos <a href="/informacoes/termos-condicoes">Termos de uso</a>. Para continuar utilizando a nossa plataforma, é necessário concordar com os novos termos.</p><br><p>Essa atualização garante mais transparência e segurança.</p>`;
  }

  public logout() {
    if (this.shouldUserLogout) {
      this.router.navigate(['/']);
      this.authService.logout();
    } else {
      this.activeModal.close();
    }
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

