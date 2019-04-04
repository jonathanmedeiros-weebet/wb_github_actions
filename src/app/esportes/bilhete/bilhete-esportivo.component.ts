import { Component, OnInit, OnDestroy, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { ApostaSuccessModalComponent, ApostaModalComponent } from '../../shared/layout/modals';
import {
    ParametrosLocaisService, MessageService, BilheteEsportivoService,
    HelperService, ApostaEsportivaService, AuthService, PreApostaEsportivaService
} from '../../services';
import { ItemBilheteEsportivo } from '../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as clone from 'clone';

@Component({
    selector: 'app-bilhete-esportivo',
    templateUrl: 'bilhete-esportivo.component.html',
    styleUrls: ['bilhete-esportivo.component.css'],
})
export class BilheteEsportivoComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('apostaDeslogadoModal') apostaDeslogadoModal;
    modalRef;
    possibilidadeGanho = 0;
    opcoes = this.paramsService.getOpcoes();
    apostaMinima;
    displayPreTicker = false;
    disabled = false;
    isLoggedIn;
    btnText = 'Pré-Aposta';
    tipoApostaDeslogado = 'preaposta';
    cartaoApostaForm: FormGroup;
    unsub$ = new Subject();

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
        private helperService: HelperService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.definirAltura();
        this.isLoggedIn = this.auth.isLoggedIn();
        this.apostaMinima = this.opcoes.valor_min_aposta;

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
            apostador: ['', [Validators.required]],
            valor: [0, [Validators.required, Validators.min(this.apostaMinima)]],
            itens: this.fb.array([])
        });

        this.cartaoApostaForm = this.fb.group({
            chave: [null, Validators.required],
            pin: [null, Validators.compose([
                Validators.required,
                Validators.minLength(3),
            ])]
        });
    }

    definirValor(valor) {
        this.form.patchValue({ 'valor': valor });
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
        this.bilheteService.atualizarItens(this.itens.value);
    }

    calcularPossibilidadeGanho(valor) {
        let cotacao = 1;

        this.itens.value.forEach(item => {
            cotacao = cotacao * this.helperService.calcularCotacao(
                item.cotacao.valor,
                item.cotacao.chave,
                item.jogo._id,
                item.jogo.favorito,
                item.aoVivo
            );
        });

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

        if (this.itens.length) {
            if (this.isLoggedIn) {
                const values = clone(this.form.value);
                values.itens.map(item => {
                    delete item.jogo;
                });

                this.salvarAposta(values);
            } else {
                this.enableSubmit();

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
                            console.log('result');
                            console.log(result);
                        },
                        reason => {
                            console.log('reason');
                            console.log(reason);
                        }
                    );
            }
        } else {
            this.enableSubmit();
            this.messageService.warning('Por favor, inclua um jogo.');
        }
    }

    apostaSuccess(aposta) {
        if (this.modalRef) {
            this.modalRef.close();
        }
        this.enableSubmit();
        this.trocarTipoApostaDeslogado('preaposta');

        this.bilheteService.atualizarItens([]);
        this.form.reset();

        this.modalRef = this.modalService.open(ApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.aposta = aposta;
    }

    preApostaSuccess(id) {
        if (this.modalRef) {
            this.modalRef.close();
        }
        this.enableSubmit();

        this.bilheteService.atualizarItens([]);
        this.form.reset();

        this.modalRef = this.modalService.open(ApostaSuccessModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.codigo = id;
        this.modalRef.componentInstance.aposta = null;
    }

    handleError(msg) {
        this.enableSubmit();
        this.messageService.error(msg);
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
        const values = clone(this.form.value);
        values.itens.map(item => {
            delete item.jogo;
        });

        if (this.tipoApostaDeslogado === 'preaposta') {
            this.preApostaService.create(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    result => this.preApostaSuccess(result.id),
                    error => this.handleError(error)
                );
        } else {
            if (this.cartaoApostaForm.valid) {
                const valuesCard = { cartao: this.cartaoApostaForm.value };
                const finalValues = Object.assign(values, valuesCard);

                this.salvarAposta(finalValues);
            }
        }
    }
}
