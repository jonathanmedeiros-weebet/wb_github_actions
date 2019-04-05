import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';

import { ErrorService } from './utils/error.service';
import { HeadersService } from './utils/headers.service';
import { CartaoAposta } from './../../models';
import { config } from './../config';

@Injectable()
export class CartaoService {
    private CartaoUrl = `${config.BASE_URL}/cartoes`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    create(cartao): Observable<any> {
        return this.http.post(this.CartaoUrl, JSON.stringify(cartao), this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getCartoes(): Observable<CartaoAposta[]> {
        return this.http.get(this.CartaoUrl, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getCartao(chave: string): Observable<CartaoAposta> {
        const url = `${this.CartaoUrl}/${chave}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
