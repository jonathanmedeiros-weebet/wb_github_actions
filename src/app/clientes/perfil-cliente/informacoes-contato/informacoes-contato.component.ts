import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {ClienteService} from '../../../shared/services/clientes/cliente.service';
import {MessageService} from '../../../shared/services/utils/message.service';
import {formatDate} from '@angular/common';
import {result} from 'lodash';

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
                            email: cliente.email
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
            telefone:    ['', Validators.required],
            email:       ['', Validators.required],
            senha_atual: ['', Validators.required]
        });
    }

    handleError(msg: string) {
        this.messageService.error(msg);
    }

    submit() {
        const informacoesContato = this.form.value;
        this.clienteService.atualizarDadosContato(informacoesContato)
            .subscribe(
                () => {
                    this.messageService.success('Dados atualizados com sucesso');
                },
                error => {
                    this.handleError(error);
                }
            );
    }

}
