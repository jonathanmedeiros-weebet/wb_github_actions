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

    getOddsImpressao() {
        const tiposAposta = ParametrosLocais.getTiposAposta();
        const oddsImpressao = [];
        for (const key in tiposAposta) {
            if (tiposAposta.hasOwnProperty(key)) {
                const tipoAposta = tiposAposta[key];
                if (parseInt(tipoAposta.exibirImpressao, 10)) {
                    oddsImpressao.push(key);
                }
            }
        }
        return oddsImpressao;
    }

}
