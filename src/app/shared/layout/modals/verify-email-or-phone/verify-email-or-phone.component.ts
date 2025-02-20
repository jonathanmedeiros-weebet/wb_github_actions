import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
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

  ngOnInit(): void {
    this.confirmCodeForm = this.fb.group({
      code1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      code5: ['', [Validators.required, Validators.pattern(/^\d$/)]]
    });

    setTimeout(() => this.codeInputs.get(0)?.nativeElement.focus(), 500);
  }

  public onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.match(/^\d$/) && index < 4) {
      this.codeInputs.get(index + 1)?.nativeElement.focus();
    } else if (value === '' && index > 0) {
      this.codeInputs.get(index - 1)?.nativeElement.focus();
    }
  }

  public handleConfirmCode() {
    if (this.confirmCodeForm.valid) {
      const code = Object.values(this.confirmCodeForm.value).join('');
      console.log('Código enviado:', code);
    }
    
    this.showModalSuccess = true;
    //todo: Realizar requisição para a api
  }

  public handleResendCode() {
    //todo: Realizar requisição para a api
  }

  public handleClose(action: string = 'close') {
    this.activeModal.close(action);
  }
}
