import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

// Import our authentication service
import { AuthService } from './../auth/auth.service';
import { exceptionRouteAuthGuard } from './auth.guard';

@Injectable({
    providedIn: 'root'
})
export class ClientGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.auth.isCliente() && !exceptionRouteAuthGuard.includes(state.url)) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
