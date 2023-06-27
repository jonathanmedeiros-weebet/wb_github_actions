import { UntypedFormGroup, UntypedFormArray } from '@angular/forms';

export abstract class BaseFormComponent {
    form: UntypedFormGroup;

    constructor() { }

    abstract createForm();
    abstract submit();
    abstract handleError(error: string);

    onSubmit() {
        if (this.form.valid) {
            this.submit();
        } else {
            this.checkFormValidations(this.form);
        }
    }

    reset() {
        this.form.reset();
    }

    checkFormValidations(formGroup: UntypedFormGroup | UntypedFormArray) {
        Object.keys(formGroup.controls).forEach(field => {
            const controle = formGroup.get(field);
            controle.markAsDirty();
            controle.markAsTouched();

            if (controle instanceof UntypedFormGroup || controle instanceof UntypedFormArray) {
                this.checkFormValidations(controle);
            }
        });
    }

    verifyValidTouched(field: string) {
        return (
            !this.form.get(field).valid &&
            (this.form.get(field).touched || this.form.get(field).dirty)
        );
    }

    hasError(field: string, errorName: string, children?: string) {
        if (children !== undefined) {
            field = field.concat(`.${children}`);
        }
        let hasError = false;
        const control = this.form.get(field);

        if (control.touched || control.dirty) {
            hasError = control.hasError(errorName);
        }

        return hasError;
    }

    applyCssInputError(field: string, children?: string) {
        if (children !== undefined) {
            field = field.concat(`.${children}`);
        }
        return {
            'is-invalid': this.verifyValidTouched(field)
        };
    }

    applyCssDivError(field: string, children?: string) {
        if (children !== undefined) {
            field = field.concat(`.${children}`);
        }
        return {
            'has-danger': this.verifyValidTouched(field)
        };
    }
}
