import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountVerificationAlertComponent } from '../layout/modals/account-verification-alert/account-verification-alert.component';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { config } from '../config';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './utils/error.service';
import { HeadersService } from './utils/headers.service';
import { catchError, map } from 'rxjs/operators';

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
    private errorService: ErrorService
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
}
