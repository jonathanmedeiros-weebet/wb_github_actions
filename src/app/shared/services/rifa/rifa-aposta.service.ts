import { Injectable } from '@angular/core';
import {config} from '../../config';
import { HttpClient } from '@angular/common/http';
import {HeadersService} from '../utils/headers.service';
import {ErrorService} from '../utils/error.service';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Aposta} from '../../models/loteria/aposta';

@Injectable({
  providedIn: 'root'
})
export class RifaApostaService {

    private ApostaUrl = `${config.BASE_URL}/apostas`;
    private ApostaLoteriaUrl = `${config.BASE_URL}/rifa/apostas`;

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

        return this.http.get(this.ApostaLoteriaUrl, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getAposta(id: number): Observable<Aposta> {
        const url = `${this.ApostaUrl}/${id}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    create(aposta): Observable<any> {
        return this.http.post(this.ApostaLoteriaUrl, JSON.stringify(aposta), this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
