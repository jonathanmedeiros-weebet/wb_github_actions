import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { config } from './../../shared/config';
import * as _ from 'lodash';

import PerfectScrollbar from 'perfect-scrollbar';

declare var $;

@Component({
    selector: 'app-quininha',
    templateUrl: 'quininha.component.html'
})
export class QuininhaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    numbers = _.range(1, 81);
    tiposAposta: TipoAposta[] = [];
    sorteios: Sorteio[] = [];
    tipoAposta: TipoAposta;
    aposta = new Aposta();
    displayPreTicker = false;
    BANCA_NOME = config.BANCA_NOME;
    appMobile;
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
        private supresinhaService: SupresinhaService
    ) {
        super();
    }

    ngOnInit() {
        const queryParams = { tipo: 'quininha' };

        this.tipoApostaService.getTiposAposta(queryParams).subscribe(
            tiposAposta => {
                this.tiposAposta = tiposAposta;
                this.sidebarService.changeItens(tiposAposta, 'loterias');
            },
            error => this.messageService.error(error)
        );
        this.sorteioService.getSorteios(queryParams)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                sorteios => this.sorteios = sorteios,
                error => this.messageService.error(error)
            );

        this.createForm();

        const altura = window.innerHeight - 69;
        $('.wrap-sticky').css('min-height', altura - 60);
        $('.content-loteria').css('height', altura);
        $('.pre-bilhete').css('height', altura);
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
            item.premio5 = item.valor * this.tipoAposta.cotacao5;
            item.premio4 = item.valor * this.tipoAposta.cotacao4;
            item.premio3 = item.valor * this.tipoAposta.cotacao3;
            this.aposta.itens.push(item);

            this.aposta.valor += item.valor;
            this.aposta.premio += item.premio5;

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
        if (this.aposta.itens.length) {
            if (this.auth.isLoggedIn()) {
                this.apostaService.create(this.aposta)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        aposta => this.success(aposta, action),
                        error => this.handleError(error)
                    );
            } else {
                this.preApostaService.create(this.aposta)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        preAposta => {
                            this.aposta = new Aposta();
                            const msg = `
                            Procure o cambista da ${this.BANCA_NOME} de sua preferência e informe o código:
                            #${preAposta.id}
                            `;
                            alert(msg);
                        },
                        error => this.handleError(error)
                    );
            }
        } else {
            this.messageService.warning('Por favor, inclua um palpite.');
        }
    }

    success(data, action) {
        if (action === 'compartilhar') {
            HelperService.sharedLotteryTicket(data.results);
        } else {
            this.printService.lotteryTicket(data.results);
        }

        this.aposta = new Aposta();
        this.messageService.success('Aposta realizada!');
        this.closeCupom();
    }

    handleError(msg) {
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
}
