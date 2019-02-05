import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { ErrorService } from './utils/error.service';
import { HeadersService } from './utils/headers.service';
import { config } from '../config';
import { ParametrosLocais } from '../utils/parametros-locais';

@Injectable({
    providedIn: 'root'
})
export class ParametroService {
    parametrosSource = new BehaviorSubject<any>({});
    parametros = this.parametrosSource.asObservable();

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    atualizarParametros(parametros) {
        this.parametrosSource.next(parametros);
    }

    getParametros(): Observable<any> {
        const url = `${config.SPORTS_URL}/parametros?cotacoes_locais_2`;
        const token = localStorage.getItem('token');
        const requestOptions = token ? this.header.getRequestOptions(true) : this.header.getRequestOptions();

        return this.http.get(url, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getParametrosLocais(): Observable<any> {
        console.log("getParametrosLocais");
        const time = + new Date();
        return this.http.get(`./param/parametros.json?${time}`);
    }
}
