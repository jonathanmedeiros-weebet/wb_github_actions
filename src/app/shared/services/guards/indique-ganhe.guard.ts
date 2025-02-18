import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { ParametrosLocaisService } from '../parametros-locais.service';

@Injectable({
  providedIn: 'root'
})
export class IndiqueGanheGuard  {
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
