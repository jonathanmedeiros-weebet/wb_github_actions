import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../shared/layout/base-form/base-form.component';
import {FormBuilder} from '@angular/forms';
import {ClienteService} from '../../../shared/services/clientes/cliente.service';
import {MessageService} from '../../../shared/services/utils/message.service';
import {formatDate} from '@angular/common';

@Component({
    selector: 'app-informacoes-pessoais',
    templateUrl: './informacoes-pessoais.component.html',
    styleUrls: ['./informacoes-pessoais.component.css']
})
export class InformacoesPessoaisComponent extends BaseFormComponent implements OnInit {

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
                            nome: cliente?.nome.toUpperCase(),
                            nascimento: formatDate(cliente.dataNascimento.date, 'dd/MM/YYYY', 'pt-BR'),
                            sexo: cliente?.genero.toUpperCase(),
                            cpf: cliente.cpf
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
            nome: [{value: '', disabled: true}],
            nascimento: [{value: '', disabled: true}],
            sexo: [{value: '', disabled: true}],
            cpf: [{value: '', disabled: true}]
        });
    }

    handleError(mensagem: string) {
        this.messageService.error(mensagem);
    }

    submit() {
    }

}
