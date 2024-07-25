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

    getDepositosSaquesGraphData(queryParams?: any): Observable<any> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(`${this.financeiroUrl}/graph-depositos-saques`, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    verificarPagamento(queryParams?: any): Observable<any> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(`${this.financeiroUrl}/verificar-pagamento`, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    cancelarSolicitacaoSaque(solicitacaoSaqueId): Observable<any> {
        return this.http.post(`${this.financeiroUrl}/cancelar-solicitacao-saque`,
            {id: solicitacaoSaqueId}, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                catchError(this.errorService.handleError)
            );
    }

    bonusPrimeiroDepositoPermitido(): Observable<any> {
        const requestOptions = this.header.getRequestOptions(true);
        return this.http.get(`${this.financeiroUrl}/permitir-bonus`, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getRollovers(queryParams?: any): Observable<any> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }
        return this.http.get(`${this.financeiroUrl}/rollovers`, requestOptions)
        .pipe(
            map(
                (response: any) => {
                    return response.results;
                }
            ),
            catchError(this.errorService.handleError)
        );
    }

    getPromocoes(queryParams?: any): Observable<any> {
        let requestOptions;
        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }
        return this.http.get(`${this.financeiroUrl}/regras-promocoes`, requestOptions)
            .pipe(
                map(
                    (response: any) => {
                        return response.results;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }

    converterBonus(rolloverId): Observable<any> {
        return this.http.post(`${this.financeiroUrl}/converter-bonus`,
            {id: rolloverId}, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                catchError(this.errorService.handleError)
            );
    }

   cancelarBonus(rolloverId): Observable<any> {
        return this.http.post(`${this.financeiroUrl}/cancelar-bonus`,
            {id: rolloverId}, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                catchError(this.errorService.handleError)
            );
    }

    cancelarBonusAtivos() {
        return this.http.post(`${this.financeiroUrl}/cancelar-bonus`,
            {},this.header.getRequestOptions(true))
            .pipe(
                take(1),
                catchError(this.errorService.handleError)
            );
    }
}
