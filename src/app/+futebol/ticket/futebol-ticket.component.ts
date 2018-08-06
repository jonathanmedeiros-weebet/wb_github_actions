import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Rx';
import {
    MessageService, BilheteEsportivoService, HelperService,
    PrintService, ApostaEsportivaService
} from '../../services';
import { BilheteEsportivo, ItemBilheteEsportivo } from '../../models';

@Component({
    selector: 'futebol-ticket',
    templateUrl: 'futebol-ticket.component.html',
    styleUrls: ['futebol-ticket.component.css']
})
export class FutebolTicketComponent implements OnInit, OnDestroy {
    form: FormGroup;
    possibilidadeGanho = 0;
    sub: Subscription;

    constructor(
        private apostaEsportivaService: ApostaEsportivaService,
        private bilheteService: BilheteEsportivoService,
        private messageService: MessageService,
        private printService: PrintService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.createForm();

        this.sub = this.bilheteService.itensAtuais.subscribe(itens => {
            this.setItens(itens);
            this.calcularPossibilidadeGanho(this.form.value.valor);
        });

        this.form.get('valor').valueChanges.subscribe(valor => {
            this.calcularPossibilidadeGanho(valor);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    createForm() {
        this.form = this.fb.group({
            apostador: ['', [Validators.required]],
            valor: ['', [Validators.required]],
            chave: ['', [Validators.required]],
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

    onSubmit() {
        console.log(this.form.value);

        if (this.itens.length) {
            if (this.form.valid) {
                this.apostaEsportivaService.create(this.form.value).subscribe(
                    result => this.success(result, ''),
                    error => this.handleError(error)
                );
            } else {

            }
        } else {
            this.messageService.warning('Por favor, inclua um palpite.');
        }
    }


    success(data, action) {
        if (action == 'compartilhar') {
            HelperService.sharedTicket(data.results);
        } else {
            this.printService.ticket(data.results);
        }

        this.bilheteService.atualizarItens([]);
        this.messageService.success('Aposta realizada!');
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
