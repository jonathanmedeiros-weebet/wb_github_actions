import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { PreApostaModalComponent, ApostaModalComponent } from '../../shared/layout/modals';
import {
    ParametrosLocaisService, MessageService, AuthService, DesafioBilheteService,
    DesafioApostaService, DesafioPreApostaService
} from '../../services';
import { } from '../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as clone from 'clone';

@Component({
    selector: 'app-desafios-bilhete',
    templateUrl: './desafios-bilhete.component.html',
    styleUrls: ['./desafios-bilhete.component.css']
})
export class DesafiosBilheteComponent extends BaseFormComponent implements OnInit {
    @ViewChild('apostaDeslogadoModal', { static: false }) apostaDeslogadoModal;
    modalRef;
    possibilidadeGanho = 0;
    opcoes;
    apostaMinima;
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
    isCambista;

    constructor(
        private apostaService: DesafioApostaService,
        private preApostaService: DesafioPreApostaService,
        private auth: AuthService,
        private messageService: MessageService,
        private renderer: Renderer2,
        private el: ElementRef,
        private fb: FormBuilder,
        private bilheteService: DesafioBilheteService,
        private paramsService: ParametrosLocaisService,
        private modalService: NgbModal
    ) {
        super();
    }

    ngOnInit() {
        this.isLoggedIn = this.auth.isLoggedIn();
        this.opcoes = this.paramsService.getOpcoes();
        this.apostaMinima = this.opcoes.valor_min_aposta;
        this.isCambista = this.auth.isCambista();

        this.createForm();
        this.definirAltura();
        this.subcribeItens();
        this.subscribeValor();
    }

    definirAltura() {
        const altura = window.innerHeight - 69;
        const preBilheteEl = this.el.nativeElement.querySelector('.pre-bilhete');
        this.renderer.setStyle(preBilheteEl, 'height', `${altura}px`);
    }

    createForm() {
        this.form = this.fb.group({
            apostador: ['', (this.isCambista || !this.isLoggedIn) ? [Validators.required] : ''],
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
        this.form.patchValue({ 'valor': valor });
    }

    get itens() {
        return this.form.get('itens') as FormArray;
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

    calcularPossibilidadeGanho(valor) {
        let cotacao = 1;

        this.itens.value.forEach(item => {
            cotacao *= item.odd.cotacao;
        });

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
                        result => { },
                        reason => { }
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
        this.messageService.error(error);
    }

    openCupom() {
        this.displayPreTicker = true;
    }

    closeCupom() {
        this.displayPreTicker = false;
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

                const dados = Object.assign(values, { cartao: cartaoValues });
                this.salvarAposta(dados);
            } else {
                this.enableSubmit();
            }
        }
    }
}
