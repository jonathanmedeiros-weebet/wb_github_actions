import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { AuthService, MessageService } from '../../services';
import { config } from './../../shared/config';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseFormComponent implements OnInit, OnDestroy {
    LOGO = config.LOGO;
    BANCA_NOME = config.BANCA_NOME;
    BG = config.BG;
    unsub$ = new Subject();

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private auth: AuthService,
        private messageService: MessageService
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
            username: ['', Validators.compose([Validators.required])],
            password: [
                '',
                Validators.compose([Validators.required, Validators.minLength(2)])
            ]
        });
    }

    submit() {
        const dados = {
            username: this.form.value.username,
            password: this.form.value.password
        };

        this.auth.login(dados)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                () => this.router.navigate(['/']),
                error => this.handleError(error)
            );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    updateValueAndValidity(form) {
        Object.keys(form.controls).forEach(field => {
            const control = form.get(field);
            control.updateValueAndValidity();
        });
    }
}
