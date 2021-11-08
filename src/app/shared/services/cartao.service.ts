import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';

import { ErrorService } from './utils/error.service';
import { HeadersService } from './utils/headers.service';
import { CartaoAposta, SolicitacaoSaque } from './../../models';
import { config } from './../config';

@Injectable()
export class CartaoService {
    private CartaoUrl = `${config.BASE_URL}/cartoes`;
    private SolicitacoesSaqueUrl = `${config.BASE_URL}/solicitacoes-saque`;

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

    getCartoes(queryParams): Observable<CartaoAposta[]> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(this.CartaoUrl, requestOptions)
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getCartao(dados): Observable<CartaoAposta> {
        const url = `${this.CartaoUrl}/${dados.chave}`;
        const requestOptions = this.header.getRequestOptions(false, { pin: dados.pin });

        return this.http.get(url, requestOptions)
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    solicitarSaque(dados) {
        return this.http.post(this.SolicitacoesSaqueUrl, JSON.stringify(dados), this.header.getRequestOptions())
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getSolicitacoesSaque(queryParams): Observable<SolicitacaoSaque[]> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }
        return this.http.get(this.SolicitacoesSaqueUrl, requestOptions)
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    setPagamento(solicitacaoSaque) {
        const url = `${this.SolicitacoesSaqueUrl}/${solicitacaoSaque.id}/pagamento`;

        return this.http.post(url, { version: solicitacaoSaque.version }, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    recarga(chave, valor) {
        const url = `${this.CartaoUrl}/${chave}/recarga`;
        const values = { valor: valor };

        return this.http.post(url, values, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    ativar(chave, values) {
        const url = `${this.CartaoUrl}/${chave}/ativar`;

        return this.http.post(url, values, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
