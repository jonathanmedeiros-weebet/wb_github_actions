import { Component, Input } from '@angular/core';

interface StepBarSteps {
  step: string;
  verified: boolean;
  currentStep: boolean;
}

@Component({
  selector: 'app-account-verification-step-bar',
  templateUrl: './account-verification-step-bar.component.html',
  styleUrl: './account-verification-step-bar.component.scss'
})
export class AccountVerificationStepBarComponent {
  @Input() steps: any = {};

  public stepBarStatus: StepBarSteps[] = []

  ngOnChanges() {
    this.stepBarStatus = this.steps.map((step: StepBarSteps) => ({
      ...step,
      verified: step.verified || step.currentStep 
    }));
  }
}
