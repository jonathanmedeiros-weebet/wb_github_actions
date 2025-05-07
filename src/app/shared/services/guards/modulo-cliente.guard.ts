import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ModuloClienteGuard  {
    constructor(
        private auth: AuthService, private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.auth.modalidadeHabilitada('modo_cliente')) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }

}
