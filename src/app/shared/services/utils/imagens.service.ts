import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {HeadersService} from './headers.service';
import {config} from '../../config';
import {catchError, map} from 'rxjs/operators';
import {ErrorService} from './error.service';

@Injectable({
    providedIn: 'root'
})
export class ImagensService {

    constructor(private http: HttpClient,
                private headers: HeadersService,
                private errorService: ErrorService) {
    }

    readonly endpoint = `${config.BASE_URL}/img`;

    buscarLogo() {
        return this.http.get(`${this.endpoint}/logo`, this.headers.getRequestOptions()).pipe(map((result: any) => {
                return result.results;
            }),
            catchError(this.errorService.handleError));
    }

    buscarLogoBilhete() {
        return this.http.get(`${this.endpoint}/logobilhete`, this.headers.getRequestOptions()).pipe(map((result: any) => {
                return result.results;
            }),
            catchError(this.errorService.handleError));
    }
}
