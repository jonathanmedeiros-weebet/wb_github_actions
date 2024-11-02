import { Component, OnInit, OnDestroy } from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import { Router} from '@angular/router';
import { AuthDoisFatoresModalComponent, ValidarEmailModalComponent } from '../../modals';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, MessageService, ParametrosLocaisService } from './../../../../services';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { Usuario } from '../../../models/usuario';
import { EsqueceuSenhaModalComponent } from '../esqueceu-senha-modal/esqueceu-senha-modal.component';
import { CadastroModalComponent } from '../cadastro-modal/cadastro-modal.component';
import { config } from '../../../config';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Geolocation, GeolocationService } from 'src/app/shared/services/geolocation.service';
import { FormValidations } from 'src/app/shared/utils';
import { BlockPeerAttempsModalComponent } from '../block-peer-attemps-modal/block-peer-attemps-modal.component';
import { LoginService } from 'src/app/shared/services/login.service';

declare var xtremepush: any;

enum LoginErrorCode {
    INACTIVE_REGISTER = 'cadastro_inativo',
    CUSTOMER_BLOCKED = 'customerBlocked',
    ACTIVE_SESSION = 'activeSession'
}

@Component({
    selector: 'app-login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent extends BaseFormComponent implements OnInit, OnDestroy {
    appMobile;
    isMobile = false;
    unsub$ = new Subject();
    usuario = new Usuario();
    isCliente;
    isLoggedIn;
    modalRef;
    mostrarSenha = false;
    authDoisFatoresHabilitado;
    modoClienteHabilitado;
    modoCambistaHabilitado;
    LOGO = config.LOGO;
    loginGoogle = false;
    resgister_cancel = false;
    googleUser;
    showModalLogin: Boolean = true;
    showModalTerminateSession: Boolean = false;
    private geolocation: Geolocation;
    loginMode = 'email';
    inputFocused: boolean;
    inputLoginValue: string;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: UntypedFormBuilder,
        private messageService: MessageService,
        private auth: AuthService,
        private paramsLocais: ParametrosLocaisService,
        private socialAuth: SocialAuthService,
        private router: Router,
        private modalService: NgbModal,
        private geolocationService: GeolocationService,
        private loginService: LoginService,
    ) {
        super();
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();

        if (window.innerWidth > 1025) {
            this.isMobile = false;
        } else {
            this.isMobile = true;
        }

        this.authDoisFatoresHabilitado = this.paramsLocais.getOpcoes().habilitar_auth_dois_fatores;
        this.modoClienteHabilitado = this.paramsLocais.getOpcoes().modo_cliente;
        this.modoCambistaHabilitado = this.paramsLocais.getOpcoes().modo_cambista;
        
        this.createForm();

        this.auth.logado
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                isLoggedIn => {
                    this.isLoggedIn = isLoggedIn;
                    if (isLoggedIn) {
                        this.getUsuario();
                    }
                }
            );

        this.auth.cliente
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                isCliente => this.isCliente = isCliente
            );

        if(this.paramsLocais.getOpcoes().habilitar_login_google) {
            this.loginGoogle = true;
            this.socialAuth.authState
                .pipe(takeUntil(this.unsub$))
                .subscribe((user) => {
                        if (user) {
                            this.form.patchValue({
                                googleId: user.id,
                                googleIdToken: user.idToken
                            });
                            this.submit();
                        }

                        this.googleUser = user;
                    }
                );
        }

        this.geolocationService
            .getGeolocation()
            .then((geolocation) => this.geolocation = geolocation)
    }

    registerCancel(){
        this.resgister_cancel = true;
    }

    createForm() {
        let loginMode = 'email';

        if(this.modoCambistaHabilitado && !this.modoClienteHabilitado){
            this.loginMode = 'agent';
        }
        
        this.form = this.fb.group({
            username: [''],
            password: [''],
            googleId: [''],
            googleIdToken: [''],
            loginMode: [loginMode]
        });
    }

    setLoginMode(mode: 'email' | 'phone' | 'agent') {
        this.form.get('loginMode').setValue(mode);
        this.loginMode = mode;
    }

    ngOnDestroy() {
        if (this.googleUser) {
            this.socialAuth.signOut();
        }
        this.unsub$.next();
        this.unsub$.complete();
    }

    submit() {
        const formData = this.form.value;

        if (this.loginMode === 'phone') {
            formData.username = formData.username.replace(/\s+/g, '');
        }

        this.auth.verificaDadosLogin(formData)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                (res) => {
                    let isLastAuthOlderThan7Days = res.results.user.multifactorNeeded;
                    this.getUsuario();

                    if (
                        Boolean(res) &&
                        Boolean(res.results) &&
                        Boolean(res.results.migracao)
                    ) {
                        this.router.navigate([`/auth/resetar-senha/${res.results.migracao.token}/${res.results.migracao.codigo}`]);
                        this.activeModal.dismiss();
                        return;
                    }

                    if (
                        Boolean(this.usuario) &&
                        this.usuario.tipo_usuario === 'cliente' &&
                        this.authDoisFatoresHabilitado &&
                        (!Boolean(this.auth.getCookie(this.usuario.cookie)) || isLastAuthOlderThan7Days) &&
                        this.usuario.login !== 'suporte@wee.bet'
                    ) {
                        this.abrirModalAuthDoisFatores();
                        return;
                    }

                    this.form.value.cookie = this.auth.getCookie(this.usuario.cookie);
                    this.handleLogin();
                },
                (error) => {
                    if (error.code === LoginErrorCode.INACTIVE_REGISTER) {
                        sessionStorage.setItem('user', JSON.stringify(error.user));
                        this.openModalInactiveRegister();
                    }

                    if (error.code === LoginErrorCode.CUSTOMER_BLOCKED) {
                        this.openModalBlockPeerAttemps();
                    }

                    if (error.code === LoginErrorCode.ACTIVE_SESSION) {
                        this.openModalSessionAlert();
                        return
                    }
                    this.handleError(error.message);
                }
            );
    }

    private openModalInactiveRegister() {
        this.activeModal.dismiss();
        this.modalService.open(ValidarEmailModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            windowClass: 'modal-pop-up',
            centered: true,
            backdrop: 'static'
        });
    }

    private openModalBlockPeerAttemps() {
        this.activeModal.dismiss();
        this.modalRef = this.modalService.open(
            BlockPeerAttempsModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true,
                backdrop: 'static',
                windowClass: 'modal-600'
            }
        );
    }

    openModalSessionAlert() {
        this.showModalLogin = false;
        this.showModalTerminateSession = true;
    }

    getUsuario() {
        this.usuario = this.auth.getUser();
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    abrirCadastro() {
        this.activeModal.dismiss();

        this.modalRef = this.modalService.open(
            CadastroModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'md',
                centered: true,
                windowClass: 'modal-500 modal-cadastro-cliente'
            }
        );
    }

    cancelTerminateSession() {
        this.showModalTerminateSession = false;
        this.showModalLogin = true;
    }

    handleLogin() {
        const data = {
            ...this.form.value,
            cookie: this.auth.getCookie(this.usuario.cookie),
            geolocation: this.geolocation
        };

        this.auth.login(data)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                () => {
                    this.getUsuario();
                    if (this.usuario.tipo_usuario === 'cliente') {
                        if(this.xtremepushHabilitado()){
                            xtremepush('event', 'login');
                        }
                        this.loginService.triggerEvent();
                    } else {
                        location.reload();
                    }
                    this.activeModal.dismiss();
                    this.xtremepushBackgroundRemove();
                },
                error => this.handleError(error)
            );
    }

    abrirRecuperarSenha() {
        this.activeModal.dismiss();
        let options = {};

        if (this.isMobile) {
            options = {
                windowClass: 'modal-fullscreen',
            };
        } else {
            options = {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350',
                centered: true,
            };
        }

        this.modalRef = this.modalService.open(
            EsqueceuSenhaModalComponent, options
        );
    }

    abrirModalAuthDoisFatores() {
        this.activeModal.dismiss();
        this.modalRef = this.modalService.open(
            AuthDoisFatoresModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true,
                backdrop: 'static',
                windowClass: 'modal-600'
            }
        );

        this.modalRef.result
            .then(
                result => {
                },
                reason => {
                }
            );
    }

    toogleSenha() {
        this.mostrarSenha = !this.mostrarSenha;
    }

    onBeforeInput(e, inputName){
        FormValidations.blockInvalidCharacters(e, inputName);
    }

    public toClose() {
        this.activeModal.dismiss('Cross click')
    }

    xtremepushHabilitado() {
        return Boolean(this.paramsLocais.getOpcoes()?.xtremepush_habilitado);
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

    onFocus() {
        this.inputFocused = true;
    }

    onBlur() {
        this.inputFocused = false;
    }

    onInput(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.inputLoginValue = inputElement.value;
    }

    clearInputLoginValue(){
        this.inputLoginValue = '';
    }
}
