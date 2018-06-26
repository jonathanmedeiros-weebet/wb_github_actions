import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { config } from './../../config';

import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class AuthService {
    private AuthUrl = `${config.BASE_URL}/auth`; // URL to web api

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    login(data: any): Observable<void> {
        return this.http
            .post<any>(`${this.AuthUrl}/signin`, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map(res => {
                    let usuarioSerializado = JSON.stringify(res.user);
                    let expires = moment().add(1, "d").valueOf();

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
        localStorage.removeItem('app-mobile');
        localStorage.removeItem('expires');
    }

    isLoggedIn(): boolean {
        return localStorage.getItem('token') ? true : false;
    }

    forgot(data: any): Observable<void> {
        const url = `${this.AuthUrl}/forgotPassword`;

        return this.http
            .post(url, JSON.stringify(data), this.header.getRequestOptions())
            .catch(this.errorService.handleError);
    }

    resetPassword(data: any): Observable<void> {
        const url = `${this.AuthUrl}/resetPassword`;

        return this.http
            .post(url, JSON.stringify(data), this.header.getRequestOptions())
            .catch(this.errorService.handleError);
    }

    changePassword(data: any): Observable<void> {
        const url = `${this.AuthUrl}/changePassword`;

        return this.http
            .post(url, JSON.stringify(data), this.header.getRequestOptions(true))
            .catch(this.errorService.handleError);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    isAppMobile() {
        let result = false;
        let appMobile = JSON.parse(localStorage.getItem('app-mobile'));
        if (appMobile) {
            result = appMobile
        }
        return result;
    }

    setAppMobile() {
        localStorage.setItem('app-mobile', 'true');
    }

    isExpired() {
        const expires = localStorage.getItem('expires');
        //+expired converte a string para inteiro
        return moment(+expires).isBefore(new Date());
    }
}
