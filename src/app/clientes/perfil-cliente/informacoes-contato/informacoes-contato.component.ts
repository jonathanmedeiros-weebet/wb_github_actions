import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {ClienteService} from '../../../shared/services/clientes/cliente.service';
import {MessageService} from '../../../shared/services/utils/message.service';
import {formatDate} from '@angular/common';

@Component({
    selector: 'app-informacoes-contato',
    templateUrl: './informacoes-contato.component.html',
    styleUrls: ['./informacoes-contato.component.css']
})
export class InformacoesContatoComponent extends BaseFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private messageService: MessageService
    ) {
        super();
    }

    ngOnInit(): void {
        this.createForm();
        const user = JSON.parse(localStorage.getItem('user'));
        this.clienteService.getCliente(user.id)
            .subscribe(
                cliente => {
                    console.log(cliente);
                    this.form.patchValue(
                        {
                            telefone: cliente.telefone,
                            cpf: cliente.email
                        }
                    );
                },
                error => {
                    this.handleError('ALgo inesperado aconteceu. Tente novamente mais tarde.');
                }
            );
    }

    createForm() {
        this.form = this.fb.group({
            telefone:    [null, Validators.required],
            email:       [null, Validators.required],
            senha_atual: [null, Validators.required]
        });
    }

    handleError(error: string) {
    }

    submit() {
    }

}
