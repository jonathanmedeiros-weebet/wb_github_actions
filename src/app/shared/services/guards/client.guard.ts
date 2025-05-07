import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Import our authentication service
import { AuthService } from './../auth/auth.service';
import { exceptionRouteAuthGuard } from './auth.guard';

@Injectable({
    providedIn: 'root'
})
export class ClientGuard  {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const cleanUrl = state.url.split('?')[0];
        if (!this.auth.isCliente() && !exceptionRouteAuthGuard.includes(cleanUrl)) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
