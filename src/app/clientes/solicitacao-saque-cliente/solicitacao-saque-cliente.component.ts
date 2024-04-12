import { Component, OnDestroy, OnInit, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ClienteService } from '../../shared/services/clientes/cliente.service';
import { Cliente } from '../../shared/models/clientes/cliente';
import { MessageService } from '../../shared/services/utils/message.service';
import { FinanceiroService } from '../../shared/services/financeiro.service';
import { MenuFooterService } from '../../shared/services/utils/menu-footer.service';
import { ParametrosLocaisService } from '../../shared/services/parametros-locais.service';
import { AuthService, LayoutService, SidebarService } from 'src/app/services';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientePerfilModalComponent, ClientePixModalComponent, ConfirmModalComponent } from 'src/app/shared/layout/modals';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-solicitacao-saque-cliente',
    templateUrl: './solicitacao-saque-cliente.component.html',
    styleUrls: ['./solicitacao-saque-cliente.component.css']
})
export class SolicitacaoSaqueClienteComponent extends BaseFormComponent implements OnInit, OnDestroy {
    unsub$ = new Subject();
    cliente: Cliente;
    modalRef;

    pspsSaqueAutomatico = ['SAUTOPAY', 'PRIMEPAG', 'PAGFAST', 'BIGPAG', 'LETMEPAY', 'PAAG', 'PAY2M'];
    saques = [];
    respostaSolicitacao;

    rotaCompletarCadastro: string;
    labelChavePix = '';
    paymentMethod;
    paymentMethodSelected = '';
    errorMessage;
    selectedKeyType = 'cpf';

    valorMinSaque;
    valorMaxSaqueDiario;
    valorMaxSaqueMensal;
    qtdRolloverAtivos = 0;
    saldo = 0;
    headerHeight = 92;

    disableButton = false;
    showLoading = true;
    cadastroCompleto = true;
    isMobile = false;
    permitirQualquerChavePix = false;
    submitting;
    metodoPagamentoDesabilitado;


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
        private router: Router,
        private cd: ChangeDetectorRef,
        private el: ElementRef,
        private layoutService: LayoutService,
        private renderer: Renderer2
    ) {
        super();
    }

    ngOnInit() {
        if (window.innerWidth <= 1024) {
            this.isMobile = true;
        } else {
            this.sidebarService.changeItens({ contexto: 'cliente' });
            this.menuFooterService.setIsPagina(true);
        }

        this.getRollovers();

        this.paymentMethod = this.paramsLocais.getOpcoes().api_pagamentos;
        this.paymentMethodSelected = this.paymentMethod;
        this.metodoPagamentoDesabilitado = this.paramsLocais.getOpcoes().metodo_pagamento_desabilitado;
        this.permitirQualquerChavePix = this.paramsLocais.getOpcoes().permitir_qualquer_chave_pix;
        this.createForm();
        const user = JSON.parse(localStorage.getItem('user'));

        this.getSaques();

        this.auth.getPosicaoFinanceira()
            .subscribe(
                posicaoFinanceira => {
                    this.saldo = posicaoFinanceira.saldo;
                    if (posicaoFinanceira.saldo == 0) {
                        this.disableButton = true;
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

                    this.valorMinSaque = res.nivelCliente?.valor_min_saque ?? '-';
                    this.valorMaxSaqueDiario = res.nivelCliente?.valor_max_saque_dia ?? '-';
                    this.valorMaxSaqueMensal = res.nivelCliente?.valor_max_saque_mes ?? '-';

                    this.form.controls["valor"].setValidators([Validators.min(this.valorMinSaque), Validators.max(this.valorMaxSaqueDiario)]);

                    if (!this.cliente.endereco) {
                        this.cadastroCompleto = false;
                        this.rotaCompletarCadastro = '/clientes/perfil';
                        this.errorMessage = this.translate.instant('saques.preenchaCadastroCompleto');
                    }

                    this.onChavePixChange();
                    this.showLoading = false;
                },
                error => {
                    this.handleError(error);
                }
            );

        if (!this.isMobile) {
            this.layoutService.currentHeaderHeight
                .pipe(takeUntil(this.unsub$))
                .subscribe(curHeaderHeight => {
                    this.headerHeight = curHeaderHeight;
                    this.changeHeight();
                    this.cd.detectChanges();
                });
        }
    }

    changeHeight() {
        const headerHeight = this.headerHeight;
        const height = window.innerHeight - headerHeight;
        const defaultContent = this.el.nativeElement.querySelector('#default-content');
        this.renderer.setStyle(defaultContent, 'height', `${height}px`);
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            valor: [0, [Validators.required]],
            tipoChavePix: ['cpf', Validators.required],
            clienteChavePix: ['', Validators.required],
            paymentMethod: [this.paymentMethodSelected, Validators.required]
        });
    }

    changePaymentMethodOption(paymentMethod: string) {
        this.paymentMethodSelected = paymentMethod;
        this.form.get('paymentMethod').patchValue(paymentMethod);
    }

    changeAmount(amount) {
        this.form.patchValue({ 'valor': amount });
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
        this.modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
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
        if (this.pspsSaqueAutomatico.includes(depositoSaque.psp)) {
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

    changePixKey(key: string) {
        this.selectedKeyType = key;
        this.form.get('tipoChavePix').patchValue(key);
        this.onChavePixChange();
    }

    onChavePixChange() {
        const chavePixValue = this.form.get('tipoChavePix').value;
        const clienteChavePixControle = this.form.get('clienteChavePix');

        clienteChavePixControle.clearValidators();
        this.form.get('clienteChavePix').setValue('');

        clienteChavePixControle.markAsPristine();
        clienteChavePixControle.markAsUntouched();

        if (chavePixValue !== '0' && chavePixValue !== '') {
            clienteChavePixControle.setValidators([Validators.required]);
            switch (chavePixValue) {
                case 'cpf':
                    this.form.get('clienteChavePix').setValue(this.cliente.cpf);
                    break;
                case 'email':
                    clienteChavePixControle.setValidators([Validators.required, Validators.email]);
                    break;
            }
        }
        clienteChavePixControle.updateValueAndValidity();
    }

    getMask() {
        let tipoChavePix = this.form.get('tipoChavePix').value;
        let chaveComMascara = null;

        if (tipoChavePix === 'phone') {
            chaveComMascara = '(00) 00000-0000';
        } else if (tipoChavePix === 'random') {
            chaveComMascara = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA';
        }

        return chaveComMascara;
    }

    formatarChavePix(chavePix: string, tipoChavePix: string): string {
        let chavePixFormatada: any;
        switch (tipoChavePix) {
            case 'phone':
                chavePixFormatada = chavePix.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                break;
            case 'random':
                chavePixFormatada = chavePix.replace(/^(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})$/, "$1-$2-$3-$4-$5");
                break;
            case 'cpf':
                chavePixFormatada = chavePix.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                break;
            default:
                chavePixFormatada = chavePix;
                break;
        }
        return chavePixFormatada;
    }
}
