import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { ParametroService } from './../parametros.service';

@Injectable({
    providedIn: 'root'
})
export class ParametrosResolver implements Resolve<any> {

    constructor(private parametroService: ParametroService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this.parametroService.getParametros();
    }
}
