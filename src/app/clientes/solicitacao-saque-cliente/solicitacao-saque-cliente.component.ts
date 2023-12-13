import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {Cliente} from '../../shared/models/clientes/cliente';
import {MessageService} from '../../shared/services/utils/message.service';
import {FinanceiroService} from '../../shared/services/financeiro.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {AuthService, SidebarService} from 'src/app/services';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ClientePerfilModalComponent, ClientePixModalComponent, ConfirmModalComponent} from 'src/app/shared/layout/modals';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-solicitacao-saque-cliente',
    templateUrl: './solicitacao-saque-cliente.component.html',
    styleUrls: ['./solicitacao-saque-cliente.component.css']
})
export class SolicitacaoSaqueClienteComponent extends BaseFormComponent implements OnInit, OnDestroy {
    submitting;
    disableButtom = false;
    showLoading = true;
    cadastroCompleto = true;
    rotaCompletarCadastro: string;
    respostaSolicitacao;
    errorMessage;
    cliente: Cliente;
    valorMinSaque;
    valorMaxSaqueDiario;
    valorMaxSaqueMensal;
    apiPagamentos;
    metodoPagamentoDesabilitado;
    isMobile = false;
    modalRef;
    pspsSaqueAutomatico = ['SAUTOPAY', 'PRIMEPAG', 'PAGFAST', 'BIGPAG', 'LETMEPAY', 'PAAG', 'PAY2M'];
    qtdRolloverAtivos = 0;
    saldo = 0;
    saques = [];

    constructor(
        private fb: UntypedFormBuilder,
        private messageService: MessageService,
        private clienteService: ClienteService,
        private financeiroService: FinanceiroService,
        private menuFooterService: MenuFooterService,
        private paramsLocais: ParametrosLocaisService,
        private sidebarService: SidebarService,
        private modalService: NgbModal,
        private auth: AuthService,
        public activeModal: NgbActiveModal,
        private translate: TranslateService,
        private router: Router
    ) {
        super();
    }

    ngOnInit() {
        if (window.innerWidth <= 1024) {
            this.isMobile = true;
        } else {
            this.sidebarService.changeItens({contexto: 'cliente'});
            this.menuFooterService.setIsPagina(true);
        }

        this.getRollovers();

        this.valorMinSaque = this.paramsLocais.getOpcoes().valor_min_saque_cliente;
        this.valorMaxSaqueDiario = this.paramsLocais.getOpcoes().valor_max_saque_diario_cliente;
        this.valorMaxSaqueMensal = this.paramsLocais.getOpcoes().valor_max_saque_mensal_cliente;
        this.apiPagamentos = this.paramsLocais.getOpcoes().api_pagamentos;
        this.metodoPagamentoDesabilitado = this.paramsLocais.getOpcoes().metodo_pagamento_desabilitado;
        this.createForm();
        const user = JSON.parse(localStorage.getItem('user'));

        this.getSaques();

        this.auth.getPosicaoFinanceira()
            .subscribe(
                posicaoFinanceira => {
                    this.saldo = posicaoFinanceira.saldo;
                    if(posicaoFinanceira.saldo == 0){
                        this.disableButtom = true;
                    }
                },
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
                    if (this.apiPagamentos != 'pagfast' || this.metodoPagamentoDesabilitado) {
                        if (!this.cliente.endereco) {
                            this.cadastroCompleto = false;
                            this.rotaCompletarCadastro = '/clientes/perfil';
                            this.errorMessage = this.translate.instant('saques.preenchaCadastroCompleto');
                        }
                        if (!this.cliente.chave_pix) {
                            this.cadastroCompleto = false;
                            this.rotaCompletarCadastro = '/clientes/perfil-pix';
                            this.errorMessage = this.translate.instant('saques.paraProsseguirAtualizeChavePix');
                        }
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
                valor: [0, [Validators.required, Validators.min(this.valorMinSaque), Validators.max(this.valorMaxSaqueDiario)]]
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
                    this.getSaques();
                },
                error => {
                    this.handleError(error);
                    this.submitting = false;
                }
            );
    }

    cancelarSolicitacaoSaque(solicitacaoSaqueId) {
        this.modalRef = this.modalService.open(ConfirmModalComponent, {centered: true});
        this.modalRef.componentInstance.title = 'Cancelamento';
        this.modalRef.componentInstance.msg = 'Tem certeza que deseja cancelar a solicitação de saque?';

        this.modalRef.result.then(
            () => {
                this.financeiroService.cancelarSolicitacaoSaque(solicitacaoSaqueId)
                    .subscribe(
                        response => {
                            this.messageService.success('Solicitação de Saque Cancelada');
                            this.submit();
                        },
                        error => {
                            this.handleError(error);
                        }
                    );
            }
        );
    }

    exibirCancelarSolicitacaoSaque(depositoSaque) {
        if (this.pspsSaqueAutomatico.includes(depositoSaque.psp)){
            return false;
        }

        return !depositoSaque.data_pagamento && depositoSaque.status == 'PENDENTE';
    }

    completarCadatro() {
        if (this.isMobile) {
            if (this.rotaCompletarCadastro === '/clientes/perfil-pix') {
                this.modalService.open(ClientePixModalComponent);
            }
            if (this.rotaCompletarCadastro === '/clientes/perfil') {
                this.modalService.open(ClientePerfilModalComponent);
            }
            this.activeModal.close();
        } else {
            this.router.navigate([this.rotaCompletarCadastro]);
        }
    }

    getSaques() {
        const queryParams: any = {
            'periodo': '',
            'tipo': 'saques',
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
    }

    getRollovers() {
        const queryParams: any = {
            'status': 'ativo',
        };
        this.financeiroService.getRollovers(queryParams)
        .subscribe(
            response => {
                this.qtdRolloverAtivos = response.length;
            },
            error => {
                this.handleError(error);
            }
        );

    }
}
