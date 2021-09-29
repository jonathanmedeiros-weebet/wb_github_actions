import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {ClienteService} from '../../../shared/services/clientes/cliente.service';
import {MessageService} from '../../../shared/services/utils/message.service';
import {FormValidations} from '../../../shared/utils';

@Component({
    selector: 'app-informacoes-acesso',
    templateUrl: './informacoes-acesso.component.html',
    styleUrls: ['./informacoes-acesso.component.css']
})
export class InformacoesAcessoComponent extends BaseFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private messageService: MessageService
    ) {
        super();
    }

    ngOnInit(): void {
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            senha_atual: [null, [Validators.required]],
            nova_senha: [null, [Validators.required]],
            senha_confirmacao: [null, [Validators.required, FormValidations.equalsTo('nova_senha')]]
        });
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    submit() {
        const values = this.form.value;
        this.clienteService.alterarSenha(values)
            .subscribe(result => {
                    this.messageService.success(result);
                    this.form.patchValue({
                        senha_atual: '',
                        nova_senha: '',
                        senha_confirmacao: ''
                    });
                },
                error => this.handleError(error));
    }

}
