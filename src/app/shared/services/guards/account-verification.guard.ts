import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AccountVerificationService } from '../account-verification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountVerificationGuard implements CanActivate {
  constructor(
    private accountVerificationService: AccountVerificationService,
    private router: Router,
    private authService: AuthService
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    void next;

    if(this.authService.isLoggedIn() && this.authService.isCliente()) {

      const nextUrl = state.url;
      const previousUrl = window.location.pathname;

      const termsAccepted: boolean = this.accountVerificationService.terms_accepted.getValue();
      if (!termsAccepted) {
        const hasModalOpen = document.getElementById('terms-accepted');
        if (hasModalOpen) {
          return true;
        }

        const termExceptions = [
          '/clientes/saque'
        ];
        
        if(!termExceptions.includes(nextUrl)) {
          const termsResult = await this.openModalTerms();
          if (!termsResult) {
            if (previousUrl === nextUrl) {
              return this.router.navigate(['/']);
            } else {
              return false;
            }
          }
        }

        const accountVerified: boolean = this.accountVerificationService.accountVerified.getValue();
        if (accountVerified) {
          return true;
        } else {
          const isClosed = await this.openModalAccountVerifications();
          if(isClosed && previousUrl == nextUrl) {
            return this.router.navigate(['/']);
          }
        }
      } else {
        const accountVerified: boolean = this.accountVerificationService.accountVerified.getValue();
        if (accountVerified) {
          return true;
        } else {
          const isClosed = await this.openModalAccountVerifications();
          if(isClosed && previousUrl == nextUrl) {
            return this.router.navigate(['/']);
          }
        }
      }

      return false;
    } else {
      return true;
    }
  }

  private async openModalTerms() {
    return new Promise((resolve) => {
      const modalRef = this.accountVerificationService.openModalTermsAccepd();
        modalRef.result.then((accepted) => resolve(accepted));
    });
  }

  private async openModalAccountVerifications() {
    return new Promise((resolve) => {
      const modalRef = this.accountVerificationService.openModalAccountVerificationAlert();
        modalRef.result.then((closed) => resolve(closed));
    });
  }
}
