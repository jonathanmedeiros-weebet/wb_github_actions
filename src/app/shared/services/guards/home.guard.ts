import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ParametrosLocaisService } from '../parametros-locais.service';

@Injectable({
    providedIn: 'root'
})
export class HomeGuard  {

    pages = {
        esporte: 'esportes',
        cassino: 'casino',
        virtual: 'vitual-sports',
        desafio: 'desafios',
        acumuladao: 'acumuladao',
        loteria: 'loterias',
        cassino_ao_vivo: 'live-casino',
        rifas: 'rifas/wall'
    }

    constructor(
        private paramsService: ParametrosLocaisService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
        const { pagina_inicial, casino, esporte, betby } = this.paramsService.getOpcoes();

        if (betby) {
            this.pages.esporte = 'sports';
        }

        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras?.state;

        let navigateOptions = { queryParams: route.queryParams };

        if (state?.fromRegistration) {
            navigateOptions['skipLocationChange'] = true;
        }

        if (pagina_inicial) {
            if (pagina_inicial == 'home' && casino && (esporte || betby)) {
                return true;
            }

            this.router.navigate([this.pages[pagina_inicial]], navigateOptions);
            return false;
        }

        this.router.navigate([this.pages['esporte']], navigateOptions);
        return false;
    }
}
