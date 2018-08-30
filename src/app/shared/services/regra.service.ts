import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorService } from './utils/error.service';
import { HeadersService } from './utils/headers.service';
import { config } from './../config';

@Injectable()
export class RegraService {
    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getRegra(): Observable<string> {
        const url = `${config.BASE_URL}/regras`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

}
