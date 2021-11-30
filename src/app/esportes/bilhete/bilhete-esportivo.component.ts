import {Component, OnInit, OnDestroy, Renderer2, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormArray, Validators, FormGroup} from '@angular/forms';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {PreApostaModalComponent, ApostaModalComponent} from '../../shared/layout/modals';
import {
    ParametrosLocaisService, MessageService, BilheteEsportivoService,
    HelperService, ApostaEsportivaService, AuthService, PreApostaEsportivaService, MenuFooterService
} from '../../services';
import {ItemBilheteEsportivo} from '../../models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as clone from 'clone';
import {result} from 'lodash';

@Component({
    selector: 'app-bilhete-esportivo',
    templateUrl: 'bilhete-esportivo.component.html',
    styleUrls: ['bilhete-esportivo.component.css'],
})
export class BilheteEsportivoComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('apostaDeslogadoModal', {static: false}) apostaDeslogadoModal;
    mudancas = false;
    modalRef;
    possibilidadeGanho = 0;
    opcoes;
    apostaMinima;
    apostaMaximo;
    displayPreTicker = false;
    disabled = false;
    isLoggedIn;
    btnText = 'Pré-Aposta';
    tipoApostaDeslogado = 'preaposta';
    cartaoApostaForm: FormGroup;
    apostaAoVivo = false;
    delay = 20;
    cotacoesAlteradas = [];
    refreshIntervalId;
    unsub$ = new Subject();
    isCliente;

    constructor(
        private apostaEsportivaService: ApostaEsportivaService,
        private preApostaService: PreApostaEsportivaService,
        private auth: AuthService,
        private bilheteService: BilheteEsportivoService,
        private messageService: MessageService,
        private renderer: Renderer2,
        private el: ElementRef,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService,
        private menuFooterService: MenuFooterService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.definirAltura();
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
        this.apostaMaximo = this.opcoes.valor_max_aposta;
        this.setDelay();

        this.mudancas = (localStorage.getItem('mudancas') === 'true');

        const itens = this.bilheteService.getItens();
        if (itens) {
            this.bilheteService.atualizarItens(itens);
        }

        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(result => {
                this.setItens(result);
                this.calcularPossibilidadeGanho(this.form.value.valor);
            });

        this.form.get('valor').valueChanges
            .pipe(takeUntil(this.unsub$))
            .subscribe(valor => {
                this.calcularPossibilidadeGanho(valor);
            });

        this.bilheteService.openBilhete
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                res => this.displayPreTicker = res
            );
    }

    definirAltura() {
        const altura = window.innerHeight - 69;
        const preBilheteEl = this.el.nativeElement.querySelector('.pre-bilhete');
        this.renderer.setStyle(preBilheteEl, 'height', `${altura}px`);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            apostador: ['', (this.isCliente) ? '' : [Validators.required]],
            valor: [0, [Validators.required, Validators.min(this.apostaMinima), Validators.max(this.apostaMaximo)]],
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

    definirValor(valor) {
        this.form.patchValue({'valor': valor});
    }

    get itens() {
        return this.form.get('itens') as FormArray;
    }

    setItens(itens: ItemBilheteEsportivo[]) {
        const controls = itens.map(item => this.fb.control(item));
        const formArray = this.fb.array(controls);
        this.form.setControl('itens', formArray);
    }

    removerItem(index) {
        this.itens.removeAt(index);

        if (this.itens.length === 0) {
            this.aceitarMudancas();
        }

        this.bilheteService.atualizarItens(this.itens.value);
    }

    calcularPossibilidadeGanho(valor) {
        let cotacao = 1;
        let aovivo = false;


        this.itens.value.forEach(item => {
            if (item.ao_vivo) {
                aovivo = true;
            }

            cotacao = cotacao * this.helperService.calcularCotacao(
                item.cotacao.valor,
                item.cotacao.chave,
                item.jogo.event_id,
                item.jogo.favorito,
                item.ao_vivo
            );
        });

        this.apostaAoVivo = aovivo;

        // Fator Máximo
        if (cotacao > this.opcoes.fator_max) {
            cotacao = this.opcoes.fator_max;
        }

        // Valor Máximo de Prêmio
        const premio = valor * cotacao;
        this.possibilidadeGanho = premio < this.opcoes.valor_max_premio ? premio : this.opcoes.valor_max_premio;
    }

    submit() {
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
                const values = this.ajustarDadosParaEnvio();
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
        this.stopDelayInterval();

        if (this.isCliente) {
            this.form.patchValue({'apostador': 'cliente'});
        }

        this.modalRef = this.modalService.open(ApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.aposta = aposta;
        this.modalRef.componentInstance.primeiraImpressao = true;
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
    }

    handleError(error) {
        this.enableSubmit();
        this.stopDelayInterval();

        if (typeof error === 'string') {
            this.messageService.error(error);
        } else {
            if (error.code === 17) {
                error.data.forEach(item => {
                    this.itens.value.forEach(i => {
                        if (item.jogo_event_id == i.jogo_event_id) {
                            i.cotacao_antiga_valor = i.cotacao.valor;
                            i.cotacao.valor = item.valor;
                            i.mudanca = true;
                        }
                    });
                });

                localStorage.setItem('mudancas', 'true');
                this.bilheteService.atualizarItens(this.itens.value);
                this.calcularPossibilidadeGanho(this.form.value.valor);
                this.mudancas = true;
            }
        }
    }

    openCupom() {
        // this.displayPreTicker = true;
        this.bilheteService.toggleBilhete();
    }

    closeCupom() {
        // this.displayPreTicker = false;
        this.bilheteService.toggleBilhete();
    }

    disabledSubmit() {
        this.disabled = true;
    }

    enableSubmit() {
        this.disabled = false;
    }

    salvarAposta(dados) {
        if (this.apostaAoVivo) {
            this.setDelay();

            this.refreshIntervalId = setInterval(() => {
                if (this.delay > 0) {
                    this.delay--;
                }
            }, 1000);
        }

        this.apostaEsportivaService.create(dados)
            .pipe(takeUntil(this.unsub$))
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

        const values = this.ajustarDadosParaEnvio();

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

    stopDelayInterval() {
        clearInterval(this.refreshIntervalId);
    }

    setDelay() {
        this.delay = this.opcoes.delay_aposta_aovivo ? this.opcoes.delay_aposta_aovivo : 20;
    }

    aceitarMudancas() {
        localStorage.setItem('mudancas', 'false');
        this.mudancas = false;
    }

    ajustarDadosParaEnvio() {
        const cotacoesLocais = this.paramsService.getCotacoesLocais();
        const values = clone(this.form.value);
        values.itens.map(item => {
            // Cotacação Local
            if (cotacoesLocais[item.jogo_event_id] && cotacoesLocais[item.jogo_event_id][item.cotacao.chave]) {
                item.cotacao.valor = parseFloat(cotacoesLocais[item.jogo_event_id][item.cotacao.chave].valor);
            }

            delete item.jogo;
        });

        return values;
    }
}
