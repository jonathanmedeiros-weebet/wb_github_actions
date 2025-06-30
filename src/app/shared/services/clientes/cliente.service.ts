import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { config } from '../../config';
import { ErrorService } from '../utils/error.service';
import { HeadersService } from '../utils/headers.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { ParametrosLocaisService } from "../parametros-locais.service";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PasswordExpiredModalComponent } from '../../layout/modals/password-expired-modal/password-expired-modal.component';
import {Ga4Service, EventGa4Types} from '../ga4/ga4.service';
import { AccountVerificationTypes } from '../../enums';
import { AuthService } from '../auth/auth.service';

declare var xtremepush: any;

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private clienteUrl = `${config.BASE_URL}/clientes`;
    private apiUrl = `${config.LOKI_URL}`;

    codigoFiliacaoCadastroTemp;
    modalRef: NgbModalRef;

    private twoFactorAuthVerifiedSource;
    twoFactorAuthVerified$;

    public customerData: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private headers: HeadersService,
        private paramsService: ParametrosLocaisService,
        private ga4Service: Ga4Service,
        private modalService: NgbModal,
        private authService: AuthService
    ) {
        this.twoFactorAuthVerifiedSource = new BehaviorSubject<boolean>(false);
        this.twoFactorAuthVerified$ = this.twoFactorAuthVerifiedSource.asObservable();
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
                        this.authService.logadoSource.next(true);
                        if (this.xtremepushHabilitado()) {
                            xtremepush('set', 'user_id', dataUser.user.id);
                            setTimeout(function() {
                                xtremepush('event', 'login');
                            }, 100);
                            this.xtremepushBackgroundRemove();
                        }

                        this.ga4Service.triggerGa4Event(EventGa4Types.PRE_SIGN_UP);

                        this.ga4Service.triggerGa4Event(
                            EventGa4Types.SIGN_UP,
                            {
                                method : dataUser.user.registrationMethod
                            }
                        );
                    }

                    return response.results;
                }),
                catchError(this.errorService.handleError)
            );
    }

    getCliente(id = null) {
        if (!Boolean(id)) {
            const user = this.getUser();
            id = user.id;
        } 

        return this.http.get(`${this.clienteUrl}/getCliente/${id}`, this.headers.getRequestOptions(true))
            .pipe(
                map(
                    (response: any) => {
                        this.customerData.next(response?.results)
                        return response.results;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }

    getFaceMatchClient(id) {
        return this.http.get(`${this.clienteUrl}/getFaceMatchClient/${id}`, this.headers.getRequestOptions(true))
            .pipe(
                map((res: any) => { return res.results }), (error => {
                    return error
                }),
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

    validateCpfAlreadyExists(cpf: any) {
        return this.http.get(`${this.clienteUrl}/consult-cpf-already-exists`, this.headers.getRequestOptions(true, { cpf }))
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

    registerBankAccount(registrationData) {
        return this.http.post(`${this.clienteUrl}/registerBankAccount`, JSON.stringify(registrationData),
        this.headers.getRequestOptions(true))
        .pipe(
            map((response: any) => {
                return response.results.result;
            }
            ),
            catchError(this.errorService.handleError)
        );
    }

    deleteBankAccount(account) {
        return this.http.post(`${this.clienteUrl}/deleteBankAccount`, JSON.stringify(account),
        this.headers.getRequestOptions(true))
        .pipe(
            map((response: any) => {
                return response.results.result
            }),
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
        return this.http.get(`${this.clienteUrl}/configs`, this.headers.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    excluirConta(exclusionPeriod: string, motivo: string, confirmarExclusao: string, multifator = {}) {
        const url = `${this.clienteUrl}/excluir-conta`;
        const data = {
            exclusionPeriod,
            motivo,
            confirmarExclusao,
            ...multifator
        };

        return this.http.post(url, data, this.headers.getRequestOptions(true))
            .pipe(
                map((response: any) => response.results),
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

    configLimitePerda(limites: any) {
        return this.http.post(`${this.clienteUrl}/limites-perdas`, limites, this.headers.getRequestOptions(true))
            .pipe(
                map((response: any) => {
                    return response.results;
                }),
                catchError(this.errorService.handleError)
            )
    }

    configLimiteTempoAtividade(limites:any) {
        return this.http.post(`${this.clienteUrl}/limites-tempo`, limites, this.headers.getRequestOptions(true))
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
        this.authService.clienteSource.next(value);
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


    checkPasswordExpirationDays(id) {
        this.http.get(`${this.clienteUrl}/checkPasswordExpirationDays?id=${id}`, this.headers.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            ).subscribe(data => {
                if (data.expired || data.showMessage) {
                    this.modalRef = this.modalService.open(PasswordExpiredModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true,
                        windowClass: 'custom-modal-force-password'
                    });

                    this.modalRef.componentInstance.data = {
                        expired: data.expired,
                        daysRemaining: data.daysRemaining,
                    }
                }
            },
                error => console.error(error)
            )
    }

    initiatePhoneValidation() {
        let baseUrl = `${this.clienteUrl}/initiate-phone-validation`

        if (this.paramsService.getPhoneVerificationService() == 'twilio') {
            baseUrl = `${this.apiUrl}/customers/phone-verification`
        }

        return this.http
            .post(
                baseUrl,
                {},
                this.headers.getRequestOptions(true)
            )
            .pipe(
                map((response: any) => {
                    return response.results;
                }),
                catchError(this.errorService.handleError)
            );
    }

    validatePhone(validationCode: string) {
        let baseUrl = `${this.clienteUrl}/validate-phone`;

        if (this.paramsService.getPhoneVerificationService() == 'twilio') {
            baseUrl = `${this.apiUrl}/customers/phone-verification-check`;
        }

        return this.http
            .post(
                baseUrl,
                { validation_code: validationCode },
                this.headers.getRequestOptions(true)
            )
            .pipe(
                map((response: any) => {
                    return response.results;
                }),
                catchError(this.errorService.handleError)
            );
    }

    public sendTwoFactorAuthCode(verificationMethod: string, customerId: number, recipient: string) {
        switch (verificationMethod) {
            case AccountVerificationTypes.PHONE:
                return this.sendTwoFactorAuthCodeBySms(customerId, recipient);
        }

        throw new Error('Verification method not supported');
    }

    private sendTwoFactorAuthCodeBySms(customerId: number, phone: string) {
        return this.http
            .post(
                `${this.apiUrl}/two-factor-authentication/send/sms`,
                { customerId: customerId, phone: phone },
                this.headers.getRequestOptions(true)
            )
            .pipe(
                map((response: any) => {
                    return response.success;
                }),
                catchError(this.errorService.handleError)
            );
    }

    public confirmTwoFactorAuthCode(verificationMethod: string, customerId: number, recipient: string, code: string) {
        switch (verificationMethod) {
            case AccountVerificationTypes.PHONE:
                return this.confirmTwoFactorAuthCodeBySms(customerId, recipient, code);
        }

        throw new Error('Verification method not supported');
    }

    private confirmTwoFactorAuthCodeBySms(customerId: number, phone: string, code: string) {
        return this.http
            .post(
                `${this.apiUrl}/two-factor-authentication/confirm/sms`,
                { customerId: customerId, phone: phone, code: code },
                this.headers.getRequestOptions(true)
            )
            .pipe(
                map((response: any) => {
                    this.twoFactorAuthVerifiedSource.next(response.success);
                    return response.success;
                }),
                catchError(this.errorService.handleError)
            );
    }

    public allBankAccounts() {
        return this.http.get(`${this.clienteUrl}/allBankAccounts`, this.headers.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(() => [])
            );
    }

    updateEmail(email: string) {
        return this.http.post(`${this.clienteUrl}/update-email`, { email },
            this.headers.getRequestOptions(true))
            .pipe(
                map((response: any) => {
                    return response.results.result;
                }),
                catchError(this.errorService.handleError)
            );
    }

    updatePhone(phone: string) {
        return this.http.post(`${this.clienteUrl}/update-phone`, { phone },
            this.headers.getRequestOptions(true))
            .pipe(
                map((response: any) => {
                    return response.results.result;
                }),
                catchError(this.errorService.handleError)
            );
    }

    updateAddress(address: any) {
        return this.http.post(`${this.clienteUrl}/update-address`, { address },
            this.headers.getRequestOptions(true))
            .pipe(
                map((response: any) => {
                    return response.results.result;
                }),
                catchError(this.errorService.handleError)
            );
    }

    acceptTerms() {
        return this.http.get(`${this.clienteUrl}/acceptTerms`, this.headers.getRequestOptions(true))
            .pipe(
                map((response: any) => {
                    return response.results;
                }),
                catchError(this.errorService.handleError));
    }
}
