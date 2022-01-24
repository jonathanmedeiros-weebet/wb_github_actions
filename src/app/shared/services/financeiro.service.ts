import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import {catchError, map, take} from 'rxjs/operators';

import {HeadersService} from './utils/headers.service';
import {ErrorService} from './utils/error.service';
import {config} from '../config';

@Injectable({
    providedIn: 'root'
})
export class FinanceiroService {
    private financeiroUrl = `${config.BASE_URL}/financeiro`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) {
    }

    processarPagamento(detalhesPagamento): Observable<any> {
        return this.http.post(this.financeiroUrl + '/processar-pagamento',
            JSON.stringify(detalhesPagamento), this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    solicitarSaque(detalhesSaque): Observable<any> {
        return this.http.post(this.financeiroUrl + '/solicitar-saque',
            JSON.stringify(detalhesSaque), this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getDepositosSaques(queryParams?: any): Observable<any> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(`${this.financeiroUrl}/depositos-saques`, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
