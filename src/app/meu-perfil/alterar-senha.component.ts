import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import {AuthService, ClienteService, MenuFooterService, MessageService} from './../services';
import {BaseFormComponent} from '../shared/layout/base-form/base-form.component';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PasswordValidation} from "../shared/utils";

@Component({
    selector: 'app-meu-perfil',
    templateUrl: 'alterar-senha.component.html'
})
export class AlterarSenhaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    public isCollapsed = false;
    unsub$ = new Subject();
    isCliente;

    constructor(
        private messageService: MessageService,
        private auth: AuthService,
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private menuFooterService: MenuFooterService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.isCliente = this.auth.isCliente();
        this.menuFooterService.setIsPagina(true);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            senha_atual: ['', Validators.required],
            senha_nova: ['', [Validators.required, Validators.minLength(3)]],
            senha_confirmacao: ['', [Validators.required, Validators.minLength(3)]]
        }, {validator: PasswordValidation.MatchPassword});
    }

    submit() {
        const values = this.form.value;
        if (this.isCliente) {
            this.clienteService.alterarSenha(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    res => {
                        this.form.reset();
                        this.success();
                    },
                    error => this.handleError(error)
                );
        } else {
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
    }

    success() {
        this.messageService.success('Alterações realizadas com sucesso!');
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
