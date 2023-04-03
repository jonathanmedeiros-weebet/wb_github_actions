import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { ParametrosLocaisService } from '../parametros-locais.service';

@Injectable({
    providedIn: 'root'
})
export class HomeGuard implements CanActivate {

    pages = {
        esporte: 'esportes',
        cassino: 'casino/c',
        virtual: 'casino/v',
        desafio: 'desafios',
        acumuladao: 'acumuladao',
        loteria: 'loterias'
    }

    constructor(
        private paramsService: ParametrosLocaisService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const { pagina_inicial } = this.paramsService.getOpcoes();
    
        if (pagina_inicial) {
            this.router.navigate([this.pages[pagina_inicial]]);
            return false;
        }

        this.router.navigate([this.pages['esporte']]);
        return false;
    }
}
