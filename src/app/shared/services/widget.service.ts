import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ErrorService } from './utils/error.service';
import { config } from '../config';

@Injectable({
    providedIn: 'root'
})
export class WidgetService {
    private WidgetUrl = `${config.LOKI_URL}/widgets`;

    constructor(
        private http: HttpClient,
        private errorService: ErrorService
    ) { }


    byPage(page: string): Observable<any> {
        const url = `${this.WidgetUrl}?page=${page}`;

        return this.http.get(url)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
