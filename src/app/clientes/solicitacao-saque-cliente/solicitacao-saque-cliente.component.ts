import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {Cliente} from '../../shared/models/clientes/cliente';
import {MessageService} from '../../shared/services/utils/message.service';
import {FinanceiroService} from '../../shared/services/financeiro.service';

@Component({
    selector: 'app-solicitacao-saque-cliente',
    templateUrl: './solicitacao-saque-cliente.component.html',
    styleUrls: ['./solicitacao-saque-cliente.component.css']
})
export class SolicitacaoSaqueClienteComponent extends BaseFormComponent implements OnInit {
    submitting;
    cadastroCompleto = true;
    respostaSolicitacao;
    errorMessage;
    cliente: Cliente;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private clienteService: ClienteService,
        private financeiroService: FinanceiroService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();

    }

    createForm() {
        this.form = this.fb.group({
                valor: [null, Validators.required]
            }
        );
        const user = JSON.parse(localStorage.getItem('user'));
        this.clienteService.getCliente(user.id)
            .subscribe(
                res => {
                    this.cliente = res;
                    if (!this.cliente.endereco) {
                        this.cadastroCompleto = false;
                        this.errorMessage = 'Por favor, preencha seu cadastro por completo para realizar a solictação de saque.';
                    }
                    if (!this.cliente.chave_pix) {
                        this.cadastroCompleto = false;
                        this.errorMessage = 'Para prosseguir, atualize seu cadastro com a sua chave PIX';
                    }
                },
                error => {
                    this.handleError(error);
                }
            );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    submit() {
        this.submitting = true;
        this.financeiroService.solicitarSaque(this.form.value)
            .subscribe(
                res => {
                    this.respostaSolicitacao = res;
                    this.submitting = false;
                },
                error => {
                    this.handleError(error);
                    this.submitting = false;
                }
            );
    }

}
