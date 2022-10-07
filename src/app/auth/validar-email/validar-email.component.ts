import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {FormValidations, PasswordValidation} from '../../shared/utils';
import {config} from '../../shared/config';
import {AuthService} from '../../shared/services/auth/auth.service';
import {MessageService} from '../../shared/services/utils/message.service';

@Component({
    selector: 'app-validar-email',
    templateUrl: './validar-email.component.html',
    styleUrls: ['./validar-email.component.css']
})
export class ValidarEmailComponent extends BaseFormComponent implements OnInit {
    recoveryToken;
    LOGO = config.LOGO;
    submitting = false;
    cronometro = 60;
    botaoReenviar = true;
    usuario;
    cadastroAtivado = false;
    habilitarReenvio;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private messageService: MessageService,
        private auth: AuthService,
    ) {
        super();
    }

    ngOnInit() {
        if (!sessionStorage.getItem('user')) {
            this.router.navigate(['esportes/futebol']);
        } else {
            this.usuario = sessionStorage.getItem('user');
        }
        console.log(this.usuario);
    }

    reenviarLinkAtivacao() {
        this.cronometro = 60;
        this.submitting = true;
        this.auth.enviarLinkAtivacao({id: this.usuario})
            .subscribe(
                () => {
                    this.messageService.success('E-mail Enviado.');
                    this.submitting = false;
                },
                error => this.handleError(error)
            );
        this.contagem();
    }

    handleError(error: string) {
        localStorage.removeItem('user');
        this.router.navigate(['esportes/futebol']);
        this.messageService.error(error);
    }

    createForm() {
    }

    submit() {
    }

    contagem() {
        this.botaoReenviar = false;
        const time = setInterval(() => {
            this.cronometro = this.cronometro - 1;
            if (this.cronometro === 0) {
                clearInterval(time);
                this.botaoReenviar = true;
            }
        }, 1000);
    }
}
