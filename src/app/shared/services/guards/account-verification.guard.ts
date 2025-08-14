import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AccountVerificationService } from '../account-verification.service';
import { AuthService } from '../auth/auth.service';
import { ModalControllerService } from '../modal-controller.service';
import { ParametrosLocaisService } from '../parametros-locais.service';
import { NavigationHistoryService } from '../navigation-history.service';

@Injectable({
  providedIn: 'root'
})
export class AccountVerificationGuard implements CanActivate {
  constructor(
    private accountVerificationService: AccountVerificationService,
    private modalControllerService: ModalControllerService,
    private router: Router,
    private authService: AuthService,
    private paramLocais: ParametrosLocaisService,
    private navigationHistoryService: NavigationHistoryService
  ) {}

  homePageUrl = {
    'home': '/',
    'esporte': this.paramLocais.getOpcoes().betby ? '/sports' : '/esportes/futebol',
    'cassino': '/casino',
    'cassino_ao_vivo': '/live-casino',
    'rifa': '/rifas/wall',
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    void next;
    const nextUrl = state.url;
    const previousUrl = this.navigationHistoryService.getPreviousUrlManual();
    const homePage = this.paramLocais.getOpcoes().pagina_inicial;

    if (this.authService.isLoggedIn() && this.authService.isCliente()) {
      const hasModalTermsAcceptedOpen = document.getElementById('terms-accepted');

      if (hasModalTermsAcceptedOpen) {
        return true;
      }

      const navigation: any = this.router.getCurrentNavigation();
      const applyAccountVerificationGuardInSyncMode = navigation?.extras?.applyAccountVerificationGuardInSyncMode ?? false;

      if (previousUrl === nextUrl || applyAccountVerificationGuardInSyncMode) {
        this.defineGuardScope(nextUrl);
        
        if (this.homePageUrl[homePage] == nextUrl) {
          return true;
        }

        const { termsAccepted, addressVerified, accountVerified } = await this.accountVerificationService.getForceAccountVerificationDetail(false);
        if (!termsAccepted || !addressVerified || !accountVerified) {
          this.navigationHistoryService.setPreviousUrlManual(this.homePageUrl[homePage])
          this.router.navigate([this.homePageUrl[homePage]]);
        }

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
    const { termsAccepted, addressVerified, accountVerified } = await this.accountVerificationService.getForceAccountVerificationDetail();

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
    
    if (!accountVerified) {
      const hasModalAccountVerificationOpen = document.getElementById('account-verification-alert');
      if (hasModalAccountVerificationOpen) return false;

      this.openModalAccountVerifications();
      return false;
      
    } else if (!addressVerified) {
      const addressExceptions = [
        '/welcome',
        '/clientes/personal-data',
        '/clientes/personal-data?openAddressAccordion=true'
      ];

      if(!addressExceptions.includes(nextUrl)) {
        const hasModalAddressVerifiedOpen = document.getElementById('account-verified-address');
        if (hasModalAddressVerifiedOpen) return false;
        await this.openModalAccountVerifiedAddress();
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

  private async openModalAccountVerifiedAddress() {
    return new Promise((resolve) => {
      const modalRef = this.modalControllerService.openAccountVerifiedAddressModal();
      modalRef.result.then((closed) => resolve(closed));
    });
  }
}
