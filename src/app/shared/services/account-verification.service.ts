import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountVerificationAlertComponent } from '../layout/modals/account-verification-alert/account-verification-alert.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { config } from '../config';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './utils/error.service';
import { HeadersService } from './utils/headers.service';
import { catchError, map } from 'rxjs/operators';
import { ClienteService } from './clientes/cliente.service';

interface VerifiedSteps {
  phone: boolean;
  email: boolean;
  document: boolean;
  address: boolean;
}

enum VerificationTypes {
  EMAIL = 'email',
  PHONE = 'phone'
}

interface VerificationAccountResponse {
  account_verified: boolean;
  verified_steps: VerifiedSteps;
  balance: string;
  new_customer: boolean;
}

const verifiedStepsDefault: VerifiedSteps = {
  phone: false,
  email: false,
  document: false,
  address: false
}

@Injectable({
  providedIn: 'root'
})
export class AccountVerificationService {

  public newCustomer = new BehaviorSubject<boolean>(false);
  public balance = new BehaviorSubject<number>(0);
  public accountVerified = new BehaviorSubject<boolean>(false);
  public verifiedSteps: BehaviorSubject<VerifiedSteps> = new BehaviorSubject<VerifiedSteps>(verifiedStepsDefault);

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private headerService: HeadersService,
    private errorService: ErrorService,
    private clienteService: ClienteService
  ) {}

  public getAccountVerificationDetail(): Observable<VerificationAccountResponse> {
    return this.http.get(`${config.LOKI_URL}/user/account-verification`, this.headerService.getRequestOptions(true))
      .pipe(
          map((response: VerificationAccountResponse) => {
            this.accountVerified.next(response.account_verified);
            this.verifiedSteps.next(response.verified_steps);
            this.newCustomer.next(response.new_customer);
            this.balance.next(parseFloat(response.balance));
            return response;
          }),
          catchError(this.errorService.handleError)
      );
  }

  public openModalAccountVerificationAlert(): NgbModalRef {
    const modalref: NgbModalRef = this.modalService.open(AccountVerificationAlertComponent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      windowClass: 'modal-500 modal-cadastro-cliente',
    });

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
    return this.clienteService.validatePhone(Number(code));
  }
}
