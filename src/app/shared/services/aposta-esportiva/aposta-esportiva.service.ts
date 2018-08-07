import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { ApostaEsportiva } from './../../../models';
import { config } from '../../config';

@Injectable()
export class ApostaEsportivaService {
    private ApostaUrl = `${config.SPORTS_URL}/apostas`; // URL to web api

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getApostas(queryParams?: any): Observable<any> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        const url = `assets/apostas.json`;

        return this.http.get(url, requestOptions)
            .pipe(
                // map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getAposta(id: number): Observable<ApostaEsportiva> {
        const url = `${this.ApostaUrl}/${id}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    apostaPorCodigo(codigo: number): Observable<ApostaEsportiva> {
        // const url = `${this.ApostaUrl}/${codigo}`;
        const url = `assets/aposta.json`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                tap((res: ApostaEsportiva) => console.log(res)),
                catchError(this.errorService.handleError)
            );
    }

    create(aposta): Observable<any> {
        const url = `${this.ApostaUrl}/create`;

        return this.http.post(url, JSON.stringify(aposta), this.header.getRequestOptions(true))
            .pipe(
                catchError(this.errorService.handleError)
            );
    }
}
