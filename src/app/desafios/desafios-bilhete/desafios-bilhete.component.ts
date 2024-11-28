import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {ApostaModalComponent, LoginModalComponent, PreApostaModalComponent} from '../../shared/layout/modals';
import {
    AuthService,
    DesafioApostaService,
    DesafioBilheteService,
    DesafioPreApostaService, LayoutService, MenuFooterService,
    MessageService,
    ParametrosLocaisService
} from '../../services';
import * as clone from 'clone';

@Component({
    selector: 'app-desafios-bilhete',
    templateUrl: './desafios-bilhete.component.html',
    styleUrls: ['./desafios-bilhete.component.css']
})
export class DesafiosBilheteComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('apostaDeslogadoModal', {static: false}) apostaDeslogadoModal;
    modalRef;
    possibilidadeGanho = 0;
    opcoes;
    apostaMinima;
    displayPreTicker = false;
    disabled = false;
    isLoggedIn;
    btnText = 'Pré-Aposta';
    tipoApostaDeslogado = 'preaposta';
    cartaoApostaForm: UntypedFormGroup;
    cotacoesAlteradas = [];
    refreshIntervalId;
    unsub$ = new Subject();
    isCliente;
    valorFocado = false;
    modoCambista = false;
    mobileScreen;
    headerHeight = 92;

    constructor(
        private apostaService: DesafioApostaService,
        private preApostaService: DesafioPreApostaService,
        private auth: AuthService,
        private messageService: MessageService,
        private renderer: Renderer2,
        private el: ElementRef,
        private fb: UntypedFormBuilder,
        private bilheteService: DesafioBilheteService,
        private paramsService: ParametrosLocaisService,
        private modalService: NgbModal,
        private menuFooterService: MenuFooterService,
        private layoutService: LayoutService,
        private cd: ChangeDetectorRef
    ) {
        super();
    }

    ngOnInit() {
        this.modoCambista = this.paramsService.getOpcoes().modo_cambista;
        this.mobileScreen = window.innerWidth <=1024;
        this.createForm();
        this.auth.logado
            .subscribe(
                isLoggedIn => {
                    this.isLoggedIn = isLoggedIn;
                    if (isLoggedIn) {
                        this.auth.cliente
                            .subscribe(
                                isCliente => {
                                    this.isCliente = isCliente;
                                    if (isCliente && this.isLoggedIn) {
                                        this.form.patchValue({apostador: 'cliente'});
                                    }
                                }
                            );
                    }
                }
            );
        this.opcoes = this.paramsService.getOpcoes();
        this.apostaMinima = this.opcoes.valor_min_aposta;

        this.subcribeItens();
        this.subscribeValor();
        this.menuFooterService.setOutraModalidade(true);

        this.menuFooterService.toggleBilheteStatus
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                res => this.displayPreTicker = res
            );

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.definirAltura();
                this.cd.detectChanges();
            });
    }

    ngOnDestroy() {
        this.menuFooterService.setOutraModalidade(false);
        this.unsub$.next();
        this.unsub$.complete();
    }

    definirAltura() {
        const altura = window.innerHeight - this.headerHeight;
        const preBilheteEl = this.el.nativeElement.querySelector('.pre-bilhete');
        this.renderer.setStyle(preBilheteEl, 'height', `${altura}px`);
    }

    createForm() {
        this.form = this.fb.group({
            apostador: ['', (this.isCliente || !this.modoCambista) ? '' : [Validators.required]],
            valor: [0, [Validators.required, Validators.min(this.apostaMinima)]],
            itens: this.fb.array([])
        });

        this.cartaoApostaForm = this.fb.group({
            chave: [null, Validators.required],
            pin: [null, Validators.compose([
                Validators.required,
                Validators.minLength(3),
            ])],
            manter_cartao: [null]
        });
    }

    subcribeItens() {
        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(result => {
                this.setItens(result);
                this.calcularPossibilidadeGanho(this.form.value.valor);
            });
    }

    subscribeValor() {
        this.form.get('valor').valueChanges
            .pipe(takeUntil(this.unsub$))
            .subscribe(valor => {
                this.calcularPossibilidadeGanho(valor);
            });
    }

    definirValor(valor) {
        this.form.patchValue({'valor': valor});
    }

    get itens() {
        return this.form.get('itens') as UntypedFormArray;
    }

    setItens(itens: any[]) {
        const controls = itens.map(item => this.fb.control(item));
        const formArray = this.fb.array(controls);
        this.form.setControl('itens', formArray);
    }

    removerItem(index) {
        this.itens.removeAt(index);
        this.bilheteService.atualizarItens(this.itens.value);
    }

    removerItens() {
        this.itens.clear();
        this.bilheteService.atualizarItens(this.itens.value);
    }

    setFocoValor(focus: boolean) {
        this.valorFocado = focus;
    }

    calcularPossibilidadeGanho(valor) {
        let cotacao = 1;

        this.itens.value.forEach(item => {
            cotacao *= item.odd.cotacao;
        });

        const premio = valor * cotacao;
        this.possibilidadeGanho = premio < this.opcoes.valor_max_premio_desafio ? premio : this.opcoes.valor_max_premio_desafio;
    }

    submit() {
        if (!this.isCliente && !this.modoCambista) {
            this.abrirLogin();
        } else {
            this.disabledSubmit();

            let valido = true;
            let msg = '';

            if (!this.itens.length) {
                valido = false;
                msg = 'Por favor, inclua um evento.';
            }

            if (this.itens.length < this.paramsService.quantidadeMinEventosBilhete()) {
                valido = false;
                msg = `Por favor, inclua no MÍNIMO ${this.paramsService.quantidadeMinEventosBilhete()} evento(s).`;
            }

            if (this.itens.length > this.paramsService.quantidadeMaxEventosBilhete()) {
                valido = false;
                msg = `Por favor, inclua no MÁXIMO ${this.paramsService.quantidadeMaxEventosBilhete()} eventos.`;
            }

            if (valido) {
                if (this.isLoggedIn) {
                    const values = clone(this.form.value);
                    values.itens.map(item => {
                        delete item.desafio;
                        delete item.odd;
                    });

                    this.salvarAposta(values);
                } else {
                    this.enableSubmit();

                    const cartaoChave = localStorage.getItem('cartao_chave');
                    if (cartaoChave) {
                        this.cartaoApostaForm.patchValue({
                            chave: cartaoChave,
                            manter_cartao: true
                        });
                    }

                    this.modalRef = this.modalService.open(
                        this.apostaDeslogadoModal,
                        {
                            ariaLabelledBy: 'modal-basic-title',
                            centered: true
                        }
                    );

                    this.modalRef.result
                        .then(
                            result => {
                            },
                            reason => {
                            }
                        );
                }
            } else {
                this.enableSubmit();
                this.messageService.warning(msg);
            }
        }
    }

    apostaSuccess(aposta) {
        if (this.modalRef) {
            this.modalRef.close();
        }
        this.closeCupom();
        this.enableSubmit();
        this.trocarTipoApostaDeslogado('preaposta');

        this.bilheteService.atualizarItens([]);
        this.form.reset();
        this.cartaoApostaForm.reset();

        if (this.isCliente) {
            this.form.patchValue({'apostador': 'cliente'});
        }

        this.modalRef = this.modalService.open(ApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.aposta = aposta;
        this.modalRef.componentInstance.primeiraImpressao = true;
        this.menuFooterService.atualizarQuantidade(0);
    }

    preApostaSuccess(id) {
        if (this.modalRef) {
            this.modalRef.close();
        }
        this.closeCupom();
        this.enableSubmit();

        this.bilheteService.atualizarItens([]);
        this.form.reset();
        this.cartaoApostaForm.reset();

        this.modalRef = this.modalService.open(PreApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.codigo = id;
        this.menuFooterService.atualizarQuantidade(0);
    }

    handleError(error) {
        this.enableSubmit();
        this.messageService.error(error);
    }

    openCupom() {
        this.menuFooterService.toggleBilhete(true);
    }

    closeCupom() {
        this.menuFooterService.toggleBilhete(false);
    }

    disabledSubmit() {
        this.disabled = true;
    }

    enableSubmit() {
        this.disabled = false;
    }

    salvarAposta(dados) {
        this.apostaService.create(dados)
            .subscribe(
                result => this.apostaSuccess(result),
                error => this.handleError(error)
            );
    }

    trocarTipoApostaDeslogado(tipo) {
        this.tipoApostaDeslogado = tipo;
        if (tipo === 'preaposta') {
            this.btnText = 'Pré-Aposta';
        } else {
            this.btnText = 'Aposta';
        }
    }

    finalizarApostaDeslogado() {
        this.disabledSubmit();

        const values = clone(this.form.value);
        values.itens.map(item => {
            delete item.desafio;
            delete item.odd;
        });

        if (this.tipoApostaDeslogado === 'preaposta') {
            this.preApostaService.create(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    result => this.preApostaSuccess(result.codigo),
                    error => this.handleError(error)
                );
        } else {
            if (this.cartaoApostaForm.valid) {
                const cartaoValues = this.cartaoApostaForm.value;

                if (cartaoValues.manter_cartao) {
                    localStorage.setItem('cartao_chave', cartaoValues.chave);
                } else {
                    localStorage.removeItem('cartao_chave');
                }

                delete cartaoValues.manter_cartao;

                const dados = Object.assign(values, {cartao: cartaoValues});
                this.salvarAposta(dados);
            } else {
                this.enableSubmit();
            }
        }
    }

    abrirLogin() {
        const options = {
            ariaLabelledBy: 'modal-basic-title',
            windowClass: 'modal-550 modal-h-350 modal-login',
            centered: true,
        };

        this.modalRef = this.modalService.open(
            LoginModalComponent, options
        );
    }
}
