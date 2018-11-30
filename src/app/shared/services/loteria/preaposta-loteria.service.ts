import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { config } from '../../config';

@Injectable()
export class PreApostaLoteriaService {
    private PreApostaUrl = `${config.BASE_URL}/preapostas`; // URL to web api

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getPreAposta(id: number): Observable<any> {
        const url = `${this.PreApostaUrl}/${id}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    create(aposta): Observable<any> {
        const url = `${this.PreApostaUrl}/loteria`;
        return this.http.post(url, JSON.stringify(aposta), this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
