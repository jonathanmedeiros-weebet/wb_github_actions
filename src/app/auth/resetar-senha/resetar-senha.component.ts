import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {FormValidations} from '../../shared/utils';
import {config} from '../../shared/config';
import {AuthService} from '../../shared/services/auth/auth.service';
import {MessageService} from '../../shared/services/utils/message.service';

@Component({
    selector: 'app-resetar-senha',
    templateUrl: './resetar-senha.component.html',
    styleUrls: ['./resetar-senha.component.css']
})
export class ResetarSenhaComponent extends BaseFormComponent implements OnInit {
    clienteId;
    recoveryToken;
    LOGO = config.LOGO;
    validToken = false;
    errorMessage = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private messageService: MessageService,
        private authService: AuthService
    ) {
        super();
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params.id && params.token) {
                this.validarToken(params.id, params.token);
            }
        });
        this.createForm();
    }

    validarToken(clienteId, token) {
        this.authService.validateRecoveryToken(clienteId, token)
            .subscribe(
                () => {
                    this.clienteId = clienteId;
                    this.recoveryToken = token;
                    this.validToken = true;
                },
                error => {
                    this.errorMessage = error.message;
                    this.validToken = false;
                }
            );
    }

    createForm() {
        this.form = this.fb.group({
            nova_senha: [null, [Validators.required]],
            senha_confirmacao: [null, [Validators.required, FormValidations.equalsTo('nova_senha')]]
        });
    }

    submit() {
        let values = this.form.value;
        values.cliente_id = this.clienteId;
        values.token = this.recoveryToken;

        this.authService.resetPassword(values)
            .subscribe(
                () => {
                    this.router.navigate(['esportes/futebol/jogos']);
                    this.messageService.success('Senha alterada com sucesso!');
                },
                error => {
                    this.handleError(error);
                }
            );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
