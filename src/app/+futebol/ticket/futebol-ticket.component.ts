import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../../shared/base-form/base-form.component';
import {
    MessageService, BilheteEsportivoService, HelperService,
    PrintService, ApostaEsportivaService
} from '../../services';
import { ItemBilheteEsportivo } from '../../models';

@Component({
    selector: 'app-futebol-ticket',
    templateUrl: 'futebol-ticket.component.html',
    styleUrls: ['futebol-ticket.component.css']
})
export class FutebolTicketComponent extends BaseFormComponent implements OnInit, OnDestroy {
    possibilidadeGanho = 0;
    unsub$ = new Subject();

    constructor(
        private apostaEsportivaService: ApostaEsportivaService,
        private bilheteService: BilheteEsportivoService,
        private messageService: MessageService,
        private printService: PrintService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();

        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => {
                this.setItens(itens);
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
            valor: ['', [Validators.required, Validators.min(1)]],
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
        let cotacoes = 1;

        this.itens.value.forEach(item => {
            cotacoes = cotacoes * item.cotacao.valor;
        });

        this.possibilidadeGanho = valor * cotacoes;
    }

    submit() {
        if (this.itens.length) {
            this.apostaEsportivaService.create(this.form.value)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    result => this.success(result, 'imprimir'),
                    error => this.handleError(error)
                );
        } else {
            this.messageService.warning('Por favor, inclua um palpite.');
        }
    }


    success(data, action) {
        if (action === 'compartilhar') {
            HelperService.sharedSportsTicket(data.results);
        } else {
            this.printService.sportsTicket(data.results);
        }

        this.bilheteService.atualizarItens([]);
        this.form.reset();

        this.messageService.success('Aposta realizada!');
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
