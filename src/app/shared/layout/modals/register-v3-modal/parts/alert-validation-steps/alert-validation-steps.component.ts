import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ParametrosLocaisService } from 'src/app/services';

@Component({
  selector: 'app-alert-validation-steps',
  templateUrl: './alert-validation-steps.component.html',
  styleUrl: './alert-validation-steps.component.scss'
})
export class AlertValidationStepsComponent {

  public alertValidationText: string = '';
  public hasStepValidationRequired: boolean = false;

  constructor(
    private paramsService: ParametrosLocaisService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    const hasStepValidationEmail = Boolean(this.paramsService.getOpcoes().validacao_email_obrigatoria);
    const hasStepValidationPhone = Boolean(this.paramsService.getOpcoes().mandatory_phone_validation);
    this.hasStepValidationRequired = hasStepValidationEmail || hasStepValidationPhone;

    if (hasStepValidationEmail && hasStepValidationPhone) {
      this.alertValidationText = this.translateService.instant('accountValidation.alertSteps.alertEmailAndPhoneValidationRequired');
    } else if (hasStepValidationPhone) {
      this.alertValidationText = this.translateService.instant('accountValidation.alertSteps.alertPhoneValidationRequired');
    } else {
      this.alertValidationText = this.translateService.instant('accountValidation.alertSteps.alertEmailValidationRequired');
    }
  }
}
