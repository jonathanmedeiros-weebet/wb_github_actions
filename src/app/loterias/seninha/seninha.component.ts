import { Component, OnInit, OnDestroy, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import {
    TipoApostaLoteriaService, MessageService,
    SorteioService, ApostaLoteriaService,
    PrintService, HelperService,
    SidebarService, SupresinhaService,
    AuthService, PreApostaLoteriaService
} from '../../services';
import { TipoAposta, Aposta, Sorteio } from '../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { config } from './../../shared/config';
import * as _ from 'lodash';

@Component({
    selector: 'app-seninha',
    templateUrl: 'seninha.component.html'
})
export class SeninhaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    numbers = _.range(1, 61);
    tiposAposta: TipoAposta[] = [];
    sorteios: Sorteio[] = [];
    tipoAposta: TipoAposta;
    aposta = new Aposta();
    displayPreTicker = false;
    BANCA_NOME = config.BANCA_NOME;
    disabled = false;
    appMobile = false;
    isLoggedIn = false;
    mensagemSucesso = '';
    ultimaApostaRealizada;
    @ViewChild('modal') modal: ElementRef;
    modalReference;
    unsub$ = new Subject();

    constructor(
        private sidebarService: SidebarService,
        private auth: AuthService,
        private apostaService: ApostaLoteriaService,
        private preApostaService: PreApostaLoteriaService,
        private tipoApostaService: TipoApostaLoteriaService,
        private sorteioService: SorteioService,
        private messageService: MessageService,
        private printService: PrintService,
        private fb: FormBuilder,
        private supresinhaService: SupresinhaService,
        private renderer: Renderer2,
        private el: ElementRef,
        private modalService: NgbModal
    ) {
        super();
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.isLoggedIn = this.auth.isLoggedIn();

        const queryParams = { tipo: 'seninha' };

        this.tipoApostaService.getTiposAposta(queryParams).subscribe(
            tiposAposta => {
                this.tiposAposta = tiposAposta;
                this.sidebarService.changeItens(tiposAposta, 'seninha');
            },
            error => this.messageService.error(error)
        );
        this.sorteioService.getSorteios(queryParams).subscribe(
            sorteios => this.sorteios = sorteios,
            error => this.messageService.error(error)
        );

        this.createForm();

        const altura = window.innerHeight - 69;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-sticky');
        const contentLoteriaEl = this.el.nativeElement.querySelector('.content-loteria');
        const preBilheteEl = this.el.nativeElement.querySelector('.pre-bilhete');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura - 60}px`);
        this.renderer.setStyle(contentLoteriaEl, 'height', `${altura}px`);
        this.renderer.setStyle(preBilheteEl, 'height', `${altura}px`);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            valor: ['', Validators.required],
            sorteio: [null, Validators.required],
            numeros: this.fb.array([])
        });

        // Escutando surpresinha vinda do NavigationComponent
        this.supresinhaService.atualizarSupresinha([]);

        this.supresinhaService.numeros.subscribe(numeros => {
            this.tiposAposta.forEach(tipoAposta => {
                if (tipoAposta.qtdNumeros === numeros.length) {
                    this.tipoAposta = tipoAposta;
                }
            });

            this.setNumeros(numeros);
        });
    }

    /* Incluir palpite */
    submit() {
        const tipoAPosta = this.tiposAposta.find(tipoAposta => tipoAposta.qtdNumeros === this.numeros.length);

        if (tipoAPosta) {
            const item = this.form.value;
            item.sorteio_id = this.form.value.sorteio.id;
            item.premio6 = item.valor * this.tipoAposta.cotacao6;
            item.premio5 = item.valor * this.tipoAposta.cotacao5;
            item.premio4 = item.valor * this.tipoAposta.cotacao4;
            item.premio3 = item.valor * this.tipoAposta.cotacao3;
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
    create(action) {
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
        this.ultimaApostaRealizada = aposta;
        this.mensagemSucesso = 'Aposta realizada com <strong>SUCESSO</strong>!';
        this.aposta = new Aposta();
        this.enableSubmit();
        this.closeCupom();

        this.modalReference = this.modalService.open(this.modal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalReference.result
            .then((result) => { },
                (reason) => { });
    }

    preApostaSucess(id) {
        this.mensagemSucesso = `Para validar sua aposta, procure um cambista de sua
        preferência e informe o código: <b>#${id}</b>`;
        this.aposta = new Aposta();
        this.enableSubmit();
        this.closeCupom();

        this.modalReference = this.modalService.open(this.modal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalReference.result
            .then((result) => { },
                (reason) => { });
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

    /* Selecionar número */
    checkNumber(number) {
        const numeros = this.numeros.value;
        const index = numeros.findIndex(n => number === n);

        if (index < 0) {
            numeros.push(number);
            numeros.sort((a, b) => a - b);
            this.setNumeros(numeros);
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

    printTicket() {
        this.printService.lotteryTicket(this.ultimaApostaRealizada);
    }

    shareTicket() {
        HelperService.sharedLotteryTicket(this.ultimaApostaRealizada);
    }
}
