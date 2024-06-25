import { Component, OnDestroy, OnInit, ChangeDetectorRef, ElementRef, Renderer2, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ClienteService } from '../../shared/services/clientes/cliente.service';
import { Cliente } from '../../shared/models/clientes/cliente';
import { MessageService } from '../../shared/services/utils/message.service';
import { FinanceiroService } from '../../shared/services/financeiro.service';
import { MenuFooterService } from '../../shared/services/utils/menu-footer.service';
import { ParametrosLocaisService } from '../../shared/services/parametros-locais.service';
import { AuthService, LayoutService, SidebarService } from 'src/app/services';
import { LegitimuzService } from '../../shared/services/legitimuz.service';
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
export class SolicitacaoSaqueClienteComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;

    unsub$ = new Subject();
    unsubLegitimuz$ = new Subject();
    cliente: Cliente;
    modalRef;

    pspsSaqueAutomatico = ['SAUTOPAY', 'PRIMEPAG', 'PAGFAST', 'BIGPAG', 'LETMEPAY', 'PAAG', 'PAY2M'];
    respostaSolicitacao;

    rotaCompletarCadastro: string;
    labelChavePix = '';
    availablePaymentMethods;
    paymentMethodSelected = '';
    errorMessage;
    selectedKeyType = 'cpf';
    currentLanguage = 'pt';
    token = '';

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
    legitimuzEnabled = false;
    legitimuzToken = "";
    verifiedIdentity = false;
    disapprovedIdentity = false;

    public valuesShortcuts: number[] = [10, 20, 50, 75, 100, 200];

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
        private renderer: Renderer2,
        private legitimuzService: LegitimuzService
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

        this.currentLanguage = this.translate.currentLang;

        this.legitimuzToken = this.paramsLocais.getOpcoes().legitimuz_token;
        this.legitimuzEnabled = Boolean(this.paramsLocais.getOpcoes().legitimuz_enabled && this.legitimuzToken);

        if (this.legitimuzEnabled) {
            this.token = this.auth.getToken();
        }

        this.translate.onLangChange.subscribe(change => {
            this.currentLanguage = change.lang;
            if (this.legitimuzEnabled) {
                this.legitimuzService.changeLang(change.lang);
            }
        });

        this.availablePaymentMethods = this.paramsLocais.getOpcoes().available_payment_methods;
        this.paymentMethodSelected = this.availablePaymentMethods[0];
        this.permitirQualquerChavePix = this.paramsLocais.getOpcoes().permitir_qualquer_chave_pix;
        this.createForm();
        const user = JSON.parse(localStorage.getItem('user'));

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

                    this.verifiedIdentity = res.verifiedIdentity;
                    this.disapprovedIdentity = typeof this.verifiedIdentity === 'boolean' && !this.verifiedIdentity;

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

        if (this.legitimuzEnabled && !this.disapprovedIdentity) {
            this.legitimuzService.curCustomerIsVerified
                .pipe(takeUntil(this.unsub$))
                .subscribe(curCustomerIsVerified => {
                    this.verifiedIdentity = curCustomerIsVerified;
                    this.cd.detectChanges();
                    if (this.verifiedIdentity) {
                        this.legitimuzService.closeModal();
                        this.messageService.success('Identidade verificada!');
                    }
                });
        }
    }

    ngAfterViewInit() {
        if (this.legitimuzEnabled && !this.disapprovedIdentity) {
            this.legitimuz.changes
                .pipe(takeUntil(this.unsubLegitimuz$))
                .subscribe(() => {
                    this.legitimuzService.init();
                    this.legitimuzService.mount();

                    this.unsubLegitimuz$.next();
                    this.unsubLegitimuz$.complete();
                });
        }
    }

    closeAlert(id) {
        this.el.nativeElement.querySelector(`#${id}`).remove();
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
        let paymentMethodToForm = Boolean(this.availablePaymentMethods.length) ? [this.paymentMethodSelected, Validators.required] : [null];

        this.form = this.fb.group({
            valor: [0, [Validators.required]],
            tipoChavePix: ['cpf', Validators.required],
            clienteChavePix: ['', Validators.required],
            paymentMethod: paymentMethodToForm
        });
    }

    changePaymentMethodOption(paymentMethod: string) {
        this.paymentMethodSelected = paymentMethod;
        this.form.get('paymentMethod').patchValue(paymentMethod);
    }

    changeAmount(amount) {
        const newAmount = this.form.value.valor + amount;
        this.form.patchValue({ 'valor': newAmount});
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
}
