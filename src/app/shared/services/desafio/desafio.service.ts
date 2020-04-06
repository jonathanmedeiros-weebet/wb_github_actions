import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { HeadersService } from '../utils/headers.service';
import { ErrorService } from '../utils/error.service';
import { ApostaEsportiva } from '../../../models';
import { config } from '../../config';

@Injectable()
export class DesafioService {
    private DesafioUrl = `${config.BASE_URL}/desafios`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }


    getDesafios(queryParams?) {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(this.DesafioUrl, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getApostas(queryParams?): Observable<any[]> {
        const url = `${this.DesafioUrl}/apostas`;
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

    getAposta(id: number, queryParams?): Observable<ApostaEsportiva> {
        const url = `${this.DesafioUrl}/apostas/${id}`;
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

    createAposta(dados): Observable<any> {
        const url = `${this.DesafioUrl}/apostas`;

        return this.http.post(url, dados, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    createPreAposta(dados): Observable<any> {
        const url = `${this.DesafioUrl}/preapostas`;

        return this.http.post(url, dados, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
