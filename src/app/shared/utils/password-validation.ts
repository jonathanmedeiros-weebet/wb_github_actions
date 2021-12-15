import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
        let valid = false;
        const passwordControl = AC.get('password') || AC.get('new_password') || AC.get('senha') || AC.get('senha_nova') || AC.get('nova_senha');
        const confirmControl = AC.get('confirm') || AC.get('confirmation_password') || AC.get('senha_confirmacao');

        if ((passwordControl.valid && passwordControl.dirty) && (confirmControl.valid && confirmControl.dirty)) {
            if (passwordControl.value === confirmControl.value) {
                valid = true;
            }
        } else {
            valid = true;
        }

        if (valid) {
            return null;
        } else {
            confirmControl.setErrors({ MatchPassword: true });
        }
    }
}
