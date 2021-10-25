import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {FormValidations} from '../../shared/utils';
import {config} from '../../shared/config';

@Component({
    selector: 'app-resetar-senha',
    templateUrl: './resetar-senha.component.html',
    styleUrls: ['./resetar-senha.component.css']
})
export class ResetarSenhaComponent extends BaseFormComponent implements OnInit {
    clienteId;
    tokenRecuperacao;
    tokenValido = false;
    LOGO = config.LOGO;

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private clienteService: ClienteService
    ) {
        super();
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params.id && params.token) {
                this.clienteId = params.id;
                this.tokenRecuperacao = params.token;
            }
        });
        this.createForm();
    }

    validarToken(clienteId, token) {

    }

    createForm() {
        this.form = this.fb.group({
            nova_senha: [null, [Validators.required]],
            senha_confirmacao: [null, [Validators.required, FormValidations.equalsTo('nova_senha')]]
        });
    }

    handleError(error: string) {
    }

    submit() {
    }

}
