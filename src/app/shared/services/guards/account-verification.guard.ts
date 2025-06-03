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

    if (this.authService.isLoggedIn() && this.authService.isCliente()) {
      const hasModalTermsAcceptedOpen = document.getElementById('terms-accepted');

      if (hasModalTermsAcceptedOpen) {
        return true;
      }

      if (previousUrl == nextUrl) {
        this.router.navigate(['/']);
        this.defineGuardScope(nextUrl);
        return true;
      } else {
        const isContinue = await this.defineGuardScope(nextUrl);
        return isContinue;
      }
    } else {
      return true;
    }
  }

  private async defineGuardScope(nextUrl: string) {
    const { termsAccepted } = await this.accountVerificationService.getForceAccountVerificationDetail();

    if (!termsAccepted) {
      const hasModalTermsAcceptedOpen = document.getElementById('terms-accepted');
      if (hasModalTermsAcceptedOpen) return false;

      const termExceptions = [
        '/clientes/saque'
      ];
      
      if (!termExceptions.includes(nextUrl)) {
        const termsResult = await this.openModalTerms();
        if (!termsResult) {
          return false;
        }
      }
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
