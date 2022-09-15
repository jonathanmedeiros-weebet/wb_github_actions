import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from '../../shared/services/clientes/cliente.service';
import { Cliente } from '../../shared/models/clientes/cliente';
import { MessageService } from '../../shared/services/utils/message.service';
import { FinanceiroService } from '../../shared/services/financeiro.service';
import { MenuFooterService } from "../../shared/services/utils/menu-footer.service";
import { ParametrosLocaisService } from "../../shared/services/parametros-locais.service";
import { SidebarService, AuthService } from 'src/app/services';

@Component({
    selector: 'app-solicitacao-saque-cliente',
    templateUrl: './solicitacao-saque-cliente.component.html',
    styleUrls: ['./solicitacao-saque-cliente.component.css']
})
export class SolicitacaoSaqueClienteComponent extends BaseFormComponent implements OnInit, OnDestroy {
    submitting;
    showLoading = true;
    cadastroCompleto = true;
    respostaSolicitacao;
    errorMessage;
    cliente: Cliente;
    valorMinSaque;

    saldo = 0;
    saques = [];

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private clienteService: ClienteService,
        private financeiroService: FinanceiroService,
        private menuFooterService: MenuFooterService,
        private paramsLocais: ParametrosLocaisService,
        private sidebarService: SidebarService,
        private auth: AuthService,
    ) {
        super();
    }

    ngOnInit() {
        this.sidebarService.changeItens({contexto: 'cliente'});

        this.valorMinSaque = this.paramsLocais.getOpcoes().valor_min_saque_cliente;
        this.createForm();
        this.menuFooterService.setIsPagina(true);
        const user = JSON.parse(localStorage.getItem('user'));

        const queryParams: any = {
            'periodo': '',
            'tipo':  'saques',
        };
        this.financeiroService.getDepositosSaques(queryParams)
            .subscribe(
                response => {
                    this.saques = response;
                },
                error => {
                    this.handleError(error);
                    this.showLoading = false;
                }
            );

        this.auth.getPosicaoFinanceira()
            .subscribe(
                posicaoFinanceira => this.saldo = posicaoFinanceira.saldo,
                error => {
                    if (error === 'Não autorizado.' || error === 'Login expirou, entre novamente.') {
                        this.auth.logout();
                    } else {
                        this.handleError(error);
                    }
                }
            );

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

                    this.showLoading = false;
                },
                error => {
                    this.handleError(error);
                }
            );
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            valor: [0, [Validators.required, Validators.min(this.valorMinSaque)]]
        }
        );
    }

    handleError(error: string) {
        this.messageService.error(error);
        this.showLoading = false;
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
