import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';
import { ErrorService } from './utils/error.service';
import {HeadersService} from './utils/headers.service';
import { catchError, map, take } from 'rxjs/operators';

import {Observable, pipe} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromocoesService {
    private promocarUrl = `${config.BASE_URL}/promocoes`;

    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private headers: HeadersService
    ) { }

    getPromocoes() {
        return this.http.get(this.promocarUrl)
            .pipe(
                map((response: any) => response.results),
                catchError(this.errorService.handleError)
            );
    }

    getPromocaoById(id) {
        const url = `${this.promocarUrl}/${id}`;

        return this.http.get(url, this.headers.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}