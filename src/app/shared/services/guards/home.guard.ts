import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { ParametrosLocaisService } from '../parametros-locais.service';

@Injectable({
    providedIn: 'root'
})
export class HomeGuard implements CanActivate {

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

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const { pagina_inicial, casino, esporte } = this.paramsService.getOpcoes();

        if (pagina_inicial) {
            if (pagina_inicial == 'home' && casino && esporte) {
                return true;
            }

            this.router.navigate([this.pages[pagina_inicial]], { queryParams: route.queryParams });
            return false;
        }

        this.router.navigate([this.pages['esporte']], { queryParams: route.queryParams });
        return false;
    }
}
