import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import {
    MessageService,
    AuthService
} from './../services';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { FormValidations } from './../shared/utils/form-validation';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-meu-perfil',
    templateUrl: 'meu-perfil.component.html'
})
export class MeuPerfilComponent extends BaseFormComponent implements OnInit, OnDestroy {
    public isCollapsed = false;
    unsub$ = new Subject();

    constructor(
        private messageService: MessageService,
        private auth: AuthService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
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
                    Validators.required
                ])
            ],
            senha_confirmacao: [
                null,
                [Validators.required, FormValidations.equalsTo('senha_nova')]
            ]
        });
    }

    submit() {
        const values = this.form.value;

        this.auth.changePassword(values)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                res => {
                    this.form.reset();
                    this.success();
                },
                error => this.handleError(error)
            );
    }

    success() {
        this.messageService.success('Alterações realizadas com sucesso!');
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
