import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import {
    MessageService,
    AuthService, ClienteService
} from './../services';
import { BaseFormComponent } from '../shared/layout/base-form/base-form.component';
import { FormValidations } from './../shared/utils/form-validation';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-meu-perfil',
    templateUrl: 'alterar-senha.component.html'
})
export class AlterarSenhaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    public isCollapsed = false;
    unsub$ = new Subject();
    isCambista;

    constructor(
        private messageService: MessageService,
        private auth: AuthService,
        private fb: FormBuilder,
        private clienteService: ClienteService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.isCambista = this.auth.isCambista();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            senha_atual: [
                null,
                Validators.compose([
                    Validators.required
                ])
            ],
            senha_nova: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(3)
                ])
            ],
            senha_confirmacao: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                    FormValidations.equalsTo('senha_nova')]
                )
            ]
        });
    }

    submit() {
        const values = this.form.value;

        if (this.isCambista) {
            this.auth.changePassword(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    res => {
                        this.form.reset();
                        this.success();
                    },
                    error => this.handleError(error)
                );
        } else {
            this.clienteService.alterarSenha(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    res => {
                        this.form.reset();
                        this.success();
                    },
                    error => this.handleError(error)
                );
        }
    }

    success() {
        this.messageService.success('Alterações realizadas com sucesso!');
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
