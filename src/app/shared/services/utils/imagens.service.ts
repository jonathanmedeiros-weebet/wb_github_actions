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
    logo;
    logoImpressao;

    constructor(
        private http: HttpClient,
        private headers: HeadersService,
        private errorService: ErrorService
    ) {
        this.getLogo();
    }

    readonly endpoint = `${config.BASE_URL}/img`;

    buscarLogo() {
        return this.http.get(`${this.endpoint}/logo`, this.headers.getRequestOptions()).pipe(map((result: any) => {
                return result.results;
            }),
            catchError(this.errorService.handleError));
    }

    buscarLogoImpressao() {
        return this.http.get(`${this.endpoint}/logobilhete`, this.headers.getRequestOptions()).pipe(map((result: any) => {
                return result.results;
            }),
            catchError(this.errorService.handleError));
    }

    getLogo() {
        this.buscarLogo()
            .subscribe(
                logo => {
                    this.logo = `data:image/png;base64,${logo}`;
                }
            );
    }
}
