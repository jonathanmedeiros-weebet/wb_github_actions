import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ParametrosLocaisService } from '../parametros-locais.service';

@Injectable({
  providedIn: 'root'
})
export class LoteriaPopularGuard  {
    constructor(
        private paramsService: ParametrosLocaisService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.paramsService.loteriaPopularAtiva()) {
            if (this.paramsService.quininhaAtiva() || this.paramsService.seninhaAtiva()) {
                this.router.navigate(['/loterias']);
                return true;
            }
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }
}
