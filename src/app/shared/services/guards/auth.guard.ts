import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

// Import our authentication service
import { AuthService } from './../auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../../layout/modals';

export const exceptionRouteAuthGuard = ['/clientes/deposito'];

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private auth: AuthService,
        private router: Router,
        private modalService: NgbModal,
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (this.auth.isExpired()) {
            this.auth.performLogout('expired session');
            return false;
        }

        if (!this.auth.isLoggedIn() && exceptionRouteAuthGuard.includes(state.url)) {
            const isLogged = await this.requestLogin();
            if (isLogged) {
                location.reload();
                return true;
            }
        }

        // If user is not logged in we'll send them to the homepage
        if (!this.auth.isLoggedIn()) {
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }

    private requestLogin(): Promise<boolean> {
        return new Promise((resolve) => {
            const modalRef = this.modalService.open(LoginModalComponent, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'md',
                centered: true,
                windowClass: 'modal-550 modal-h-350 modal-login',
            });

            modalRef.result.then((isLogged: boolean) => resolve(isLogged));
        });
    }
}
