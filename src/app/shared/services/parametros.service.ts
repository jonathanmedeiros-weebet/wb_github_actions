import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { ErrorService } from './utils/error.service';
import { HeadersService } from './utils/headers.service';
import { config } from '../config';

@Injectable({
    providedIn: 'root'
})
export class ParametroService {
    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getParametros(): Observable<any> {
        const url = `${config.SPORTS_URL}/parametros`;
        const token = localStorage.getItem('token');
        const requestOptions = token ? this.header.getRequestOptions(true) : this.header.getRequestOptions();

        return this.http.get(url, requestOptions)
            .pipe(
                tap((res: any) => {
                    const parametros = res.results;
                    localStorage.setItem('cotacoes_locais', JSON.stringify(parametros['cotacoes_local']));
                    localStorage.setItem('campeonatos_bloqueados', JSON.stringify(parametros['campeonatos_bloqueados']));
                    localStorage.setItem('tipos_aposta', JSON.stringify(parametros['tipos_aposta']));
                    localStorage.setItem('opcoes', JSON.stringify(parametros['opcoes']));
                }),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getOddsImpressao() {
        const tiposAposta = JSON.parse(localStorage.getItem('tipos_aposta'));
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
