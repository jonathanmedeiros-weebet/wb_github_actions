import { Component, OnInit } from '@angular/core';
import { AccountVerificationService, AuthService } from 'src/app/services';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

enum AccountVerificationStepsEnums {
  EMAIL = 'email',
  PHONE = 'phone',
  DOCUMENT = 'document',
  COMPLETED = 'completed'
}

const ORDERED_STEPS = [ // define order here ;)
  AccountVerificationStepsEnums.EMAIL,
  AccountVerificationStepsEnums.PHONE,
  AccountVerificationStepsEnums.DOCUMENT
];

@Component({
  selector: 'app-account-verification-onboarding',
  templateUrl: './account-verification-onboarding.component.html',
  styleUrl: './account-verification-onboarding.component.scss'
})
export class AccountVerificationOnboardingComponent implements OnInit {
  public step = AccountVerificationStepsEnums.EMAIL;
  public verifiedSteps = {};

  constructor(
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private accountVerificationService: AccountVerificationService,
    private router: Router
  ){}

  get showPhoneStep(): boolean {
    return this.step == AccountVerificationStepsEnums.PHONE;
  }
  
  get showDocumentStep(): boolean {
    return this.step == AccountVerificationStepsEnums.DOCUMENT;
  }

  get showEmailStep(): boolean {
    return this.step == AccountVerificationStepsEnums.EMAIL;
  }

  ngOnInit(): void {
    console.log('ngOnInit')

    this.accountVerificationService
      .verifiedSteps
      .subscribe((verifiedSteps) => {
        this.step = this.verifyCurrentStep(verifiedSteps);
        this.verifiedSteps = this.reorderSteps(verifiedSteps);

        if(this.step == AccountVerificationStepsEnums.COMPLETED) {
          this.toAdvance();
        }
      })
  }

  private reorderSteps(verifiedSteps) {
    return verifiedSteps = ORDERED_STEPS
      .map((step) => ({
        step,
        required: (step in verifiedSteps),
        verified: Boolean(verifiedSteps[step]),
        currentStep: this.step == step
      }))
      .filter(step => step.required);
  }

  private verifyCurrentStep(verifiedSteps: any): AccountVerificationStepsEnums {
    const pendingSteps = ORDERED_STEPS.filter(step => {
      return !verifiedSteps[step];
    })

    let currentStep = AccountVerificationStepsEnums.COMPLETED;
    if (Boolean(pendingSteps.length)) {
      currentStep = pendingSteps[0] as AccountVerificationStepsEnums
    }

    return currentStep;
  }

  public async toAdvance() {
    if (AccountVerificationStepsEnums.COMPLETED == this.step) {
      const isNewCustomer = this.accountVerificationService.newCustomer.getValue();
      this.activeModal.dismiss();

      if(isNewCustomer) {
        localStorage.setItem('permissionWelcomePage', JSON.stringify(true));
        this.router.navigate(['/welcome']);
      } else {
        this.router.navigate(['/']).then(() => this.accountVerificationService.openModalAccountVerifiedWithSuccess())
      }
      
    } else {
      this.accountVerificationService.getAccountVerificationDetail().toPromise();
    }
  }

  public handleLogout() {
    this.authService.logout();
  }
}
