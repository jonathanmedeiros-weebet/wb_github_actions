import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { config } from './../../config';

import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private AuthUrl = `${config.BASE_URL}/auth`; // URL to web api

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    login(data: any): Observable<any> {
        return this.http
            .post<any>(`${this.AuthUrl}/signin`, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map(res => {
                    const usuarioSerializado = JSON.stringify(res.user);
                    const expires = moment().add(1, 'd').valueOf();

                    localStorage.setItem('expires', `${expires}`);
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user', usuarioSerializado);
                }),
                catchError(this.errorService.handleError)
            );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // localStorage.removeItem('app-mobile');
        localStorage.removeItem('expires');
        localStorage.removeItem('itens-bilhete-esportivo');
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
}
