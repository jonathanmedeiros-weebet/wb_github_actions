import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { TipoAposta } from './../../../models';
import { config } from '../../config';

@Injectable()
export class TipoApostaService {
    private TipoApostaUrl = `${config.LOTTERIES_URL}/tipos-aposta`; // URL to web api

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getTiposAposta(queryParams?: any): Observable<any> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(this.TipoApostaUrl, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getTipoAposta(id: number): Observable<TipoAposta> {
        const url = `${this.TipoApostaUrl}/${id}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
