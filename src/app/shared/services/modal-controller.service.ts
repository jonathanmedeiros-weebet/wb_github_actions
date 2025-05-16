import { Injectable } from "@angular/core";
import { SuccessModalComponent } from "../layout/modals/success-modal/success-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AccountVerificationOnboardingComponent } from "../layout/modals/account-verification-onboarding";
import { InformationStepsComponent } from "../layout/modals/information-steps/information-steps.component";
import { AccountVerificationTypes } from "../enums";
import { AccountVerifiedAddressComponent } from "../layout/modals/account-verified-address/account-verified-address.component";

interface SuccessModalOptions {
  title: string;
  description?: string;
  buttonText?: string;
  handleClick: () => void
}

@Injectable({
  providedIn: 'root'
})
export class ModalControllerService {

  constructor(private ngbModalService: NgbModal) {}

  public openSuccessModal({
    title,
    description,
    buttonText,
    handleClick
  }: SuccessModalOptions): Promise<void> {
    return new Promise((resolve) => {
      const modalref = this.ngbModalService.open(SuccessModalComponent, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        windowClass: 'modal-375 modal-generic',
        backdrop: 'static',
      });
      if (title) {
        modalref.componentInstance.title = title;
      }
      if (description) {
        modalref.componentInstance.description = 'Está quase lá! Ainda falta algumas informações a serem validadas.';
      }
      if (buttonText) {
        modalref.componentInstance.buttonText = 'Continuar';
      }

      modalref.result.then(() => {
        if(Boolean(handleClick)) {
          handleClick();
        }
        resolve();
      })
    })
  }

  public openAccountVerificationOnboarding() {
    this.ngbModalService.open(AccountVerificationOnboardingComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'modal-460 modal-generic',
      backdrop: 'static',
    });
  }

  public openAccountVerificationInformationSteps(type?: AccountVerificationTypes) {
    const modalref = this.ngbModalService.open(InformationStepsComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'modal-400 modal-generic-centered',
      backdrop: 'static',
    });

    if (Boolean(type)) {
      modalref.componentInstance.informationType = type;
    }
  }

  public openAccountVerifiedAddressModal() {
    const modalref = this.ngbModalService.open(AccountVerifiedAddressComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'modal-280 modal-generic',
      backdrop: 'static',
    });
    return modalref;
  }
}

// Usage example:
// this.modalServiceTest.openSuccessModal({
//   title: 'Seu e-mail foi validado com sucesso!',
//   description: 'Está quase lá! Ainda falta algumas informações a serem validadas.',
//   buttonText: 'Continuar',
//   handleClick: () => console.log('chegou')
// });
