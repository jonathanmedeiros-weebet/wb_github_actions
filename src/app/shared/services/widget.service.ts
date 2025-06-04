import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ErrorService } from './utils/error.service';
import { config } from '../config';
import { HeadersService } from './utils/headers.service';

@Injectable({
    providedIn: 'root'
})
export class WidgetService {
    private WidgetUrl = `${config.LOKI_URL}/widgets`;
    public widgets: BehaviorSubject<any[]> = new BehaviorSubject([]);

    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private headerService: HeadersService
    ) { }

    byPage(page: string): Observable<any> {
        const url = `${this.WidgetUrl}?page=${page}`;
        return this.http.get(url, this.headerService.getRequestOptions(false))
            .pipe(
                map((res: any) => {
                    const response = res.results.map((i: any) => ({ ...i, selector: 'w' + i.id}));
                    this.widgets.next(response);
                    return response;
                }),
                catchError(this.errorService.handleError)
            );
    }
}
