import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { ApostaModalComponent, PreApostaModalComponent } from '../../shared/layout/modals';
import {
    TipoApostaLoteriaService, MessageService,
    SorteioService, ApostaLoteriaService,
    SidebarService, SupresinhaService,
    AuthService, PreApostaLoteriaService,
    ParametrosLocaisService
} from '../../services';
import { TipoAposta, Aposta, Sorteio } from '../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as range from 'lodash.range';

@Component({
    selector: 'app-seninha',
    templateUrl: 'seninha.component.html'
})
export class SeninhaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    numbers = range(1, 61);
    qtdNumerosLista = [];
    qtdNumeros = 100;
    tiposAposta: TipoAposta[] = [];
    sorteios: Sorteio[] = [];
    tipoAposta: TipoAposta;
    aposta = new Aposta();
    opcoes;
    displayPreTicker = false;
    disabled = false;
    isLoggedIn = false;
    modalRef;
    unsub$ = new Subject();

    constructor(
        private sidebarService: SidebarService,
        private auth: AuthService,
        private apostaService: ApostaLoteriaService,
        private preApostaService: PreApostaLoteriaService,
        private tipoApostaService: TipoApostaLoteriaService,
        private sorteioService: SorteioService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private supresinhaService: SupresinhaService,
        private renderer: Renderer2,
        private el: ElementRef,
        private modalService: NgbModal,
        private paramsService: ParametrosLocaisService
    ) {
        super();
    }

    ngOnInit() {
        const queryParams = { tipo: 'seninha' };

        this.isLoggedIn = this.auth.isLoggedIn();
        this.opcoes = this.paramsService.getOpcoes();
        this.createForm();
        this.definirAltura();

        this.tipoApostaService.getTiposAposta(queryParams).subscribe(
            tiposAposta => {
                this.tiposAposta = tiposAposta;
                this.tiposAposta.forEach(tipoAposta => {
                    if (tipoAposta.qtdNumeros < this.qtdNumeros) {
                        this.qtdNumeros = tipoAposta.qtdNumeros;
                    }
                    this.qtdNumerosLista.push(tipoAposta.qtdNumeros);
                });
                this.sidebarService.changeItens(tiposAposta, 'seninha');
            },
            error => this.messageService.error(error)
        );

        this.sorteioService.getSorteios(queryParams).subscribe(
            sorteios => this.sorteios = sorteios,
            error => this.messageService.error(error)
        );

        // Escutando surpresinha vinda do NavigationComponent
        this.supresinhaService.atualizarSupresinha([]);

        this.supresinhaService.numeros.subscribe(numeros => {
            if (numeros.length) {
                this.qtdNumeros = numeros.length;
            }

            this.tiposAposta.forEach(tipoAposta => {
                if (tipoAposta.qtdNumeros === numeros.length) {
                    this.tipoAposta = tipoAposta;
                }
            });

            this.setNumeros(numeros);
        });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    definirAltura() {
        const altura = window.innerHeight - 69;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-sticky');
        const contentLoteriaEl = this.el.nativeElement.querySelector('.content-loteria');
        const preBilheteEl = this.el.nativeElement.querySelector('.pre-bilhete');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura - 60}px`);
        this.renderer.setStyle(contentLoteriaEl, 'height', `${altura}px`);
        this.renderer.setStyle(preBilheteEl, 'height', `${altura}px`);
    }

    createForm() {
        this.form = this.fb.group({
            valor: ['', Validators.compose([
                Validators.required,
                Validators.min(this.opcoes.valor_min_aposta_loterias)
            ])],
            sorteio: [null, Validators.required],
            numeros: this.fb.array([])
        });
    }

    /* Incluir palpite */
    submit() {
        const tipoAPosta = this.tiposAposta.find(tipoAposta => tipoAposta.qtdNumeros === this.numeros.length);

        if (tipoAPosta) {
            const item = this.form.value;
            item.sorteio_id = this.form.value.sorteio.id;
            if ((item.valor * this.tipoAposta.cotacao6) < this.opcoes.valor_max_premio_loterias) {
                item.premio6 = item.valor * this.tipoAposta.cotacao6;
            } else {
                item.premio6 = this.opcoes.valor_max_premio_loterias;
            }
            if ((item.valor * this.tipoAposta.cotacao5) < this.opcoes.valor_max_premio_loterias) {
                item.premio5 = item.valor * this.tipoAposta.cotacao5;
            } else {
                item.premio5 = this.opcoes.valor_max_premio_loterias;
            }
            if ((item.valor * this.tipoAposta.cotacao4) < this.opcoes.valor_max_premio_loterias) {
                item.premio4 = item.valor * this.tipoAposta.cotacao4;
            } else {
                item.premio4 = this.opcoes.valor_max_premio_loterias;
            }
            if ((item.valor * this.tipoAposta.cotacao3) < this.opcoes.valor_max_premio_loterias) {
                item.premio3 = item.valor * this.tipoAposta.cotacao3;
            } else {
                item.premio3 = this.opcoes.valor_max_premio_loterias;
            }
            this.aposta.itens.push(item);

            this.aposta.valor += item.valor;
            this.aposta.premio += item.premio6;

            this.form.reset();
            this.setNumeros([]);
        } else {
            this.messageService.warning('Quantidade de dezenas insuficiente.');
        }
    }

    /* Remover palpite */
    removeGuess(index) {
        this.aposta.itens.splice(index, 1);
    }

    /* Finalizar aposta */
    create() {
        this.disabledSubmit();

        if (this.aposta.itens.length) {
            if (this.auth.isLoggedIn()) {
                this.apostaService.create(this.aposta)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        aposta => this.apostaSuccess(aposta),
                        error => this.handleError(error)
                    );
            } else {
                this.preApostaService.create(this.aposta)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        preAposta => this.preApostaSucess(preAposta.id),
                        error => this.handleError(error)
                    );
            }
        } else {
            this.enableSubmit();
            this.messageService.warning('Por favor, inclua um palpite.');
        }
    }

    apostaSuccess(aposta) {
        this.modalRef = this.modalService.open(ApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.aposta = aposta;

        this.aposta = new Aposta();
        this.enableSubmit();
        this.closeCupom();
    }

    preApostaSucess(id) {
        this.modalRef = this.modalService.open(PreApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.codigo = id;

        this.aposta = new Aposta();
        this.enableSubmit();
        this.closeCupom();
    }

    handleError(msg) {
        this.enableSubmit();
        this.messageService.error(msg);
    }

    get numeros() {
        return this.form.get('numeros') as FormArray;
    }

    setNumeros(numeros: Number[]) {
        const numerosFCs = numeros.map(n => this.fb.control(n));
        const numerosFormArray = this.fb.array(numerosFCs);
        this.form.setControl('numeros', numerosFormArray);
    }

    compararSorteio(obj1, obj2) {
        return obj1 && obj2 ? (obj1.id === obj2.id) : obj1 === obj2;
    }

    // Disabilitar seleção da quantidade de dezenas menor que a quantidade já selecionadas.
    disabledNumber(number) {
        if (this.numeros.value.length && (number < this.numeros.value.length)) {
            return true;
        }
        return false;
    }

    /* Selecionar número */
    checkNumber(number) {
        const numeros = this.numeros.value;
        const index = numeros.findIndex(n => number === n);

        if (index < 0) {
            if (numeros.length < this.qtdNumeros) {
                numeros.push(number);
                numeros.sort((a, b) => a - b);
                this.setNumeros(numeros);
            }
        } else {
            this.numeros.removeAt(index);
        }

        this.tiposAposta.forEach(tipoAposta => {
            if (tipoAposta.qtdNumeros === this.numeros.length) {
                this.tipoAposta = tipoAposta;
            }
        });
    }

    /* Verificar se o número está selecionado */
    isChecked(number) {
        return this.numeros.value.find(n => number === n);
    }

    controlInvalid(control) {
        return control.invalid && (control.dirty || control.touched);
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
}
