import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Import our authentication service
import { AuthService } from './../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class CombateGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.auth.modalidadeHabilitada('combate')) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
