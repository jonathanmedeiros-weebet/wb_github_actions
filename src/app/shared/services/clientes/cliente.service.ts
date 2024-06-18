import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {config} from '../../config';
import {ErrorService} from '../utils/error.service';
import {HeadersService} from '../utils/headers.service';
import {catchError, map} from 'rxjs/operators';
import {Observable, BehaviorSubject} from 'rxjs';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {ParametrosLocaisService} from "../parametros-locais.service";

declare var xtremepush: any;

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private clienteUrl = `${config.BASE_URL}/clientes`;
    codigoFiliacaoCadastroTemp;
    logadoSource;
    logado;
    clienteSource;

    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private headers: HeadersService,
        private router: Router,
        private paramsService: ParametrosLocaisService,
    ) {
        this.clienteSource = new BehaviorSubject<boolean>(this.isCliente());
        this.logadoSource = new BehaviorSubject<boolean>(this.isLoggedIn());
        this.logado = this.logadoSource.asObservable();
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
                    const dataUser = response.results.dataUser;

                    if (dataUser && Object.keys(dataUser).length > 0) {
                        this.setCookie(dataUser.user.cookie);
                        const expires = moment().add(1, 'd').valueOf();
                        localStorage.setItem('expires', `${expires}`);
                        localStorage.setItem('token', dataUser.token);
                        localStorage.setItem('user', JSON.stringify(dataUser.user));
                        this.setIsCliente(true);
                        localStorage.setItem('tokenCassino', dataUser.tokenCassino);
                        this.logadoSource.next(true);
                        if(this.xtremepushHabilitado()){
                            xtremepush('set', 'user_id', dataUser.user.id);
                            xtremepush('event', 'login');
                        }
                    }

                    return response.results;
                }),
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

    setCookie(valor) {
        const d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = valor + '=' + valor + ';' + expires + ';';
    }

    isCliente(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            return user.tipo_usuario === 'cliente';
        }
        return false;
    }

    setIsCliente(value: boolean) {
        this.clienteSource.next(value);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    xtremepushHabilitado() {
        let result = false;
        const opcoes = this.paramsService.getOpcoes().xtremepush_habilitado;
        if (opcoes) {
            result = true;
        }
        return result;
    }
}
