import {Injectable} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import {config} from '../../config';
import {ErrorService} from '../utils/error.service';
import {HeadersService} from '../utils/headers.service';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CambistaService {
    private cambistaUrl = `${config.BASE_URL}/cambistas`;

    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private headers: HeadersService
    ) {
    }

    fluxoCaixa(params) {
        return this.http.get(`${this.cambistaUrl}/fluxoCaixa`,
            this.headers.getRequestOptions(true, params))
            .pipe(
                map((response: any) => {
                        return response.results;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }

    listarMovimentacoes(params) {
        return this.http.get(`${this.cambistaUrl}/listar-movimentacoes`,
            this.headers.getRequestOptions(true, params))
            .pipe(
                map((response: any) => {
                        return response.results;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }

    buscarMovimentacaoId(params) {
        return this.http.get(`${this.cambistaUrl}/buscar-movimentacao`,
            this.headers.getRequestOptions(true, params))
            .pipe(
                map((response: any) => {
                        return response.results;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }

    quantidadeApostas(params) {
        return this.http.get(`${this.cambistaUrl}/quantidadeApostas`,
            this.headers.getRequestOptions(true, params))
            .pipe(
                map((response: any) => {
                    return response.results;
                }),
                catchError(this.errorService.handleError)
            );
    }

    financeiro(params) {
        return this.http.get(`${this.cambistaUrl}/financeiro`,
          this.headers.getRequestOptions(true, params)
        ).pipe(
            map((response: any) => {
                return response.results;
            }),
            catchError(this.errorService.handleError)
        );
    }
}
