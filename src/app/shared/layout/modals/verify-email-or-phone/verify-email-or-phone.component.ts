import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/services';
import { AccountVerificationService } from 'src/app/shared/services/account-verification.service';

enum VerificationTypes {
  EMAIL = 'email',
  PHONE = 'phone'
}

@Component({
  selector: 'app-verify-email-or-phone',
  templateUrl: './verify-email-or-phone.component.html',
  styleUrls: ['./verify-email-or-phone.component.scss']
})
export class VerifyEmailOrPhoneComponent implements OnInit {
  @ViewChildren('codeInputs') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;

  private verificationType: string = VerificationTypes.EMAIL;
  private verificationValue: string = 'teste@teste.com';
  public confirmCodeForm: FormGroup;
  public showModalSuccess: boolean = false;
  public time: number = 30;

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private accountVerificationService: AccountVerificationService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  get verificationTypeIsEmail() {
    return this.verificationType == VerificationTypes.EMAIL;
  }

  get title() {
    const verificationTypeName = this.verificationTypeIsEmail ? 'e-mail' : 'telefone';
    return `Verifique seu ${verificationTypeName}`;
  }

  get description() {
    const verificationTypeName = this.verificationTypeIsEmail ? 'e-mail' : 'número';
    return `Um código de verificação foi enviado para o seu ${verificationTypeName} <strong class="color-primary">${this.verificationValue}</strong>. Por favor, insira o código abaixo para confirmar sua conta.`;
  }

  get resendCodeTitle() {
    const verificationTypeName = this.verificationTypeIsEmail ? 'e-mail' : 'SMS';
    return `Não recebeu o ${verificationTypeName}?`;
  }

  get supportTitle() {
    const verificationTypeName = this.verificationTypeIsEmail ? 'e-mail' : 'SMS';
    return `Problemas com o ${verificationTypeName}?`;
  }

  get successTitle() {
    const verificationTypeName = this.verificationTypeIsEmail ? 'E-mail' : 'Telefone';
    return `${verificationTypeName} verificado com sucesso!`;
  }

  get successDescription() {
    const verificationTypeName = this.verificationTypeIsEmail ? 'e-mail' : 'telefone';
    return `Seu ${verificationTypeName} foi verificado com sucesso! Agora, você pode usá-lo para recuperar sua senha com facilidade sempre que precisar.`;
  }

  get showSupportSection() {
    return false;
  }

  get disableResendCodeButton() {
    return this.time > 0;
  }

  ngOnInit(): void {
    this.requestConfirmationCode();
    this.initForm();
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
  }

  private requestConfirmationCode() {
    this.accountVerificationService
      .requestConfirmationCode(this.verificationType)
      .toPromise()
      .then(() => {
        const translateKey = this.verificationType == VerificationTypes.EMAIL
          ? 'senhas.codigoDeVerificacaoPorEmail'
          : 'senhas.codigoDeVerificacaoPorSms'
        this.messageService.success(this.translate.instant(translateKey));
        this.initResendCodeTime();
      })
      .catch((error) => {
        this.messageService.error(error);
        this.initResendCodeTime();
      });
  }

  public onInput(event: InputEvent, index: number) {
    event.preventDefault();
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
    event.preventDefault();
    const isBackspace = event.key == 'Backspace';
    const isNumber = event.key.match(/^\d$/);

    if (isBackspace && index > 0) {
      this.codeInputs.get(index - 1).nativeElement.focus();
      this.codeInputs.get(index - 1).nativeElement.value = '';
    } else if(Boolean(this.codeInputs.get(index).nativeElement.value) && isNumber) {
      const inputEvent = new InputEvent("input", {
        data: event.key,
        bubbles: true,
        cancelable: true,
      });
      this.codeInputs.get(index).nativeElement.value = event.key;
      this.onInput(inputEvent, index)
    }
  }

  public onPaste(event: any) {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text/plain');
    this.codeInputs.forEach((input, index) => {
      input.nativeElement.value = pastedData[index];
    });
    this.codeInputs.last.nativeElement.focus();
  }

  public handleConfirmCode() {
    if (!this.confirmCodeForm.valid) return;

    const code = this.prepareCode();
    this.accountVerificationService
      .confirmateCode(this.verificationType, code)
      .toPromise()
      .then(() => this.showModalSuccess = true)
      .catch((error) => this.messageService.error(error))
  }

  public handleResendCode() {
    this.requestConfirmationCode();
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