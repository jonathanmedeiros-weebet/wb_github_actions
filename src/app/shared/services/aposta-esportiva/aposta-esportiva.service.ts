import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { ApostaEsportiva } from './../../../models';
import { config } from '../../config';

@Injectable()
export class ApostaEsportivaService {
    private ApostaUrl = `${config.BASE_URL}/apostas`;
    private ApostaEsportivaUrl = `${config.SPORTS_URL}/apostas`;

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

        return this.http.get(this.ApostaEsportivaUrl, requestOptions)
            .pipe(
                map((res: any) => res.results),
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

    create(aposta): Observable<any> {
        return this.http.post(this.ApostaEsportivaUrl, JSON.stringify(aposta), this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    cancel(id): Observable<any> {
        const url = `${this.ApostaEsportivaUrl}/${id}`;

        return this.http.delete(url, this.header.getRequestOptions(true))
            .pipe(
                catchError(this.errorService.handleError)
            );
    }

    setPagamento(id) {
        const url = `${this.ApostaEsportivaUrl}/${id}/pagamento`;

        return this.http.post(url, '', this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
