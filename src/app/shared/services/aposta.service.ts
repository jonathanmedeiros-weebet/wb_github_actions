import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { HeadersService } from './utils/headers.service';
import { ErrorService } from './utils/error.service';
import { ApostaEsportiva } from './../../models';
import { config } from '../config';

@Injectable()
export class ApostaService {
    private ApostaUrl = `${config.BASE_URL}/apostas`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }


    getAposta(id: number, queryParams?): Observable<any> {
        const url = `${this.ApostaUrl}/${id}`;
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(url, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getApostaByCodigo(codigo: string, queryParams?): Observable<any> {
        const url = `${config.BASE_URL}/apostas-por-codigo/${codigo}`;
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(url, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getApostaByCodigoCassino(codigo: string): Observable<any> {
        const url = `${config.BASE_URL}/apostas-cassino-por-codigo/${codigo}`;
        let requestOptions = this.header.getRequestOptions(true);

        return this.http.get(url, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );

    }

    cancelar(dados): Observable<any> {
        const url = `${this.ApostaUrl}/${dados.id}/cancelar`;

        return this.http.post(url, { version: dados.version }, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                catchError(this.errorService.handleError)
            );
    }

    pagar(id) {
        const url = `${this.ApostaUrl}/${id}/pagamento`;

        return this.http.post(url, '', this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    simularEncerramento(item): Observable<any> {
        const url = `${this.ApostaUrl}/simular-encerramento?aposta=` + JSON.stringify(item);

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    encerrarAposta(dados): Observable<any> {
        const url = `${this.ApostaUrl}/encerrar-aposta`;

        return this.http.post(url, dados, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
