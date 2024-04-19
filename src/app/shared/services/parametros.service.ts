import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorService } from './utils/error.service';
import { HeadersService } from './utils/headers.service';
import { config } from '../config';
import {AuthService} from './auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ParametroService {
    parametrosSource = new BehaviorSubject<any>({});
    parametros = this.parametrosSource.asObservable();

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService,
        private auth: AuthService
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

    getOdds(): Observable<any> {
        const url = `${config.LOKI_URL}/parameters/bet-type`;
        const token = localStorage.getItem('token');
        let requestOptions;

        if (token && !this.auth.isCliente()) {
            requestOptions = this.header.getRequestOptions(true);
        } else {
            requestOptions = this.header.getRequestOptions();
        }

        return this.http.get(url, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
