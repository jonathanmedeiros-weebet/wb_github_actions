import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { HeadersService } from './utils/headers.service';
import { ErrorService } from './utils/error.service';
import { Cliente } from './../../models';
import { config } from '../config';

@Injectable()
export class ClienteService {
    private ClientesUrl = `${config.BASE_URL}/clientes`; // URL to web api

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getClientes(queryParams?: any): Observable<any> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(this.ClientesUrl, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getCliente(id: number): Observable<Cliente> {
        const url = `${this.ClientesUrl}/${id}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    create(cliente: Cliente): Observable<Cliente> {
        return this.http.post(this.ClientesUrl, JSON.stringify(cliente), this.header.getRequestOptions(true))
            .catch(this.errorService.handleError);
    }

    update(id: number, dados: any): Observable<Cliente> {
        const url = `${this.ClientesUrl}/${id}`;

        return this.http.put(url, JSON.stringify(dados), this.header.getRequestOptions(true))
            .catch(this.errorService.handleError);
    }

    delete(id: number): Observable<void> {
        const url = `${this.ClientesUrl}/${id}`;

        return this.http.delete(url, this.header.getRequestOptions(true))
            .catch(this.errorService.handleError);
    }
}
