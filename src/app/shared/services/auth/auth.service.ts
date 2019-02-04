import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { config } from './../../config';

import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private AuthUrl = `${config.BASE_URL}/auth`; // URL to web api
    logadoSource;
    logado;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) {
        this.logadoSource = new BehaviorSubject<boolean>(this.isLoggedIn());
        this.logado = this.logadoSource.asObservable();
    }

    login(data: any): Observable<any> {
        return this.http.post<any>(`${this.AuthUrl}/signin`, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map(res => {
                    const expires = moment().add(1, 'd').valueOf();
                    localStorage.setItem('expires', `${expires}`);
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user', JSON.stringify(res.user));
                    localStorage.setItem('tipos_aposta', JSON.stringify(res.parametros['tipos_aposta']));

                    this.logadoSource.next(true);
                    window.location.reload();
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
        return localStorage.getItem('token') ? true : false;
    }

    forgot(data: any): Observable<any> {
        const url = `${this.AuthUrl}/forgotPassword`;

        return this.http
            .post(url, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
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
        const url = `${config.BASE_URL}/usuarios/alterar-senha`;

        return this.http
            .put(url, JSON.stringify(data), this.header.getRequestOptions(true))
            .pipe(
                catchError(this.errorService.handleError)
            );
    }

    getToken() {
        return localStorage.getItem('token');
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

    hasBasquete() {
        let result = false;

        const opcoes = JSON.parse(localStorage.getItem('opcoes'));
        if (opcoes) {
            result = opcoes.basquete;
        }

        return result;
    }

    hasLoterias() {
        let result = false;

        const opcoes = JSON.parse(localStorage.getItem('opcoes'));
        if (opcoes) {
            result = opcoes.loterias;
        }

        return result;
    }

    hasAoVivo() {
        let result = false;

        const opcoes = JSON.parse(localStorage.getItem('opcoes'));
        if (opcoes) {
            result = opcoes.aovivo;
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
        localStorage.removeItem('user');
        localStorage.removeItem('expires');
        localStorage.removeItem('campeonatos_aovivo');
        localStorage.removeItem('campeonatos_bloqueados');
        localStorage.removeItem('campeonatos_principais');
        localStorage.removeItem('cotacoes_locais');
        localStorage.removeItem('jogos_bloqueados');
        localStorage.removeItem('itens-bilhete-esportivo');
        localStorage.removeItem('opcoes');
        localStorage.removeItem('tipos_aposta');
        localStorage.removeItem('odds_principais');
    }
}
