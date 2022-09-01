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
        this.reenviarEmail();
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
    reenviarEmail() {
        this.auth.enviarCodigoEmail(JSON.parse(localStorage.getItem('user')))
            .subscribe(
                () => {
                    this.messageService.success('E-mail Enviado.');
                },
                error => this.handleError(error)
            );
    }
}
