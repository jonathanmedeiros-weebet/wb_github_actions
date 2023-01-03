import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

// Import our authentication service
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class CambistaGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.auth.isCliente()) {
            this.router.navigate(['/esportes/futebol/jogos']);
            return false;
        }
        return true;
    }
}
