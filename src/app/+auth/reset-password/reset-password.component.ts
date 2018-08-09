import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { AuthService, MessageService } from '../../services';
import { PasswordValidation } from './../../shared/utils';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styles: []
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    form: FormGroup;
    disabledButton = false;
    sub: Subscription;

    constructor(
        private auth: AuthService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.createForm();

        this.sub = this.route.queryParams.subscribe((params: any) => {
            const userId = params['user_id'] || null;
            const passwordKey = params['password_key'] || null;

            this.form.patchValue({
                user_id: userId,
                password_key: passwordKey
            });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    createForm() {
        this.form = this.fb.group({
            user_id: ['', Validators.required],
            password_key: ['', Validators.compose([Validators.required])],
            new_password: [
                '',
                Validators.compose([Validators.required, Validators.minLength(4)])
            ],
            confirmation_password: [
                '',
                Validators.compose([Validators.required, Validators.minLength(4)])
            ]
        }, { validator: PasswordValidation.MatchPassword });
    }

    onSubmit() {
        this.disabledButton = true;

        if (this.form.valid) {
            const values = this.form.value;

            this.auth.resetPassword(values).subscribe(
                () => this.success(),
                error => this.handleError(error)
            );
        } else {
            this.disabledButton = false;
            this.checkFormValidations(this.form);
        }
    }

    success() {
        this.messageService.success('Senha recuperada com sucesso!');
        this.router.navigate(['/auth/login']);
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
