import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, MessageService } from './../../../../services';
import { BaseFormComponent } from '../../base-form/base-form.component';

import {config} from '../../../config';
import { Geolocation, GeolocationService } from 'src/app/shared/services/geolocation.service';

@Component({
    selector: 'app-auth-dois-fatores-modal',
    templateUrl: './auth-dois-fatores-modal.component.html',
    styleUrls: ['./auth-dois-fatores-modal.component.css']
})
export class AuthDoisFatoresModalComponent extends BaseFormComponent implements OnInit {
    submitting = false;
    cronometro = 60;
    botaoReenviar = false;

    codigo = '';

    LOGO = config.LOGO;
    private geolocation: Geolocation;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: UntypedFormBuilder,
        private messageService: MessageService,
        private auth: AuthService,
        private geolocationService: GeolocationService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.enviarEmail();
        this.contagem();

        this.geolocationService
            .getGeolocation()
            .then((geolocation) => this.geolocation = geolocation)
    }

    createForm() {
        const usuario = this.auth.getUser();
        this.form = this.fb.group({
            codigo: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
            id: [usuario.id],
        });
    }

    submit() {
        const data = {
            ...this.form.value,
            geolocation: this.geolocation
        };

        this.auth.loginAuthDoisFatores(data)
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

    onCodeChanged(code: string) {
        console.log('Change:', code);
        this.codigo = code;
    }

    onCodeCompleted(code: string) {
        console.log('Complete:', code);
        this.codigo = code;
    }

}
