import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ErrorService } from './utils/error.service';
import { config } from '../config';

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    private HomeUrl = `${config.BASE_URL}/home`;

    constructor(
        private http: HttpClient,
        private errorService: ErrorService
    ) { }


    getPosicaoWidgets(): Observable<any> {
        const url = `${this.HomeUrl}/posicaoWidgets`;

        return this.http.get(url)
            .pipe(
                map((res: any) => res.data),
                catchError(this.errorService.handleError)
            );
    }
}
