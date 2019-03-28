import { AbstractControl } from '@angular/forms';

export class PinValidation {

    static MatchPin(AC: AbstractControl) {
        let valid = false;
        const passwordControl = AC.get('pin');
        const confirmControl = AC.get('pin_confirmacao');

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
            confirmControl.setErrors({ matchPin: true });
        }
    }
}
