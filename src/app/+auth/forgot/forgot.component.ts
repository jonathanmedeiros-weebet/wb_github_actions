import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { AuthService, MessageService } from '../../services';

@Component({
    selector: 'app-forgot',
    templateUrl: './forgot.component.html'
})
export class ForgotComponent implements OnInit {
    form: FormGroup;
    disabledButton = false;

    constructor(
        private router: Router,
        private auth: AuthService,
        private fb: FormBuilder,
        private messageService: MessageService
    ) { }
    ngOnInit() {
        this.createForm();
    }
    createForm() {
        this.form = this.fb.group({
            username: ['', Validators.compose([Validators.required])]
        });
    }

    onSubmit() {
        this.disabledButton = true;

        if (this.form.valid) {
            this.auth.forgot(this.form.value).subscribe(
                () => this.success(),
                error => this.handleError(error)
            );
        } else {
            this.disabledButton = false;
            this.checkFormValidations(this.form);
        }
    }

    success() {
        alert('Verifique seu e-mail e siga as instruções para recuperar sua senha.');
        this.router.navigate(['/']);
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
        if (children !== undefined) {
            field = field.concat(`.${children}`);
        }
        return {
            'has-error': this.verifyInvalidTouch(field)
        };
    }

    hasError(field: string, errorName: string, children?: string): boolean {
        if (children !== undefined) {
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
