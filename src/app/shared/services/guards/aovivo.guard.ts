import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';
// Import our authentication service
import { AuthService } from './../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AoVivoGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // If user is not logged in we'll send them to the homepage
        if (!this.auth.hasAoVivo()) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
