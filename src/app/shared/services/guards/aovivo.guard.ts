import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Import our authentication service
import { AuthService } from './../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AoVivoGuard  {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // If user is not logged in we'll send them to the homepage
        if (!this.auth.liveIsActive()) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
