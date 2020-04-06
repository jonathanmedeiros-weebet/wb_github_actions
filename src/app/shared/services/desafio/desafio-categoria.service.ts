import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, take } from 'rxjs/operators';

import { HeadersService } from '../utils/headers.service';
import { ErrorService } from '../utils/error.service';
import { DesafioCategoria } from '../../../models';
import { config } from '../../config';

@Injectable()
export class DesafioCategoriaService {
    private DesafioCategoriaUrl = `${config.BASE_URL}/desafio-categorias`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getCategoria(id) {
        const url = `${this.DesafioCategoriaUrl}/${id}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getCategorias(queryParams?) {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(this.DesafioCategoriaUrl, requestOptions)
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
