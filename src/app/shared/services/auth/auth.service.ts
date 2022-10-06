import {Injectable, EventEmitter, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';

import {HeadersService} from './../utils/headers.service';
import {ErrorService} from './../utils/error.service';
import {ParametrosLocaisService} from './../parametros-locais.service';
import {config} from './../../config';

import * as moment from 'moment';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private AuthUrl = `${config.BASE_URL}/auth`; // URL to web api
    logadoSource;
    logado;
    clienteSource;
    cliente;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService,
        private paramsService: ParametrosLocaisService,
        private router: Router
    ) {
        this.logadoSource = new BehaviorSubject<boolean>(this.isLoggedIn());
        this.logado = this.logadoSource.asObservable();
        this.clienteSource = new BehaviorSubject<boolean>(this.isCliente());
        this.cliente = this.clienteSource.asObservable();
    }

    verificaCliente(data: any): Observable<any> {
        return this.http.post<any>(`${this.AuthUrl}/verificarLogin`, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map(res => {
                    localStorage.setItem('user', JSON.stringify(res.user));
                }),
                catchError(this.errorService.handleError)
            );
    }

    enviarCodigoEmail(data: any): Observable<any> {
        return this.http.post<any>(`${this.AuthUrl}/enviarCodigoEmail`, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map(res => {
                    return res;
                }),
                catchError(this.errorService.handleError)
            );
    }

    enviarLinkAtivacao(data: any): Observable<any> {
        return this.http.post<any>(`${this.AuthUrl}/enviarLinkAtivacao`, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map(res => {
                    return res;
                }),
                catchError(this.errorService.handleError)
            );
    }

    ativacaoCadastro(data: any) {
        return this.http.post<any>(`${this.AuthUrl}/ativacaoCadastro`, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map(res => {
                    return res;
                }),
                catchError(this.errorService.handleError)
            );
    }

    login(data: any): Observable<any> {
        return this.http.post<any>(`${this.AuthUrl}/signin`, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map(res => {
                    this.setCookie(res.user.cookie);
                    const expires = moment().add(1, 'd').valueOf();
                    localStorage.setItem('expires', `${expires}`);
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user', JSON.stringify(res.user));
                    if (res.user.tipo_usuario === 'cambista') {
                        localStorage.setItem('tipos_aposta', JSON.stringify(res.tipos_aposta));
                        this.setIsCliente(false);
                    } else {
                        localStorage.setItem('tokenCassino', res.tokenCassino);
                        this.setIsCliente(true);
                    }
                    this.logadoSource.next(true);
                    if (data.casino === undefined) {
                        this.router.navigate(['esportes/futebol/jogos']);
                    }
                }),
                catchError(this.errorService.handleError)
            );
    }

    logout() {
        this.limparStorage();
        this.logadoSource.next(false);
        window.location.reload();
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    forgot(data: any): Observable<any> {
        const url = `${this.AuthUrl}/forgotPassword`;

        return this.http.post(url, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map((response: any) => {
                    return response.results;
                }),
                catchError(this.errorService.handleError)
            );
    }

    resetPassword(data: any): Observable<any> {
        const url = `${this.AuthUrl}/resetPassword`;

        return this.http
            .post(url, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                catchError(this.errorService.handleError)
            );
    }

    changePassword(data: any): Observable<any> {
        const url = `${config.BASE_URL}/usuarios/alterar_senha`;

        return this.http
            .put(url, JSON.stringify(data), this.header.getRequestOptions(true))
            .pipe(
                catchError(this.errorService.handleError)
            );
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getTokenCassino() {
        return localStorage.getItem('tokenCassino');
    }

    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    isAppMobile() {
        let result = false;
        const appMobile = JSON.parse(localStorage.getItem('app-mobile'));
        if (appMobile) {
            result = appMobile;
        }
        return result;
    }

    modalidadeHabilitada(modalidade) {
        let result = false;

        const opcoes = this.paramsService.getOpcoes();
        if (opcoes) {
            result = opcoes[modalidade];
        }

        return result;
    }

    setAppMobile() {
        localStorage.setItem('app-mobile', 'true');
    }

    isExpired() {
        const expires = localStorage.getItem('expires');
        // +expired converte a string para inteiro
        return moment(+expires).isBefore(new Date());
    }

    getPosicaoFinanceira() {
        const url = `${config.BASE_URL}/financeiro/posicao`;

        return this.http
            .get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    limparStorage() {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenCassino');
        localStorage.removeItem('user');
        localStorage.removeItem('expires');
        localStorage.removeItem('tipos_aposta');
    }

    isCliente(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            return user.tipo_usuario === 'cliente';
        }
        return false;
    }

    isValidacaoEmail(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            return user.validacao_email === 1;
        }
        return false;
    }

    setIsCliente(value: boolean) {
        this.clienteSource.next(value);
    }

    validateRecoveryToken(id, token) {
        const url = `${this.AuthUrl}/validateToken/`;

        return this.http
            .get(url + '?id=' + id + '&token=' + token, this.header.getRequestOptions(false))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    setCookie(valor) {
        const d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = valor + '=' + valor + ';' + expires + ';';
    }

    getCookie(cname) {
        const name = cname + '=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies_array = decodedCookie.split(';');
        for (let i = 0; i < cookies_array.length; i++) {
            let cookies = cookies_array[i];
            while (cookies.charAt(0) === ' ') {
                cookies = cookies.substring(1);
            }
            if (cookies.indexOf(name) === 0) {
                return cookies.substring(name.length, cookies.length);
            }
        }
        return '';
    }

}
