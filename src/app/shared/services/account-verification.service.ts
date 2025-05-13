import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountVerificationAlertComponent } from '../layout/modals/account-verification-alert/account-verification-alert.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { config } from '../config';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './utils/error.service';
import { HeadersService } from './utils/headers.service';
import { catchError, map } from 'rxjs/operators';
import { VerifyEmailOrPhoneComponent } from '../layout/modals/verify-email-or-phone/verify-email-or-phone.component';
import { ClienteService } from './clientes/cliente.service';
import { VerificationTypes } from '../enums';
import { AccountVerifiedSuccessComponent } from '../layout/modals/account-verified-success/account-verified-success.component';
import { TermsAcceptedComponent } from '../layout/modals/terms-accepted/terms-accepted.component';
import { ParametrosLocaisService } from './parametros-locais.service';
import { Router } from '@angular/router';

interface VerifiedSteps {
  phone: boolean;
  email: boolean;
  document: boolean;
  address: boolean;
}

interface VerificationAccountResponse {
  account_verified: boolean;
  verified_steps: VerifiedSteps;
  balance: string;
  new_customer: boolean;
  terms_accepted: boolean
}

interface EmailOrPhoneVerificationStepParams {
  type: VerificationTypes,
  value: string
}

const verifiedStepsDefault: VerifiedSteps = {
  phone: false,
  email: false,
  document: false,
  address: false
}

export const ACCOUNT_VERIFIED = 'accountVerified';
export const ACCOUNT_VERIFICATION_SESSION = 'av';

@Injectable({
  providedIn: 'root'
})
export class AccountVerificationService {

  public newCustomer = new BehaviorSubject<boolean>(false);
  public balance = new BehaviorSubject<number>(0);
  public accountVerified = new BehaviorSubject<boolean>(false);
  public verifiedSteps: BehaviorSubject<VerifiedSteps> = new BehaviorSubject<VerifiedSteps>(verifiedStepsDefault);
  public terms_accepted = new BehaviorSubject<boolean>(false);

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private headerService: HeadersService,
    private errorService: ErrorService,
    private clienteService: ClienteService,
    private params : ParametrosLocaisService,
    private router : Router
  ) {
    let accountVerificationStorage: VerificationAccountResponse | string | null = sessionStorage.getItem(ACCOUNT_VERIFICATION_SESSION);
    if (Boolean(accountVerificationStorage)) {
      accountVerificationStorage = JSON.parse(accountVerificationStorage) as VerificationAccountResponse;
      this.accountVerified.next(accountVerificationStorage.account_verified);
      this.verifiedSteps.next(accountVerificationStorage.verified_steps);
      this.newCustomer.next(accountVerificationStorage.new_customer);
      this.terms_accepted.next(accountVerificationStorage.terms_accepted);
      this.balance.next(parseFloat(accountVerificationStorage.balance));
    }
  }

  public getAccountVerificationDetail(): Observable<VerificationAccountResponse> {
    return this.http.get(`${config.LOKI_URL}/user/account-verification`, this.headerService.getRequestOptions(true))
      .pipe(
          map((response: VerificationAccountResponse) => {
            sessionStorage.setItem(ACCOUNT_VERIFICATION_SESSION, JSON.stringify(response));
            this.accountVerified.next(response.account_verified);
            this.verifiedSteps.next(response.verified_steps);
            this.newCustomer.next(response.new_customer);
            this.balance.next(parseFloat(response.balance));
            this.terms_accepted.next(response.terms_accepted);
            this.showMessageAccountVerified();
            return response;
          }),
          catchError(this.errorService.handleError)
      );
  }

  private showMessageAccountVerified() {
    const accountVerifiedLocalStorage = JSON.parse(localStorage.getItem(ACCOUNT_VERIFIED));
    const accountVerified = this.accountVerified.getValue();
    if(
      accountVerifiedLocalStorage != null
      && !accountVerifiedLocalStorage
      && accountVerified
    ) {
      this.openModalAccountVerifiedWithSuccess();
    }
    localStorage.setItem(ACCOUNT_VERIFIED, JSON.stringify(accountVerified))
  }

  public openModalAccountVerificationAlert(): NgbModalRef {
    const modalref: NgbModalRef = this.modalService.open(AccountVerificationAlertComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'modal-500 modal-account-verification',
      backdrop: 'static',
      keyboard: false
    });

    return modalref;
  }

  public openModalAccountVerifiedWithSuccess(): NgbModalRef {
    const modalref: NgbModalRef = this.modalService.open(AccountVerifiedSuccessComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'modal-400 modal-account-verified-success',
      backdrop: 'static',
    });

    return modalref;
  }

  public openModalTermsAccepd(): NgbModalRef {
    const modalref: NgbModalRef = this.modalService.open(TermsAcceptedComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'modal-500 modal-account-verification',
      backdrop: 'static',
    });

    return modalref;
  }

  public openModalPhoneOrEmailVerificationStep(params: EmailOrPhoneVerificationStepParams): NgbModalRef {
    const modalref: NgbModalRef = this.modalService.open(VerifyEmailOrPhoneComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'modal-400 modal-account-verification',
      backdrop: 'static',
    });

    modalref.componentInstance.verificationType = params.type;
    modalref.componentInstance.verificationValue = params.value;

    return modalref;
  }

  public requestConfirmationCode(requestType: string = VerificationTypes.EMAIL) {
    return requestType == VerificationTypes.EMAIL
      ? this.requestConfirmationCodePerEmail()
      : this.requestConfirmationCodePerPhone();
  }

  public confirmateCode(requestType: string = VerificationTypes.EMAIL, code: string = '') {
    return requestType == VerificationTypes.EMAIL
      ? this.confirmateCodePerEmail(code)
      : this.confirmateCodePerPhone(code);
  }

  private requestConfirmationCodePerEmail() {
    return this.http.get(`${config.BASE_URL}/clientes/request-email-confirmation-code`, this.headerService.getRequestOptions(true))
      .pipe(
        map((response) => response),
        catchError(this.errorService.handleError)
      );
  }

  private requestConfirmationCodePerPhone() {
    return this.clienteService.initiatePhoneValidation();
  }

  private confirmateCodePerEmail(code: string) {
    return this.http.post(`${config.BASE_URL}/clientes/verify-email-confirmation-code`, {code}, this.headerService.getRequestOptions(true))
      .pipe(
        map((response) => response),
        catchError(this.errorService.handleError)
      );
  }

  private confirmateCodePerPhone(code: string) {
    return this.clienteService.validatePhone(code);
  }

  public async openModalTermsPromise(): Promise<boolean> {
    return new Promise((resolve) => {
      const modalRef = this.openModalTermsAccepd();
      modalRef.result.then((accepted: boolean) => resolve(accepted));
    });
  }

  termAcceptRedirectDefault(routerDefault) {
    const initialPage = this.params.getOpcoes().pagina_inicial;

    if (initialPage != 'esporte') {
      const pages = {
        esporte: 'esportes/futebol',
        cassino: 'casino',
        virtual: 'vitual-sports',
        desafio: 'desafios',
        acumuladao: 'acumuladao',
        loteria: 'loterias',
        cassino_ao_vivo: 'live-casino',
        rifas: 'rifas/wall'
      }
      routerDefault = pages[initialPage];
    }

    this.router.navigate([routerDefault]);
  }
}
