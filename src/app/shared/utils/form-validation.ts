import {UntypedFormArray, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import * as moment from 'moment';

export class FormValidations {

    static requiredMinCheckbox(min = 1) {
        const validator = (formArray: UntypedFormArray) => {
            /* const values = formArray.controls;
            let totalChecked = 0;
            for (let i = 0; i < values.length; i++) {
              if (values[i].value) {
                totalChecked += 1;
              }
            } */
            const totalChecked = formArray.controls
                .map(v => v.value)
                .reduce((total, current) => current ? total + current : total, 0);
            return totalChecked >= min ? null : { required: true };
        };
        return validator;
    }

    static cepValidator(control: UntypedFormControl) {

        const cep = control.value;
        if (cep && cep !== '') {
            const validacep = /^[0-9]{8}$/;
            return validacep.test(cep) ? null : { cepInvalido: true };
        }
        return null;
    }

    static equalsTo(otherField: string) {
        const validator = (formControl: UntypedFormControl) => {
            if (otherField == null) {
                throw new Error('É necessário informar um campo.');
            }

            if (!formControl.root || !(<UntypedFormGroup>formControl.root).controls) {
                return null;
            }

            const field = (<UntypedFormGroup>formControl.root).get(otherField);

            if (!field) {
                throw new Error('É necessário informar um campo válido.');
            }

            if (field.value !== formControl.value) {
                return { equalsTo: otherField };
            }

            return null;
        };
        return validator;
    }

    static birthdayValidator(control: UntypedFormControl) {
        const rawBirthday = control.value;
        const actualDate = moment();

        const birthday = moment(rawBirthday, 'DDMMYYYY', true);

        if (birthday.isValid()) {
            if (actualDate.diff(birthday, 'years') < 18) {
                return { menorDeIdade: true };
            }
        } else {
            return { dataNascimentoInvalida: true };
        }

        return null;
    }

    static loginValidator(control: UntypedFormControl) {
        const login = control.value;

        if (typeof login !== 'string') {
            return { nomeDeUsuarioInvalido: true };
        }

        if (!login.match(/^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)) {
            return { nomeDeUsuarioInvalido: true };
        }

        return null;
    }

    static cpfValidator(control: UntypedFormControl)  {
        let cpf = control.value;
        if (typeof cpf !== 'string') {
            return { cpfInvalido: true };
        }

        if (!cpf.match(/(^(\d{3}.\d{3}.\d{3}-\d{2})$)/)) {
            return { cpfInvalido: true };
        }

        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) {
            return { cpfInvalido: true };
        }

        cpf = cpf.split('').map(el => +el);
        const rest = (count) => (cpf.slice(0, count - 12)
            .reduce( (soma, el, index) => (soma + el * (count - index)), 0 ) * 10) % 11 % 10;

        const check = rest(10) === cpf[9] && rest(11) === cpf[10];
        return check ? null : { cpfInvalido: true };
    }

    static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any) {
        if (!fieldName) {
            fieldName = 'Campo';
        }
        const config = {
            'required': `${fieldName} obrigatório.`,
            'min': `${fieldName} mínimo requerido é ${validatorValue.min}.`,
            'max': `${fieldName} máximo requerido é ${validatorValue.max}.`,
            'minlength': `${fieldName} precisa ter no mínimo ${validatorValue.requiredLength} caracteres.`,
            'maxlength': `${fieldName} pode ter no máximo ${validatorValue.requiredLength} caracteres.`,
            'cepInvalido': 'CEP inválido.',
            'emailInvalido': 'Email já cadastrado!',
            'email': 'Email Inválido!',
            'equalsTo': 'Campos não são iguais',
            'pattern': 'Campo inválido',
            'matchPin': 'Confirmação diferente do PIN.',
            'loginEmUso': 'Nome de usuário indisponível. Por favor escolha outro',
            'MatchPassword': 'Senhas diferentes. Digite a mesma senha em ambos os campos de senha.',
            'dataNascimentoInvalida': 'Data de Nascimento Inválida.',
            'menorDeIdade': 'Cadastro permitido apenas para maiores de 18 anos.',
            'cpfInvalido': 'CPF Inválido!',
            'nomeDeUsuarioInvalido': 'Nome de usuário só pode conter letras, números e sublinhado (_)'
        };
        return config[validatorName];
    }

    static blockInvalidCharacters(e, inputName){
        const char = String.fromCharCode(e.keyCode);
        let pattern;
        switch (inputName) {
            case 'name':
                pattern = '[a-zA-Z ]';
                break;
            case 'email':
                pattern = '[\/&\'\",;*:<>?!=*{}()#$%\[ ]';
                break;
            case 'password':
                pattern = '[ ]';
                break;
        }

        if (inputName == 'password' || inputName == 'email') {
            if (inputName == 'email') {
                if (char.match(']')) {
                    e.preventDefault();
                }
            }
            if (char.match(pattern)) {
                e.preventDefault();
            }
        } else {
            if (!char.match(pattern)) {
                e.preventDefault();
            }
        }
    }
}
