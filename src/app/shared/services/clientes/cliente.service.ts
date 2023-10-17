import {Injectable} from '@angular/core';
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
    codigoFiliacaoCadastroTemp;

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
        return this.http.post(`${this.clienteUrl}/cadastro`, JSON.stringify(values), this.headers.getRequestOptions())
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

    validarCpf(cpf: any) {
        return this.http.get(`${this.clienteUrl}/consultar-cpf`, this.headers.getRequestOptions(true, { cpf }))
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

    atualizarPix(dadosCadastrais) {
        return this.http.post(`${this.clienteUrl}/atualizarChavePix`, JSON.stringify(dadosCadastrais),
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

        return this.http.get(`${this.clienteUrl}/movimentacoes`, requestOptions)
            .pipe(
                map((res: any) => res),
                catchError(this.errorService.handleError)
            );
    }

    verificarLogin(login) {
        return this.http.get(`${this.clienteUrl}/validarLogin/` + login.toLowerCase()).pipe(map(res => res));
    }

    getConfigs() {
        return this.http.get(`${this.clienteUrl}/configs`, this.headers.getRequestOptions(true)).pipe(map((res: any) => res.results));
    }

    excluirConta(motivo: string, confirmarExclusao: string) {
        return this.http.post(`${this.clienteUrl}/excluir-conta`, { motivo, confirmarExclusao }, this.headers.getRequestOptions(true))
            .pipe(
                map((response: any) => {
                    return response.results;
                }),
                catchError(this.errorService.handleError)
            );
    }

    configLimiteAposta(limites: any) {
        return this.http.post(`${this.clienteUrl}/limites-apostas`, limites, this.headers.getRequestOptions(true))
            .pipe(
                map((response: any) => {
                    return response.results;
                }),
                catchError(this.errorService.handleError)
            )
    }

    configLimiteDesposito(limites: any) {
        return this.http.post(`${this.clienteUrl}/limites-depositos`, limites, this.headers.getRequestOptions(true))
            .pipe(
                map((response: any) => {
                    return response.results;
                }),
                catchError(this.errorService.handleError)
            )
    }

    configPeriodoPausa(data: any) {
        return this.http.post(`${this.clienteUrl}/periodo-pausa`, data, this.headers.getRequestOptions(true))
            .pipe(
                map((response: any) => {
                    return response.results;
                }),
                catchError(this.errorService.handleError)
            )
    }

    getCodigoIndicacao() {
        return this.http.get(`${this.clienteUrl}/getCodigoIndicacao`, this.headers.getRequestOptions(true))
            .pipe(
                map(
                    (response: any) => {
                        return response.results;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }
}
