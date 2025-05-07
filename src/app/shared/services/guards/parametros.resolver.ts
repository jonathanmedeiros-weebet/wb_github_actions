import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ParametrosLocaisService } from './../parametros-locais.service';

@Injectable({
    providedIn: 'root'
})
export class ParametrosResolver  {

    constructor(private paramsService: ParametrosLocaisService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this.paramsService.getParametros();
    }
}
