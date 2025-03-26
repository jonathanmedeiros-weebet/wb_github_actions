import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorService } from './utils/error.service';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})

export class BettingShopService {
    private bettingShopUrl = `${config.LOKI_URL}/betting-shop`;

    constructor(
        private http: HttpClient,
        private errorService: ErrorService
    ) { }

    getBettingShop(id: number): Observable<any> {
        const url = `${this.bettingShopUrl}/${id}`;
    
        return this.http.get<any>(url)
            .pipe(
                map((res) => res.results),
                catchError((error) => {
                    this.errorService.handleError(error);
                    throw error;
                })
            );
    }

}
