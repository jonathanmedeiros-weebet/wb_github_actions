import { Injectable } from "@angular/core";
import { SuccessModalComponent } from "../layout/modals/success-modal/success-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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
    handleClick,
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
}

// Usage example:
// this.modalServiceTest.openSuccessModal({
//   title: 'Seu e-mail foi validado com sucesso!',
//   description: 'Está quase lá! Ainda falta algumas informações a serem validadas.',
//   buttonText: 'Continuar',
//   handleClick: () => console.log('chegou')
// });
