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
        } else {
          await this.openModalTerms();

          const accountVerified: boolean = this.accountVerificationService.accountVerified.getValue();
          if (accountVerified) {
            return true;
          } else {
            const isClosed = await this.openModalAccountVerifications();
            if(isClosed) {
              if (previousUrl == nextUrl) {
                return this.router.navigate(['/']);
              }
            }
          }
        }
      } else {
        const accountVerified: boolean = this.accountVerificationService.accountVerified.getValue();
        if (accountVerified) {
          return true;
        } else {
          const isClosed = await this.openModalAccountVerifications();
          if(isClosed) {
            if (previousUrl == nextUrl) {
              return this.router.navigate(['/']);
            }
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
      modalRef.result.then((resp) => resolve(resp));
    });
  }

  private async openModalAccountVerifications() {
    return new Promise((resolve) => {
      const modalRef = this.accountVerificationService.openModalAccountVerificationAlert();
      modalRef.result.then((resp) => resolve(resp));
    });
  }
          // modalRef.result.then(() => {

          //   const accountVerified: boolean = this.accountVerificationService.accountVerified.getValue();
          //   if (accountVerified) {
          //     return true;
          //   }

          //   const modalRef = this.accountVerificationService.openModalAccountVerificationAlert();
          //   modalRef.result.then((isClosed) => {
          //     if (isClosed) {
          //       if (previousUrl == nextUrl) {
          //         return this.router.navigate(['/']);
          //       }
          //     } 
          //   });

          // });
  // }
}