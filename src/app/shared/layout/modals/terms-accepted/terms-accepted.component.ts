import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, ClienteService } from 'src/app/services';
import { AccountVerificationService } from 'src/app/shared/services/account-verification.service';

@Component({
  selector: 'app-terms-accepted',
  templateUrl: './terms-accepted.component.html',
  styleUrls: ['./terms-accepted.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TermsAcceptedComponent  implements OnInit {
  public confirmClose: boolean = false;
  public title: string;
  public description: string;
  public stepStatus: any[];
  public showStepStatus: boolean = false;
  cancelTerms: boolean = false;

  constructor(
    private accountVerificationService: AccountVerificationService,
    private activeModal: NgbActiveModal,
    private auth: AuthService,
    private clientService: ClienteService,
  ) {}

  ngOnInit(): void {
    this.prepareInfo();
  }

  private prepareInfo() {
    const isNewCustomer = this.accountVerificationService.newCustomer.getValue();
    const balance = this.accountVerificationService.balance.getValue();
    
    this.title = !this.cancelTerms ? "Olá, tivemos uma atualização em nossos termos e aceites." : "Tem certeza? Para continuar sua diversão é preciso aceitar os novos termos.";

    const descriptionConfirmClose = 'Infelizmente sem realizar a verificação, você não poderá desfrutar ao máximo da nossa plataforma e suas ações estarão limitadas.';
    const descriptionVerification = `<p>Atualizamos nossos <a href="/informacoes/termos-condicoes">Termos de uso</a>. Para continuar utilizando a nossa plataforma, é necessário concordar com os novos termos.</p><br><p>Essa atualização garante mais transparência e segurança.</p>`;
    this.description = !this.confirmClose ? descriptionVerification : descriptionConfirmClose;

  }

  public logout() {
    this.activeModal.close(true);
    this.auth.logout();
  };

  changeButton(){
    this.cancelTerms = !this.cancelTerms;
    this.title = !this.cancelTerms ? "Olá, tivemos uma atualização em nossos termos e aceites." : "Tem certeza? Para continuar sua diversão é preciso aceitar os novos termos.";
    return this.cancelTerms;
  }

  acceptedTerms() {
    this.activeModal.close(true);
    this.clientService.acceptTerms().subscribe((res) => {
      console.log(res);
      
    
  });
  }
}

