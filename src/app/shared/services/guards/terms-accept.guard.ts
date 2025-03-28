import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AccountVerificationService } from '../account-verification.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TermsAcceptGuard implements CanActivate {


  constructor(
    private accountVerificationService: AccountVerificationService,
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    void next;

    if (this.authService.isLoggedIn() && this.authService.isCliente()) {

      const nextUrl = state.url;
      const previousUrl = window.location.pathname;

      const termsAccepted: boolean = this.accountVerificationService.terms_accepted.getValue();
      if (termsAccepted) {
        return true;
      }

      const modalRef = this.accountVerificationService.openModalTermsAccepd();
      modalRef.result.then((isClosed) => {
        if (isClosed) {
          if (previousUrl == nextUrl) {
            return this.router.navigate(['/']);
          }
        }
      });

      return false;
    } else {
      return true;
    }
  }
}
