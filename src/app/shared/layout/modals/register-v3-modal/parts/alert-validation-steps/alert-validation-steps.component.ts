import { has } from 'lodash';
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
  private hasStepValidationEmail: boolean = false;
  private hasStepValidationPhone: boolean = false;
  public hasStepValidation: boolean = false;

  constructor(private paramsService: ParametrosLocaisService,
    private translateService: TranslateService,
  ) { }
  
  ngOnInit() {
    this.hasStepValidationEmail = Boolean(this.paramsService.getOpcoes().validacao_email_obrigatoria);
    this.hasStepValidationPhone = Boolean(this.paramsService.getOpcoes().mandatory_phone_validation);
    this.hasStepValidation = this.hasStepValidationEmail || this.hasStepValidationPhone;

    if (this.hasStepValidationEmail && this.hasStepValidationPhone) {
      this.alertValidationText = this.translateService.instant('accountValidation.alertSteps.alertEmailAndPhoneValidationRequired');
    } else if (this.hasStepValidationPhone) {
      this.alertValidationText = this.translateService.instant('accountValidation.alertSteps.alertPhoneValidationRequired');
    } else {
      this.alertValidationText = this.translateService.instant('accountValidation.alertSteps.alertEmailValidationRequired');
    }
  }
}
