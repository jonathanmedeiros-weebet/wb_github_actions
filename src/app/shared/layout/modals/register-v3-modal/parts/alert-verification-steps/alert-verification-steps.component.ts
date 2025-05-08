import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ParametrosLocaisService } from 'src/app/services';

@Component({
  selector: 'app-alert-verification-steps',
  templateUrl: './alert-verification-steps.component.html',
  styleUrl: './alert-verification-steps.component.scss'
})
export class AlertVerificationStepsComponent {

  public alertVerificationText: string = '';
  public hasStepVerificationRequired: boolean = false;

  constructor(
    private paramsService: ParametrosLocaisService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    const hasStepVerificationEmail = Boolean(this.paramsService.getOpcoes().validacao_email_obrigatoria);
    const hasStepVerificationPhone = Boolean(this.paramsService.getOpcoes().mandatory_phone_validation);
    this.hasStepVerificationRequired = hasStepVerificationEmail || hasStepVerificationPhone;

    if (hasStepVerificationEmail && hasStepVerificationPhone) {
      this.alertVerificationText = this.translateService.instant('accountVerification.alertEmailAndPhoneVerificationRequired');
    } else if (hasStepVerificationPhone) {
      this.alertVerificationText = this.translateService.instant('accountVerification.alertPhoneVerificationRequired');
    } else {
      this.alertVerificationText = this.translateService.instant('accountVerification.alertEmailVerificationRequired');
    }
  }
}
