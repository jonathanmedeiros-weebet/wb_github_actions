import { LegitimuzFacialService } from './../../shared/services/legitimuz-facial.service';
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
import { FaceMatchService } from 'src/app/shared/services/face-match.service';
import { Ga4Service, EventGa4Types} from 'src/app/shared/services/ga4/ga4.service';
import { DocCheckService } from 'src/app/shared/services/doc-check.service';

@Component({
    selector: 'app-solicitacao-saque-cliente',
    templateUrl: './solicitacao-saque-cliente.component.html',
    styleUrls: ['./solicitacao-saque-cliente.component.css']
})
export class SolicitacaoSaqueClienteComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;
    @ViewChildren('legitimuzLiveness') private legitimuzLiveness: QueryList<ElementRef>;

    unsub$ = new Subject();
    cliente: Cliente;
    modalRef;

    pspsSaqueAutomatico = ['SAUTOPAY', 'PRIMEPAG', 'PAGFAST', 'BIGPAG', 'LETMEPAY', 'PAAG', 'PAY2M', 'OKTO', 'PIXS', 'BIGPAGV3'];
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
    faceMatchEnabled = false;
    faceMatchFirstWithdrawValidated = false;
    faceMatchType = null;
    legitimuzToken = "";
    docCheckToken = "";
    secretHash = ""
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
        private legitimuzService: LegitimuzService,
        private ga4Service: Ga4Service,
        private LegitimuzFacialService : LegitimuzFacialService,
        private faceMatchService : FaceMatchService,
        private docCheck: DocCheckService
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

        this.faceMatchType = this.paramsLocais.getOpcoes().faceMatchType;

        this.getRollovers();

        this.currentLanguage = this.translate.currentLang;

        this.legitimuzToken = this.paramsLocais.getOpcoes().legitimuz_token;
        switch(this.faceMatchType) {
            case 'legitimuz':
                this.legitimuzToken = this.paramsLocais.getOpcoes().legitimuz_token;
                this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.legitimuzToken && this.paramsLocais.getOpcoes().faceMatchChangePassword);
                break;
            case 'docCheck':
                this.docCheckToken = this.paramsLocais.getOpcoes().dockCheck_token;
                this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.docCheckToken && this.paramsLocais.getOpcoes().faceMatchChangePassword);
                this.docCheck.iframeMessage$.subscribe(message => {
                    console.log(message)
                })
                break;
            default:
                break;            
        }  
        if (!this.faceMatchEnabled) {
            this.faceMatchFirstWithdrawValidated = true;
        } else {
            this.token = this.auth.getToken();
        }

        this.translate.onLangChange.subscribe(change => {
            this.currentLanguage = change.lang;
            if (this.faceMatchEnabled) {
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
                    this.saldo = posicaoFinanceira.saldo - posicaoFinanceira.saldoBloqueado;
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
            .subscribe({
                next: (res) => {
                    this.cliente = res;

                    this.verifiedIdentity = res.verifiedIdentity;
                    this.disapprovedIdentity = typeof this.verifiedIdentity === 'boolean' && !this.verifiedIdentity;
                    this.secretHash = this.docCheck.hmacHash(this.cliente.cpf, this.paramsLocais.getOpcoes().dockCheck_secret_hash)
                    this.cd.detectChanges();

                    this.valorMinSaque = res.nivelCliente?.valor_min_saque ?? '-';
                    this.valorMaxSaqueDiario = res.nivelCliente?.valor_max_saque_dia ?? '-';
                    this.valorMaxSaqueMensal = res.nivelCliente?.valor_max_saque_mes ?? '-';

                    this.form.controls["valor"].setValidators([Validators.min(this.valorMinSaque), Validators.max(this.valorMaxSaqueDiario)]);

                    this.checkOktoTermsAcceptance(res.accepted_okto_terms);

                    if (!this.cliente.endereco) {
                        this.cadastroCompleto = false;
                        this.rotaCompletarCadastro = '/clientes/perfil';
                        this.errorMessage = this.translate.instant('saques.preenchaCadastroCompleto');
                    }
                    if (this.faceMatchEnabled) {
                        this.faceMatchService.getFaceMatch({ document: this.cliente.cpf }).subscribe({
                            next: (res) => {
                                if (res.first_withdraw != null && this.cliente.verifiedIdentity) {
                                    this.faceMatchFirstWithdrawValidated = true;
                                }
                            }, error: (error) => {}
                        })
                    }

                    this.onChavePixChange();
                    this.showLoading = false;
                },
                error: (error) => {
                    this.handleError(error);
                }
            });

        if (!this.isMobile) {
            this.layoutService.currentHeaderHeight
                .pipe(takeUntil(this.unsub$))
                .subscribe(curHeaderHeight => {
                    this.headerHeight = curHeaderHeight;
                    this.changeHeight();
                    this.cd.detectChanges();
                });
        }

        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            this.legitimuzService.curCustomerIsVerified
                .pipe(takeUntil(this.unsub$))
                .subscribe(curCustomerIsVerified => {
                    this.verifiedIdentity = curCustomerIsVerified;
                    this.cd.detectChanges();
                    if (this.verifiedIdentity) {
                        this.legitimuzService.closeModal();
                        this.messageService.success(this.translate.instant('face_match.verified_identity'));
                        this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, first_withdraw: true }).subscribe()
                        this.faceMatchFirstWithdrawValidated = true;
                    } else {
                        this.legitimuzService.closeModal();
                        this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                        this.faceMatchFirstWithdrawValidated = false;
                    }
                });
            this.LegitimuzFacialService.faceIndex
                .pipe(takeUntil(this.unsub$))
                .subscribe(faceIndex => {
                    if (faceIndex) {
                        this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, first_withdraw: true }).subscribe({
                            next: (res) => {
                                this.LegitimuzFacialService.closeModal();
                                this.messageService.success(this.translate.instant('face_match.verified_identity'));
                                this.faceMatchFirstWithdrawValidated = true;
                            }, error: (error) => {
                                this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                                this.faceMatchFirstWithdrawValidated = false;
                            }
                        })
                    }
                })
        }
    }

    ngAfterViewInit() {
        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            if (this.faceMatchType == 'legitimuz') {
                this.legitimuz.changes
                    .subscribe(() => {
                        this.legitimuzService.init();
                        this.legitimuzService.mount();
                    });
                this.legitimuzLiveness.changes
                    .subscribe(() => {
                        this.LegitimuzFacialService.init();
                        this.LegitimuzFacialService.mount();
                    });
            }
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

                    this.ga4Service.triggerGa4Event(
                        EventGa4Types.GENERATE_SAQUE,
                        {
                            username: this.cliente.nome +' '+ this.cliente.sobrenome
                        }
                    );
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

    checkOktoTermsAcceptance(acceptedOktoTerms = false) {
        if (this.availablePaymentMethods.includes('okto') && !acceptedOktoTerms) {
            this.modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
            this.modalRef.componentInstance.title = 'Termos de uso Okto';
            this.modalRef.componentInstance.msg = 'Para continuar com as movimentações financeiras, é necessário aceitar os termos de uso da instituição financeira Okto. Caso não aceite, não será possível prosseguir. Deseja aceitar os termos?';

            this.modalRef.result.then(
                (result) => {
                    this.financeiroService.acceptOktoTerms().subscribe(
                        res =>{
                            this.messageService.success('Você aceitou os termos de uso. Agora, você pode realizar movimentações financeiras.');
                        },
                        error => {
                            this.messageService.warning('Algo não saiu muito bem. Tente novamente mais tarde.');
                            this.router.navigate(['/']);
                        }
                    )
                },
                (reason) => {
                    this.messageService.warning('Você não aceitou os termos de uso. Você será redirecionado para a página inicial.');
                    this.router.navigate(['/']);
                }
            );
        }
    }
}
