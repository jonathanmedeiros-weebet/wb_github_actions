import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Import our authentication service
import { ParametrosLocaisService } from '../parametros-locais.service';

@Injectable({
    providedIn: 'root'
})
export class QuininhaGuard  {
    constructor(
        private paramsService: ParametrosLocaisService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.paramsService.quininhaAtiva()) {
            if (this.paramsService.seninhaAtiva()) {
                this.router.navigate(['/loterias/seninha']);
                return true;
            }
            if (this.paramsService.loteriaPopularAtiva()) {
                this.router.navigate(['/loterias/loteria-popular']);
                return true;
            }
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }
}
