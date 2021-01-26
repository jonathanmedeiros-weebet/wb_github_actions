import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { Campeonato, Jogo } from './../../../models';
import { config } from '../../config';

@Injectable()
export class ResultadoService {
    private ResultadoUrl = `${config.CENTER_API}/resultados`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getResultados(queryParams?: any, puro?: boolean): Observable<any[]> {
        let requestOptions;
        let url = this.ResultadoUrl;

        if (puro) {
            url += '/puro';
        }

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(url, requestOptions)
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }
}
