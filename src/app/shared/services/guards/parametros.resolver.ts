import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { ParametrosLocaisService } from './../parametros-locais.service';

@Injectable({
    providedIn: 'root'
})
export class ParametrosResolver implements Resolve<any> {

    constructor(private paramsService: ParametrosLocaisService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this.paramsService.getParametros();
    }
}
