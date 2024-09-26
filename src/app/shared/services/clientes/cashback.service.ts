import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from '../../config';
import { ErrorService } from '../utils/error.service';
import { HeadersService } from '../utils/headers.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class CashbackService {
    private cashbackUrl = `${config.BASE_URL}/cashback`;

    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private header: HeadersService
    ) { }

    getCashbacks(queryParams?: any): Observable<any> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(`${this.cashbackUrl}`, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    redeemCashback(cashbackId: number): Observable<any> {
        return this.http.post(`${this.cashbackUrl}/redeem`,
            { cashbackId: cashbackId },
            this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
