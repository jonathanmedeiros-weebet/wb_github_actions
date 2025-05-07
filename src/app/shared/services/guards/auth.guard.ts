import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Import our authentication service
import { AuthService } from './../auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../../layout/modals';

export const exceptionRouteAuthGuard = ['/clientes/deposito'];

@Injectable({
    providedIn: 'root'
})
export class AuthGuard  {
    constructor(
        private auth: AuthService,
        private router: Router,
        private modalService: NgbModal,
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (this.auth.isExpired()) {
            this.auth.performLogout('expired session').subscribe();
            return false;
        }

        const cleanUrl = state.url.split('?')[0];

        if (!this.auth.isLoggedIn() && exceptionRouteAuthGuard.includes(cleanUrl)) {
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
                windowClass: 'modal-400 modal-h-350 modal-login',
            });
            modalRef.result.then((isLogged: boolean) => resolve(isLogged))
        });
    }
}
