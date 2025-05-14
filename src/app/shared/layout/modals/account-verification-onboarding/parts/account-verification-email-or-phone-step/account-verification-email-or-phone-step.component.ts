import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { AccountVerificationService, ClienteService, MaskAnonymizationTypes, MessageService, UtilsService } from 'src/app/services';
import { AccountVerificationTypes } from 'src/app/shared/enums';
import { ModalControllerService } from 'src/app/shared/services/modal-controller.service';

@Component({
  selector: 'app-account-verification-email-or-phone-step',
  templateUrl: './account-verification-email-or-phone-step.component.html',
  styleUrl: './account-verification-email-or-phone-step.component.scss'
})
export class AccountVerificationEmailOrPhoneStepComponent {
  @ViewChildren('codeInputs') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @Output() onAdvance = new EventEmitter();
  @Input() verificationType: AccountVerificationTypes = AccountVerificationTypes.EMAIL;
  @Input() verificationValue: string = '';

  public confirmCodeForm: FormGroup;
  public time: number = 30;
  public title: string = '';
  public description: string = '';
  public resendCodeText: string = '';
  public showLoading: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private accountVerificationService: AccountVerificationService,
    private messageService: MessageService,
    private translate: TranslateService,
    private clienteService: ClienteService,
    private modalController: ModalControllerService,
    private utilsService: UtilsService
  ) {}

  get verificationTypeIsEmail() {
    return this.verificationType == AccountVerificationTypes.EMAIL;
  }

  get showSupportSection() {
    return false;
  }

  get disableResendCodeButton() {
    return this.time > 0;
  }

  async ngOnInit(): Promise<void> {
    // todo: mover para onboarding na task de divida técnica
    const user = this.clienteService.getUser();
    const customer = await this.clienteService.getCliente(user.id).toPromise();
    this.verificationValue = this.verificationTypeIsEmail ? customer.email : customer.telefone;
    
    this.initTranslateInfo();
    this.requestConfirmationCode();
    this.initForm();
  }

  private initTranslateInfo() {
    setTimeout(() => {
      const maskedVerificationValueAnonymously = this.utilsService.applyMaskAnonymization(
        this.verificationValue,
        this.verificationTypeIsEmail ? MaskAnonymizationTypes.EMAIL : MaskAnonymizationTypes.PHONE
      );

      const verificationTypeName = this.verificationTypeIsEmail ? this.translate.instant('email') : 'SMS';
      this.title = this.translate.instant('accountVerification.enterTheVerificationCode', { verificationType: verificationTypeName });
      this.resendCodeText = this.translate.instant('accountVerification.dontReceiveTheEmail', { verificationType: verificationTypeName });
      this.description = this.verificationTypeIsEmail
        ? this.translate.instant('accountVerification.verificationCodeHasBeenSentToEmail', { email: `<strong class="color-primary">${maskedVerificationValueAnonymously}</strong>` })
        : this.translate.instant('accountVerification.verificationCodeHasBeenSentToPhone', { phone: `<strong class="color-primary">${maskedVerificationValueAnonymously}</strong>` })
    },50)
  }
  
  private initForm() {
    this.confirmCodeForm = this.fb.group({
      code1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code5: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code6: ['', [Validators.required, Validators.pattern(/^\d$/)]]
    });
    setTimeout(() => this.codeInputs.get(0)?.nativeElement.focus(), 500);

    this.confirmCodeForm
      .valueChanges
      .pipe(debounceTime(300))
      .subscribe((formValues) => {
        const hasFieldPending = Object.values(formValues).some(value => !Boolean(value));
        if (!hasFieldPending) {
          this.handleConfirmCode();
        }
      })
  }

  private requestConfirmationCode() {
    this.initResendCodeTime();

    this.accountVerificationService
      .requestConfirmationCode(this.verificationType)
      .toPromise()
      .then(() => {
        if (this.verificationType == AccountVerificationTypes.EMAIL) {
          this.messageService.success(this.translate.instant('senhas.codigoDeVerificacaoPorEmail'));
        }
      })
      .catch((error) => {
        this.messageService.error(error);
      });
  }

  public onInput(event: InputEvent, index: number) {
    const value = event.data ?? '';
    const isNumber = value.match(/^\d$/);
    const isEmpty = value == '';

    if (isNumber && index < 5) {
      this.codeInputs.get(index + 1).nativeElement.focus();
    }

    if(!isNumber && !isEmpty) {
      this.codeInputs.get(index).nativeElement.value = '';
    }
  }

  public onKeyup(event: KeyboardEvent, index: number) {
    const isBackspace = event.key == 'Backspace';
    const isNumber = event.key.match(/^\d$/);

    if (isBackspace && index > 0) {
      this.codeInputs.get(index).nativeElement.value = '';
      this.codeInputs.get(index - 1).nativeElement.focus();
    } else if(Boolean(this.codeInputs.get(index).nativeElement.value) && isNumber) {
      const inputEvent = new InputEvent("input", {
        data: event.key,
        bubbles: true,
        cancelable: true,
      });
      this.codeInputs.get(index).nativeElement.value = event.key;

      const formControlIndex = index + 1;
      this.confirmCodeForm.get(`code${formControlIndex}`).setValue(event.key);
      this.onInput(inputEvent, index)
    }
  }

  public async onPaste(event: any) {
    event.preventDefault();

    const pastedData = await navigator.clipboard.readText();
    const isNotNumber = !isNaN(Number(pastedData));
    if(!isNotNumber) return;

    Object.keys(this.confirmCodeForm.controls).forEach((controlKey, index) => {
      this.confirmCodeForm.controls[controlKey].setValue(pastedData[index]);
    });
    this.codeInputs.last.nativeElement.focus();
    this.confirmCodeForm.updateValueAndValidity();
  }

  public handleConfirmCode() {
    if (!this.confirmCodeForm.valid) return;
    this.showLoading = true;

    const code = this.prepareCode();
    this.accountVerificationService
      .confirmateCode(this.verificationType, code)
      .toPromise()
      .then(() => {
        this.showSuccessModal();
        setTimeout(() => this.showLoading = false, 500);
      })
      .catch((error) => {
        this.messageService.error(error);
        setTimeout(() => this.showLoading = false, 500);
      });
  }

  public handleResendCode() {
    this.requestConfirmationCode();
  }

  public handleOpenRulesModal() {
    this.modalController.openAccountVerificationInformationSteps();
  }

  private showSuccessModal() {
    const verificationTypeName = this.verificationTypeIsEmail
      ? this.translate.instant('email')
      : this.translate.instant('telefone');

    const title = this.translate.instant('accountVerification.validationWithSuccess', { verificationType: verificationTypeName });
    const description = this.verificationTypeIsEmail
      ? this.translate.instant('accountVerification.almostDoneMessage')
      :this.translate.instant('accountVerification.accessIsAlmostReadyMessage');
    
    this.modalController.openSuccessModal({
      title,
      description,
      buttonText: this.translate.instant('botoes.continue'),
      handleClick: () => this.onAdvance.emit()
    });
  }

  public handleOpenHelpModal() {
    this.modalController.openAccountVerificationInformationSteps(this.verificationType);
  }

  public handleClose(action: string = 'close') {
    this.activeModal.close(action);
  }

  private prepareCode() {
    return Object.values(this.confirmCodeForm.value).join('');
  }

  private initResendCodeTime() {
    const duration = 30;
    const startTime = performance.now();
    const endTime = startTime + duration * 1000;

    const updateCountdown = () => {
      const now = performance.now();
      this.time = Math.max(0, Math.ceil((endTime - now) / 1000));

      if (this.time > 0) {
        requestAnimationFrame(updateCountdown);
      }
    }

    updateCountdown();
  }
}
