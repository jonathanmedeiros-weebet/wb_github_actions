import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SuperoddGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.auth.modalidadeHabilitada('superodd')) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
