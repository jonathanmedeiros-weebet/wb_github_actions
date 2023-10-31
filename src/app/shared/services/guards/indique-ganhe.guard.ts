import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';

import { ParametrosLocaisService } from '../parametros-locais.service';

@Injectable({
  providedIn: 'root'
})
export class IndiqueGanheGuard implements CanActivate {
    constructor(
        private paramsService: ParametrosLocaisService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.paramsService.indiqueGanheHabilitado()) {
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }
  
}
