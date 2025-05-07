import { Component } from '@angular/core';
import { ParametrosLocaisService } from 'src/app/services';

@Component({
  selector: 'app-alert-validation-steps',
  templateUrl: './alert-validation-steps.component.html',
  styleUrl: './alert-validation-steps.component.scss'
})
export class AlertValidationStepsComponent {

  public stepsValidationAccount: string = '';
  private hasStepValidationEmail: boolean = false;
  private hasStepValidationPhone: boolean = false;

  constructor(private paramsService: ParametrosLocaisService) { }
  ngOnInit() {
    this.hasStepValidationEmail = Boolean(this.paramsService.getOpcoes().validacao_email_obrigatoria);
    this.hasStepValidationPhone = Boolean(this.paramsService.getOpcoes().mandatory_phone_validation);

    if (this.hasStepValidationEmail && this.hasStepValidationPhone) {
      this.stepsValidationAccount = 'both';
    } else if (this.hasStepValidationPhone) {
      this.stepsValidationAccount = 'phone';
    } else {
      this.stepsValidationAccount = 'email';
    }
  }
}
