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

declare var xtremepush: any;

const INTERCOM_HMAC_COOKIE = 'intercom_hmac';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private AuthUrl = `${config.BASE_URL}/auth`; // URL to web api
    private authLokiUrl = `${config.LOKI_URL}/auth`;
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

    verificaDadosLogin(data: any): Observable<any> {
        return this.http.post<any>(`${this.authLokiUrl}/verify-login-data`, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map(res => {
                    if (res.results.user) {
                        localStorage.setItem('user', JSON.stringify(res.results.user));
                    }
                    return res;
                }),
                catchError(this.errorService.handleErrorLogin),
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

    loginAuthDoisFatores(data: any): Observable<any> {
        return this.http.post<any>(`${this.authLokiUrl}/two-factor-auth-login`, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map(res => {
                    this.setCookie(res.results.user.cookie);
                    const expires = moment().add(1, 'd').valueOf();
                    localStorage.setItem('expires', `${expires}`);
                    localStorage.setItem('token', res.results.token);
                    localStorage.setItem('user', JSON.stringify(res.results.user));
                    if (res.results.user.tipo_usuario === 'cambista') {
                        localStorage.setItem('tipos_aposta', JSON.stringify(res.results.tipos_aposta));
                        this.setIsCliente(false);
                    } else {
                        localStorage.setItem('tokenCassino', res.results.tokenCassino);
                        this.setIsCliente(true);
                        if (this.xtremepushHabilitado()) {
                            xtremepush('set', 'user_id', res.results.user.id);
                            setTimeout(function() {
                                xtremepush('event', 'login');
                            }, 100);
                            this.xtremepushBackgroundRemove();
                        }
                    }

                    if (Boolean(res.results?.intercomHmac)) {
                        this.setCookie(res.results.intercomHmac, INTERCOM_HMAC_COOKIE);
                    }

                    this.logadoSource.next(true);
                    if (data.casino === undefined) {
                        this.router.navigate(['esportes/futebol/jogos']);
                    }
                }),
                catchError(this.errorService.handleError)
            );
    }

    login(data: any): Observable<any> {
        return this.http.post<any>(`${this.authLokiUrl}/login`, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map(res => {

                    this.setCookie(res.results.user.cookie);
                    const expires = moment().add(1, 'd').valueOf();
                    localStorage.setItem('expires', `${expires}`);
                    localStorage.setItem('token', res.results.token);
                    localStorage.setItem('tokenBetby', res.results.tokenBetby);
                    localStorage.setItem('user', JSON.stringify(res.results.user));

                    if (res.results.user.tipo_usuario === 'cambista') {
                        localStorage.setItem('tipos_aposta', JSON.stringify(res.results.tipos_aposta));
                        this.setIsCliente(false);
                    } else {
                        localStorage.setItem('tokenCassino', res.results.tokenCassino);
                        this.setIsCliente(true);
                        if(this.xtremepushHabilitado()){
                            xtremepush('set', 'user_id', res.results.user.id);
                            setTimeout(function() {
                                xtremepush('event', 'login');
                            }, 100);
                            this.xtremepushBackgroundRemove();
                        }
                    }

                    if (Boolean(res.results?.intercomHmac)) {
                        this.setCookie(res.results.intercomHmac, INTERCOM_HMAC_COOKIE);
                    }

                    this.logadoSource.next(true);
                }),
                catchError(this.errorService.handleError)
            );
    }

    getTokenBetby(lang: string) {
        const token = this.getToken();
        const user = this.getUser();

        return this.http.post<any>(`${this.authLokiUrl}/betby/token`, { token, lang }, this.header.getRequestOptions(true))
            .pipe(
                map(res => {
                    localStorage.setItem('tokenBetby', res.token);
                    return res;
                }),
                catchError(this.errorService.handleError)
            );
    }

    refreshTokenBetby(lang: string) {
        const token = this.getTokenBetbyStorage();

        return this.http.post<any>(`${this.authLokiUrl}/betby/refresh-token`, { token, lang }, this.header.getRequestOptions())
            .pipe(
                map(res => {
                    if (res.refresh) {
                        localStorage.setItem('tokenBetby', res.token);
                    }
                    return res;
                }),
                catchError(this.errorService.handleError)
            );
    }

    logout() {
        this.limparStorage();

        this.deleteCookie(INTERCOM_HMAC_COOKIE);

        if (this.xtremepushHabilitado()) {
            this.cleanXtremepushNotifications();
        }
        this.logadoSource.next(false);
        window.location.reload();
    }

    cleanXtremepushNotifications() {
        xtremepush('set', 'user_id', '');
        const xtremepushNotificationContainer = document.getElementById('xtremepushNotificationContainer');
        xtremepushNotificationContainer.innerHTML = '';
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

    requestSMSToken(step = 1, token = null) {
        const url = `${this.AuthUrl}/requestSMSMultifactor`;
        const data = {
            step: step,
            token: token,
        };

        return this.http
            .post(url, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map((res: any) => res),
                catchError(this.errorService.handleError)
            );
    }

    requestEmailMultifator(senha) {
        const url = `${this.AuthUrl}/requestMultifatorEmail`;
        const data  = { senha };
        return this.http
            .post(url, data, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    validarMultifator(dados: any) {
        const url = `${this.AuthUrl}/validarMultifator`;

        return this.http
            .post(url, dados, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getTokenCassino() {
        return localStorage.getItem('tokenCassino');
    }

    getTokenBetbyStorage() {
        return localStorage.getItem('tokenBetby');
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

    xtremepushHabilitado() {
        return Boolean(this.paramsService.getOpcoes()?.xtremepush_habilitado);
    }

    liveIsActive() {
        return this.paramsService.aoVivoAtivo;
    }

    setAppMobile() {
        localStorage.setItem('app-mobile', 'true');
    }

    unsetAppMobile() {
        localStorage.removeItem('app-mobile');
    }

    isExpired() {
        const expires = localStorage.getItem('expires');
        // +expired converte a string para inteiro
        return moment(+expires).isBefore(new Date());
    }

    getPosicaoFinanceira() {
        const url = `${config.LOKI_URL}/financial/position`;

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
        localStorage.removeItem('tokenBetby');
        localStorage.removeItem('user');
        localStorage.removeItem('expires');
        localStorage.removeItem('tipos_aposta');
        localStorage.removeItem('exibirSaldo');
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

    setCookie(value, name = null) {
        const d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();

        const cname = name ? name : value;
        document.cookie = `${cname}=${value};${expires};`;
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

    xtremepushBackgroundRemove() {
        let intervalId = setInterval(() => {
            const element = document.querySelector('.webpush-swal2-popup.webpush-swal2-modal.webpush-swal2-show');

            if (element) {
                (element as HTMLElement).style.visibility = 'hidden';
                (element as HTMLElement).style.background = 'none';
                (element as HTMLElement).style.visibility = 'visible';
                clearInterval(intervalId);
            }
        }, 100);
        setTimeout(() => {
            clearInterval(intervalId);
        }, 3000);
    }

    deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}
