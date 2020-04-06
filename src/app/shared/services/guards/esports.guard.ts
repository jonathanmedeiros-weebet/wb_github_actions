import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

// Import our authentication service
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class EsportsGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.auth.modalidadeHabilitada('esports')) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
