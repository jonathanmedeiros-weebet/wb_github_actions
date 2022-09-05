import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, ApostaService, MessageService } from './../../../../services';
import {BaseFormComponent} from '../../base-form/base-form.component';

import {Usuario} from '../../../models/usuario';



@Component({
    selector: 'app-auth-dois-fatores-modal',
    templateUrl: './auth-dois-fatores-modal.component.html',
    styleUrls: ['./auth-dois-fatores-modal.component.css']
})
export class AuthDoisFatoresModalComponent extends BaseFormComponent implements OnInit {
    appMobile;
    usuario = new Usuario();
    isCliente;
    isLoggedIn;
    submitting = false;
    scope = 5;
    botaoReenviar = false;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private apostaService: ApostaService,
        private messageService: MessageService,
        private auth: AuthService,
    ) {
        super();
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.createForm();
        this.enviarEmail();
        this.contagem();
    }
    createForm() {
        this.form = this.fb.group({
            etapa: [2],
            codigo: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        });
    }
    submit() {
        this.auth.login(this.form.value)
            .subscribe(
                () => {
                    this.messageService.success('Código validado com sucesso.');
                    this.activeModal.dismiss();
                },
                error => this.handleError(error)
            );
    }
    handleError(error: string) {
        this.messageService.error(error);
    }
    enviarEmail() {
        this.auth.enviarCodigoEmail(JSON.parse(localStorage.getItem('user')))
            .subscribe(
                () => {},
                error => this.handleError(error)
            );
    }
    reenviarEmail() {
        this.scope = 5;
        this.submitting = true;
        this.auth.enviarCodigoEmail(JSON.parse(localStorage.getItem('user')))
            .subscribe(
                () => {
                    this.messageService.success('E-mail Enviado.');
                    this.submitting = false;
                    this.contagem();
                },
                error => this.handleError(error)
            );
    }
    contagem() {
        this.botaoReenviar = false;
        const time = setInterval(() => {
            this.scope = this.scope - 1;
            if (this.scope === 0) {
                clearInterval(time);
                this.botaoReenviar = true;
            }
        }, 1000);
    }
}
