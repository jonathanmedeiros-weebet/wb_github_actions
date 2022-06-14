import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, ApostaService, MessageService, ParametrosLocaisService } from './../../../../services';
import {BaseFormComponent} from '../../base-form/base-form.component';
import {Router} from '@angular/router';
import {Usuario} from '../../../models/usuario';



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

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private apostaService: ApostaService,
        private messageService: MessageService,
        private auth: AuthService,
        private paramsLocais: ParametrosLocaisService,
        private router: Router,
    ) {
        super();
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
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
    getUsuario() {
        this.usuario = this.auth.getUser();
    }
    handleError(error: string) {
        this.messageService.error(error);
    }

    abrirCadastro() {
        this.activeModal.dismiss();
        this.router.navigate(['auth/cadastro']);
    }

    abrirRecuperarSenha() {
        this.activeModal.dismiss();
        this.router.navigate(['auth/recuperar-senha']);
    }
}
