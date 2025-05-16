import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AccountVerificationService } from '../account-verification.service';
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
    const nextUrl = state.url;
    const previousUrl = window.location.pathname;

    if(this.authService.isLoggedIn() && this.authService.isCliente()) {
      const hasModalTermsAcceptedOpen = document.getElementById('terms-accepted');
      const hasModalAccountVerificationOpen = document.getElementById('account-verification-alert');

      if (hasModalTermsAcceptedOpen || hasModalAccountVerificationOpen) {
        return true;
      }

      if(previousUrl == nextUrl) {
        this.router.navigate(['/'], { skipLocationChange: true, state: { fromRegistration: false } });
        this.defineGuardScope(previousUrl, nextUrl);
        return true;
      } else {
        const isContinue = await this.defineGuardScope(previousUrl, nextUrl);
        return isContinue;
      }
    } else {
      return true;
    }
  }

  private async defineGuardScope(previousUrl: string, nextUrl: string) {
    const termsAccepted: boolean = this.accountVerificationService.terms_accepted.getValue();
    if (!termsAccepted) {
      const hasModalTermsAcceptedOpen = document.getElementById('terms-accepted');
      if (hasModalTermsAcceptedOpen) return false;

      const termExceptions = [
        '/clientes/saque'
      ];
      
      if(!termExceptions.includes(nextUrl)) {
        const termsResult = await this.openModalTerms();
        if (!termsResult) {
          return false;
        }
      }
    }
    
    const accountVerified: boolean = this.accountVerificationService.accountVerified.getValue();
    if (!accountVerified) {
      const hasModalAccountVerificationOpen = document.getElementById('account-verification-alert');
      if (hasModalAccountVerificationOpen) return false;

      await this.openModalAccountVerifications();
    }

    return true;
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
