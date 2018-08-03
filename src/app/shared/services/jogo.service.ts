import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HeadersService } from './utils/headers.service';
import { ErrorService } from './utils/error.service';
import { Jogo, Cotacao, Campeonato } from './../../models';
import { config } from '../config';

@Injectable()
export class JogoService {
    private JogoUrl = `${config.CENTER_URL}/jogos`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getJogo(id: Number): Observable<Jogo> {
        const url = `${this.JogoUrl}/${id}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }

    getJogos(queryParams?: any): Observable<Campeonato[]> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(this.JogoUrl, requestOptions)
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }

    getCotacoes(id: number): Observable<Cotacao[]> {
        const url = `${this.JogoUrl}/${id}/cotacoes`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }

    getCotacao(id: number, chave: string): Observable<Cotacao[]> {
        const url = `${this.JogoUrl}/${id}/cotacoes/${chave}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }

}
