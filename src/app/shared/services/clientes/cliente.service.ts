import {Injectable} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

import {config} from '../../config';
import {ErrorService} from '../utils/error.service';
import {HeadersService} from '../utils/headers.service';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private clienteUrl = `${config.BASE_URL}/clientes`;
    debouncer: any;

    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private headers: HeadersService
    ) {
    }

    getTermosDeUso() {
        return this.http.get(`${this.clienteUrl}/termos-uso`, this.headers.getRequestOptions())
            .pipe(
                map((response: any) => {
                    return response.results;
                }),
                catchError(this.errorService.handleError));
    }

    cadastrarCliente(values: any) {
        return this.http.post(`${this.clienteUrl}/cadastro`, JSON.stringify(values))
            .pipe(
                map((response: any) => {
                        return response.results;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }

    getCliente(id) {
        return this.http.get(`${this.clienteUrl}/getCliente/${id}`, this.headers.getRequestOptions(true))
            .pipe(
                map(
                    (response: any) => {
                        return response.results;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }

    atualizarDadosCadastrais(dadosCadastrais) {
        return this.http.post(`${this.clienteUrl}/atualizarDadosCadastrais`, JSON.stringify(dadosCadastrais),
            this.headers.getRequestOptions(true))
            .pipe(
                map((response: any) => {
                        return response.results.result;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }

    alterarSenha(dadosAlteracao) {
        return this.http.post(`${this.clienteUrl}/alterarSenha`, JSON.stringify(dadosAlteracao),
            this.headers.getRequestOptions(true))
            .pipe(
                map((response: any) => {
                        return response.results;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }

    getMovimentacaoFinanceira(queryParams?: any): Observable<any> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.headers.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.headers.getRequestOptions(true);
        }

        return this.http.get(`${this.clienteUrl}/getMovimentacao`, requestOptions)
            .pipe(
                map((res: any) => res),
                catchError(this.errorService.handleError)
            );
    }

    validarLoginUnico(control: AbstractControl) {
        clearTimeout(this.debouncer);

        return new Promise(resolve => {
            this.debouncer = setTimeout(() => {
                this.checarLoginUnico(control.value).subscribe((res) => {
                    if (res) {
                        resolve(null);
                    }
                }, (err) => {
                    resolve({'loginEmUso': true});
                });
            }, 1000);
        });
    }

    checarLoginUnico(login) {
        return this.http.get(`${this.clienteUrl}/validarLogin/` + login).pipe(map(res => res));
    }
}
