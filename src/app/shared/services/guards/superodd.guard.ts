import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Import our authentication service
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SuperoddGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // If user is not logged in we'll send them to the homepage
        if (!this.auth.modalidadeHabilitada('superodd')) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
