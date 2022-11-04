import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import { AuthDoisFatoresModalComponent } from '../../modals';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, ApostaService, MessageService, ParametrosLocaisService } from './../../../../services';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { Usuario } from '../../../models/usuario';
import { EsqueceuSenhaModalComponent } from '../esqueceu-senha-modal/esqueceu-senha-modal.component';
import { CadastroModalComponent } from '../cadastro-modal/cadastro-modal.component';
import {config} from '../../../config';

@Component({
    selector: 'app-login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent extends BaseFormComponent implements OnInit, OnDestroy {
    appMobile;
    unsub$ = new Subject();
    usuario = new Usuario();
    isCliente;
    isLoggedIn;
    modalRef;
    mostrarSenha = false;
    authDoisFatoresHabilitado;
    modoClienteHabilitado;
    LOGO = config.LOGO;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private apostaService: ApostaService,
        private messageService: MessageService,
        private auth: AuthService,
        private paramsLocais: ParametrosLocaisService,
        private router: Router,
        private modalService: NgbModal
    ) {
        super();
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.createForm();
        this.authDoisFatoresHabilitado = this.paramsLocais.getOpcoes().habilitar_auth_dois_fatores;
        this.modoClienteHabilitado = this.paramsLocais.getOpcoes().modo_cliente;
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
    }

    createForm() {
        this.form = this.fb.group({
            username: ['', Validators.compose([Validators.required])],
            password: [
                '',
                Validators.compose([Validators.required, Validators.minLength(2)])
            ]
        });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    submit() {
        this.auth.verificaDadosLogin(this.form.value)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                () => {
                    this.getUsuario();
                    if (this.usuario.tipo_usuario === 'cliente' &&
                        this.authDoisFatoresHabilitado &&
                        this.auth.getCookie(this.usuario.cookie) === '') {
                        this.abrirModalAuthDoisFatores();
                    } else {
                        this.form.value.cookie = this.auth.getCookie(this.usuario.cookie);
                        this.auth.login(this.form.value)
                            .pipe(takeUntil(this.unsub$))
                            .subscribe(
                                () => {
                                    this.getUsuario();
                                    if (this.usuario.tipo_usuario === 'cambista') {
                                        location.reload();
                                    }
                                    this.activeModal.dismiss();
                                },
                                error => this.handleError(error)
                            );
                    }
                },
                error => {
                    this.handleError(error.message);
                    if (error.code === 'cadastro_inativo') {
                        sessionStorage.setItem('user', JSON.stringify(error.user));
                        this.activeModal.dismiss();
                        this.router.navigate(['auth/validar-email']);
                    }
                }
            );
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
                size: 'lg',
                centered: true,
            }
        );
    }

    abrirRecuperarSenha() {
        this.activeModal.dismiss();

        this.modalRef = this.modalService.open(
            EsqueceuSenhaModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-600',
                centered: true,
            }
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
}
