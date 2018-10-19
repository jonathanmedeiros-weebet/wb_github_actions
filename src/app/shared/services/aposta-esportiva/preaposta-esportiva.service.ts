import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { PreApostaEsportiva } from './../../../models';
import { config } from '../../config';

@Injectable()
export class PreApostaEsportivaService {
    private PreApostaUrl = `${config.SPORTS_URL}/preapostas`; // URL to web api

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getPreApostas(queryParams?: any): Observable<any> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(this.PreApostaUrl, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getPreAposta(id: number): Observable<PreApostaEsportiva> {
        const url = `${this.PreApostaUrl}/${id}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    create(aposta): Observable<any> {
        return this.http.post(this.PreApostaUrl, JSON.stringify(aposta), this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
