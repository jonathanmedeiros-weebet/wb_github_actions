import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, MessageService } from './../../../../services';
import { BaseFormComponent } from '../../base-form/base-form.component';

@Component({
    selector: 'app-auth-dois-fatores-modal',
    templateUrl: './auth-dois-fatores-modal.component.html',
    styleUrls: ['./auth-dois-fatores-modal.component.css']
})
export class AuthDoisFatoresModalComponent extends BaseFormComponent implements OnInit {
    submitting = false;
    cronometro = 60;
    botaoReenviar = false;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private messageService: MessageService,
        private auth: AuthService,
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.enviarEmail();
        this.contagem();
    }

    createForm() {
        const usuario = this.auth.getUser();
        this.form = this.fb.group({
            codigo: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
            id: [usuario.id],
        });
    }

    submit() {
        this.auth.loginAuthDoisFatores(this.form.value)
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
                () => { },
                error => this.handleError(error)
            );
    }

    reenviarEmail() {
        this.cronometro = 60;
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
            this.cronometro = this.cronometro - 1;
            if (this.cronometro === 0) {
                clearInterval(time);
                this.botaoReenviar = true;
            }
        }, 1000);
    }

}
