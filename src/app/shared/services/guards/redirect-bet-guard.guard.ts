import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { config } from '../../config';

@Injectable({
    providedIn: 'root'
})
export class RedirectBetGuardGuard implements CanActivate {
    canActivate(route: ActivatedRouteSnapshot): boolean {
        const codigo = route.paramMap.get('codigo');
        if (codigo) {
            window.location.href = `${config.HOST}/aposta/${codigo}`;
            return false;
        }
        return true;
    }
}
