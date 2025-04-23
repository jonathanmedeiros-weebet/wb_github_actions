import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Import our authentication service
import { AuthService } from './../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class FutsalGuard  {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.auth.modalidadeHabilitada('futsal')) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
