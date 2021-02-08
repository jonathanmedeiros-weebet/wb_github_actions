import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../config';
import { HeadersService } from './headers.service';
import { catchError, map, take } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    utilsUrl = `${config.BASE_URL}/utils`;

    constructor(
        private http: HttpClient,
        private headers: HeadersService,
        private errorService: ErrorService
    ) { }


    getDateTime() {
        return this.http.get(`${this.utilsUrl}/current-datetime`, this.headers.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
