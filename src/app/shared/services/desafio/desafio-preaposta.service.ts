import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { HeadersService } from '../utils/headers.service';
import { ErrorService } from '../utils/error.service';
import { DesafioPreAposta } from '../../../models';
import { config } from '../../config';

@Injectable()
export class DesafioPreApostaService {
    private PreApostaUrl = `${config.BASE_URL}/desafios/preapostas`; // URL to web api

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getPreAposta(id: number): Observable<DesafioPreAposta> {
        const url = `${this.PreApostaUrl}/${id}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    create(preaposta): Observable<any> {
        return this.http.post(this.PreApostaUrl, JSON.stringify(preaposta), this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
