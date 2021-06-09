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
        const url = `${this.ApostaUrl}/buscar/${codigo}`;
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

    cancelar(id): Observable<any> {
        const url = `${this.ApostaUrl}/${id}`;

        return this.http.delete(url, this.header.getRequestOptions(true))
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
}
