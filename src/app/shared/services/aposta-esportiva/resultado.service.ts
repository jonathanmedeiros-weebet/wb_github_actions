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

    getResultados(queryParams?: any): Observable<Campeonato[]> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(this.ResultadoUrl, requestOptions)
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }

}
