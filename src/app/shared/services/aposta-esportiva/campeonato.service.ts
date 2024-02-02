import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { Campeonato, Jogo } from './../../../models';
import { config } from '../../config';

@Injectable({
    providedIn: 'root'
})
export class CampeonatoService {
    private CampeonatoUrl = `${config.CENTER_API}/campeonatos`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getCampeonatosPorRegioes(queryParams?: any): Observable<Campeonato[]> {
        const url = `${this.CampeonatoUrl}/regioes`;
        let requestOptions;

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

    getCampeonatos(queryParams?: any): Observable<Campeonato[]> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(this.CampeonatoUrl, requestOptions)
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }

    getCampeonatosPuro(queryParams?: any): Observable<Campeonato[]> {
        let requestOptions;
        const url = `${this.CampeonatoUrl}/puro`;

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

    getCampeonato(id: number, queryParams?: any): Observable<Campeonato> {
        const url = `${this.CampeonatoUrl}/${id}`;

        let requestOptions;

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

    getJogos(id: number, queryParams: any): Observable<Jogo[]> {
        const url = `${this.CampeonatoUrl}/${id}/jogos`;

        let requestOptions;

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
