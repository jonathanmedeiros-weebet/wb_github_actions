import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, take, map } from 'rxjs/operators';

import { HeadersService } from './utils/headers.service';
import { ErrorService } from './utils/error.service';
import { Pagina } from '../../models';
import { config } from '../config';

@Injectable()
export class PaginaService {
    private PaginaUrl = `${config.BASE_URL}/paginas`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getPaginaPorChave(chave): Observable<Pagina> {
        const url = `${this.PaginaUrl}/${chave}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
