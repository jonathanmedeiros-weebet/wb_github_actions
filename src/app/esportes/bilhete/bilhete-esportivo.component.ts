import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import {
    MessageService, BilheteEsportivoService, HelperService,
    PrintService, ApostaEsportivaService, AuthService,
    PreApostaEsportivaService
} from '../../services';
import { ItemBilheteEsportivo } from '../../models';
import * as clone from 'clone';

@Component({
    selector: 'app-bilhete-esportivo',
    templateUrl: 'bilhete-esportivo.component.html',
    styleUrls: ['bilhete-esportivo.component.css'],
})
export class BilheteEsportivoComponent extends BaseFormComponent implements OnInit, OnDestroy {
    possibilidadeGanho = 0;
    opcoes = JSON.parse(localStorage.getItem('opcoes'));
    apostaMinima;
    displayPreTicker = false;
    unsub$ = new Subject();

    constructor(
        private apostaEsportivaService: ApostaEsportivaService,
        private preApostaService: PreApostaEsportivaService,
        private auth: AuthService,
        private bilheteService: BilheteEsportivoService,
        private messageService: MessageService,
        private printService: PrintService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.apostaMinima = this.opcoes.valor_min_aposta;

        this.createForm();

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
            cotacao = cotacao * HelperService.calcularCotacao(
                item.cotacao.valor,
                item.cotacao.chave,
                item.jogo._id,
                item.jogo.cotacoes,
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
        if (this.itens.length) {
            const values = clone(this.form.value);
            values.itens.map(item => {
                delete item.jogo;
            });

            if (this.auth.isLoggedIn()) {
                this.apostaEsportivaService.create(values)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        result => this.apostaSuccess(result, 'imprimir'),
                        error => this.handleError(error)
                    );
            } else {
                this.preApostaService.create(values)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        result => this.preApostaSuccess(result.id),
                        error => this.handleError(error)
                    );
            }
        } else {
            this.messageService.warning('Por favor, inclua um palpite.');
        }
    }

    apostaSuccess(data, action) {
        if (action === 'compartilhar') {
            HelperService.sharedSportsTicket(data.results);
        } else {
            this.printService.sportsTicket(data.results);
        }

        this.bilheteService.atualizarItens([]);
        this.form.reset();

        this.messageService.success('Aposta realizada!');
    }

    preApostaSuccess(id) {
        this.bilheteService.atualizarItens([]);
        this.form.reset();
        alert(`Procure o cambista da ZEBRINHA.BET de sua preferência e informe o código: #${id}`);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    openCupom() {
        this.displayPreTicker = true;
    }

    closeCupom() {
        this.displayPreTicker = false;
    }
}
