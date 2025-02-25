import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, take } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ErrorService } from './utils/error.service';
import { HeadersService } from './utils/headers.service';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})

export class CampanhaAfiliadoService {
    private CampanhaAfiliadoUrl = `${config.BASE_URL}/campanhasAfiliado`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    computarAcesso(dados: any): Observable<any> {
        const url = `${this.CampanhaAfiliadoUrl}/computarAcesso`;

        return this.http.post(url, dados, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

}
