import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { ParametrosLocaisService } from './../parametros-locais.service';
import { config } from './../../config';

import * as moment from 'moment';
import { GeolocationService } from '../geolocation.service';
import { Ga4Service, EventGa4Types } from '../ga4/ga4.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterV3ModalComponent } from '../../layout/modals/register-v3-modal/register-v3-modal.component';
import { BannerService } from '../banner.service';

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
        private router: Router,
        private geolocation: GeolocationService,
        private ga4Service: Ga4Service,
        private modalService: NgbModal,
        private bannerService: BannerService
    ) {
        this.logadoSource = new BehaviorSubject<boolean>(this.isLoggedIn());
        this.logado = this.logadoSource.asObservable();
        this.clienteSource = new BehaviorSubject<boolean>(this.isCliente());
        this.cliente = this.clienteSource.asObservable();
    } 

    verificaDadosLogin(data: any): Observable<any> {
        // todo: remover após atualizar todos Clientes; parametro, ignorarValidacaoEmailObrigatoria, serve para não desativar a validacao de email do login no loki;
        const bettingShopId = localStorage.getItem('bettingShopId');

        data = {
            ...data,
            ignorarValidacaoEmailObrigatoria: true,
            betting_shop_id: (bettingShopId && this.enableTotemModule) ? Number(bettingShopId) : null
        }

        return this.http.post<any>(`${this.authLokiUrl}/verify-login-data`, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                map(res => {
                    if (res.results.user) {
                        localStorage.setItem('user', JSON.stringify(res.results.user));
                        this.ga4Service.triggerGa4Event(
                            EventGa4Types.LOGIN, {
                            name: res.results.user.name,
                            email: res.results.user.login,
                            phone: res.results.user.phone
                        }
                        );
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
                            setTimeout(function () {
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
        // todo: remover após atualizar todos Clientes; parametro, ignorarValidacaoEmailObrigatoria, serve para não desativar a validacao de email do login no loki;
        const bettingShopId = localStorage.getItem('bettingShopId');

        data = {
            ...data,
            ignorarValidacaoEmailObrigatoria: true,
            betting_shop_id: (bettingShopId && this.enableTotemModule) ? Number(bettingShopId) : null
        }
        
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
                        if (this.xtremepushHabilitado()) {
                            xtremepush('set', 'user_id', res.results.user.id);
                            setTimeout(function () {
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

    performLogout(logoutType: string) {
        return this.http.post<any>(
            `${this.authLokiUrl}/logout`,
            { logout_type: logoutType },
            this.header.getRequestOptions(true)
        ).pipe(
            map(res => {
                this.handleLogoutCleanup();
                return res;
            }),
            catchError(error => {
                if (error.status === 401 || error.status === 404) {
                    this.handleLogoutCleanup();
                }
                throw error;
            })
        );
    }

    private handleLogoutCleanup() {
        this.limparStorage();
        this.deleteCookie(INTERCOM_HMAC_COOKIE);
        this.logadoSource.next(false);
        if (this.xtremepushHabilitado()) {
            this.cleanXtremepushNotifications();
        }
        location.reload();
    }

    logout() {
        this.performLogout('manual').subscribe();
    }

    expiredByInactive() {
        this.performLogout('expired by inactivity').subscribe();
    }

    cleanXtremepushNotifications() {
        xtremepush('set', 'user_id', "");
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
        const data = { senha };
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
        if (!expires) {
            return false;
        }
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

    getLastAccesses(filters: { userId: number; dateFrom: string; dateTo: string; type: string }): Observable<any> {
        const url = `${this.authLokiUrl}/last-accesses`;

        return this.http
            .post<any>(url, filters, this.header.getRequestOptions(true))
            .pipe(
                map(response => response),
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
        localStorage.removeItem('ibge_code');
        localStorage.removeItem('locale_city');
        localStorage.removeItem('locale_state');
        localStorage.removeItem('locale_country');
        localStorage.removeItem('lat');
        localStorage.removeItem('lng');

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

    getUserResetPassword(data: any): Observable<any> {
        const url = `${this.AuthUrl}/getUserResetPassword`;
        return this.http
            .post(url, JSON.stringify(data), this.header.getRequestOptions())
            .pipe(
                catchError(this.errorService.handleError)
            );
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

    updatePhoneValidationStatus(status: boolean) {
        const user = this.getUser();

        user.phone_validated = status;

        localStorage.setItem('user', JSON.stringify(user));
    }

    async openRegisterV3Modal() {
        this.bannerService
            .requestBanners()
            .toPromise()
            .then((banners) => {
                let hasRegisterBanner = false;

                if(Boolean(banners) && Boolean(banners.length)) {
                    hasRegisterBanner = banners.some(banner => banner.pagina == 'cadastro')
                }

                this.modalService.open(RegisterV3ModalComponent, {
                    ariaLabelledBy: 'modal-basic-title',
                    size: 'md',
                    centered: true,
                    windowClass: `${hasRegisterBanner ? 'modal-750' : 'modal-400'} modal-cadastro-cliente`,
                    backdrop: 'static'
                });
            })
            .catch(() => {
                const modalRef = this.modalService.open(RegisterV3ModalComponent, {
                    ariaLabelledBy: 'modal-basic-title',
                    size: 'md',
                    centered: true,
                    windowClass: `modal-400 modal-cadastro-cliente`,
                    backdrop: 'static'
                });
                modalRef.componentInstance.hasRegisterBanner = false;
            });
        
    }

    get enableTotemModule(): boolean {
        return Boolean(this.paramsService.getOpcoes()?.enable_totem_module);
    }
}
