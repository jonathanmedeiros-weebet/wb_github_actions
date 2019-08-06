import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Import our authentication service
import { ParametrosLocaisService } from '../parametros-locais.service';

@Injectable({
    providedIn: 'root'
})
export class QuininhaGuard implements CanActivate {
    constructor(
        private paramsService: ParametrosLocaisService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.paramsService.quininhaAtiva()) {
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }
}
