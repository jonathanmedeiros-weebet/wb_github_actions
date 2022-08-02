import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, take, map } from 'rxjs/operators';

import { HeadersService } from './utils/headers.service';
import { ErrorService } from './utils/error.service';
import { Pagina } from '../../models';
import { config } from '../config';

@Injectable({
    providedIn: 'root'
})
export class ImagemInicialService {
    private ImagemInicialUrl = `${config.BASE_URL}/imagem-inicial`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getImagens(): Observable<any> {
        return this.http.get(this.ImagemInicialUrl, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
