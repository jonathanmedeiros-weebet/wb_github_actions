import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { AuthService, MessageService } from '../../services';
import { config } from './../../shared/config';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    LOGO = config.LOGO;
    BANCA_NOME = config.BANCA_NOME;
    BG = config.BG;
    disabledButton = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private auth: AuthService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.createForm();
    }

    updateValueAndValidity(form) {
        Object.keys(form.controls).forEach(field => {
            const control = form.get(field);
            control.updateValueAndValidity();
        });
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

    onSubmit() {
        this.disabledButton = true;

        if (this.form.valid) {
            let dados = {
                username: this.form.value.username,
                password: this.form.value.password
            };

            this.auth.login(dados).subscribe(
                () => this.router.navigate(['/']),
                error => this.handleError(error)
            );
        } else {
            this.disabledButton = false;
            this.checkFormValidations(this.form);
        }
    }

    handleError(error: string) {
        this.disabledButton = false;
        this.messageService.error(error);
    }

    checkFormValidations(form) {
        Object.keys(form.controls).forEach(field => {
            const control = form.get(field);
            control.markAsTouched();
            if (control instanceof FormGroup || control instanceof FormArray) {
                this.checkFormValidations(control);
            }
        });
    }

    verifyInvalidTouch(field) {
        const control = this.form.get(field);
        return !control.valid && control.touched;
    }

    applyCssErrorDiv(field: string, children?: string) {
        if (children != undefined) {
            field = field.concat(`.${children}`);
        }
        return {
            'has-error': this.verifyInvalidTouch(field)
        };
    }

    hasError(field: string, errorName: string, children?: string): boolean {
        if (children != undefined) {
            field = field.concat(`.${children}`);
        }
        let hasError = false;
        const control = this.form.get(field);

        if (control.touched) {
            hasError = control.hasError(errorName);
        }

        return hasError;
    }
}
