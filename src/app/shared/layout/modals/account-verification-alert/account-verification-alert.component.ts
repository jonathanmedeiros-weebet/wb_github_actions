import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountVerificationService } from 'src/app/shared/services/account-verification.service';

@Component({
  selector: 'app-account-verification-alert',
  templateUrl: './account-verification-alert.component.html',
  styleUrls: ['./account-verification-alert.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountVerificationAlertComponent implements OnInit {
  public confirmClose: boolean = false;
  public title: string;
  public description: string;
  public stepStatus: any[];
  public showStepStatus: boolean = false;

  constructor(
    private accountVerificationService: AccountVerificationService,
    private activeModal: NgbActiveModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.prepareInfo();
  }

  private prepareInfo() {
    const isNewCustomer = !this.accountVerificationService.newCustomer.getValue();
    const balance = this.accountVerificationService.balance.getValue();
    const verifiedSteps = this.accountVerificationService.verifiedSteps.getValue();

    this.title = !this.confirmClose
      ? 'Algumas validações da sua conta ainda se encontram pendentes!'
      : 'Tem certeza? Sua conta ainda não está totalmente liberada!';

    const descriptionConfirmClose = 'Infelizmente sem realizar a verificação, você não poderá desfrutar ao máximo da nossa plataforma e suas ações estarão limitadas.';
    const descriptionVerification = isNewCustomer
      ? 'Para liberar todas as funções da nossa plataforma precisamos que você conclua as etapas abaixo.'
      : `Você possui um <strong class="color-primary">saldo de ${ this.formatCurrencyBRL(balance) }</strong> em nossa plataforma, para usá-lo é preciso realizar as validações.`;

    this.description = !this.confirmClose ? descriptionVerification : descriptionConfirmClose;

    const steps = [
      {
        title: 'Validação KYC',
        verified: verifiedSteps?.document,
        show: verifiedSteps?.document !== undefined, //todo: verificar no paramentros json as permissões;
      },
      {
        title: 'Validação do e-mail cadastrado',
        verified: verifiedSteps?.email,
        show: verifiedSteps?.email !== undefined, //todo: verificar no paramentros json as permissões;
      },
      {
        title: 'Validação de telefone informado',
        verified: verifiedSteps?.phone,
        show: verifiedSteps?.phone !== undefined, //todo: verificar no paramentros json as permissões;
      },
      {
        title: 'Validação de endereço',
        verified: verifiedSteps?.address,
        show: verifiedSteps?.address !== undefined, //todo: verificar no paramentros json as permissões;
      },
    ];
    this.stepStatus = steps.filter(step => step.show);

    this.showStepStatus = !this.confirmClose;
  }

  public handleClose() {
    if (!this.confirmClose){
      this.confirmClose = true;
      this.prepareInfo();
      return;
    }

    this.activeModal.close(true);
  }

  public goToAccountVerification() {
    //todo: Adicionar rota da página de verificação
    // this.router.navigate([''])
  };

  private formatCurrencyBRL(value: number) {
    return (new CurrencyPipe('pt-br')).transform(value, 'BRL');
  }
}
