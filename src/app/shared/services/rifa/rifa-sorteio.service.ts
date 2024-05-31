import { Injectable } from '@angular/core';
import {config} from '../../config';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from '../utils/headers.service';
import {ErrorService} from '../utils/error.service';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Sorteio} from '../../models/loteria/sorteio';

@Injectable({
  providedIn: 'root'
})
export class RifaSorteioService {

    private SorteioUrl = `${config.RIFA_URL}/sorteios`; // URL to web api

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getSorteios(queryParams?: any): Observable<any> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(this.SorteioUrl, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getSorteio(id: number): Observable<Sorteio> {
        const url = `${this.SorteioUrl}/${id}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res),
                catchError(this.errorService.handleError)
            );
    }
}
