import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from './utils/error.service';
import { config } from '../config';
import { HeadersService } from './utils/headers.service';

@Injectable({
    providedIn: 'root'
})

export class BettingShopService {
    private bettingShopUrl = `${config.LOKI_URL}/betting-shop`;

    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private headerService: HeadersService
    ) { }

    verifyAndGetBettingShop(id: number, code: string): Observable<any> {
        const url = `${this.bettingShopUrl}/verify`;

        return this.http.post<any>(url, { id, code }, this.headerService.getRequestOptions(true))
            .pipe(
                map((res) => res.results),
                catchError((error) => {
                    this.errorService.handleError(error);
                    throw error;
                })
            );
    }

}
