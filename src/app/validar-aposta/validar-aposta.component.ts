import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

import {
    MessageService, PreApostaEsportivaService, ApostaEsportivaService,
    PrintService, HelperService, SorteioService
} from '../services';
import { BilheteEsportivo, PreApostaEsportiva } from '../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../shared/layout/base-form/base-form.component';

declare var $;

@Component({
    selector: 'app-validar-aposta',
    templateUrl: 'validar-aposta.component.html',
    styleUrls: ['./validar-aposta.component.css']
})
export class ValidarApostaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    codigo;
    exibirPreAposta = false;
    preAposta: any;
    preApostaItens = [];
    sorteios = [];
    bilhete: BilheteEsportivo = new BilheteEsportivo();
    unsub$ = new Subject();

    constructor(
        private apostaEsportivaService: ApostaEsportivaService,
        private preApostaService: PreApostaEsportivaService,
        private sorteioService: SorteioService,
        private messageService: MessageService,
        private printService: PrintService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.sorteioService.getSorteios(sorteios => this.sorteios = sorteios);

        this.createForm();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            'apostador': ['', Validators.required],
            'cotacao': ['', Validators.required],
            'horario': ['', Validators.required],
            'premio': ['', Validators.required],
            'valor': ['', Validators.required],
            'itens': this.fb.array([])
        });

        this.form.get('valor').valueChanges
            .pipe(takeUntil(this.unsub$))
            .subscribe(valor => {
                const premio = valor * this.form.value.cotacao;
                this.form.patchValue({ premio: premio });
            });
    }

    get itens(): FormArray {
        return this.form.get('itens') as FormArray;
    }

    setItens(itens: any[]) {
        const itensFCs = itens.map(item => this.fb.group(item));
        const itensFormArray = this.fb.array(itensFCs);
        this.form.setControl('itens', itensFormArray);
    }

    removerItem(i) {
        this.itens.removeAt(i);
    }

    submit() {
        const values = this.form.value;
        console.log(values);

        // if (values.itens.length) {
        //     this.bilhete.apostador = values.apostador;
        //     this.bilhete.valor = values.valor;

        //     const itens = [];
        //     values.itens.forEach(item => {
        //         itens.push({
        //             jogo_id: item.jogo.id,
        //             jogo_nome: item.jogo.nome,
        //             aoVivo: item.aoVivo,
        //             cotacao: {
        //                 chave: item.aposta_tipo.chave,
        //                 valor: item.cotacao
        //             }
        //         });
        //     });
        //     this.bilhete.itens = itens;

        //     this.apostaEsportivaService.create(this.bilhete)
        //         .pipe(takeUntil(this.unsub$))
        //         .subscribe(
        //             result => this.success(result, 'imprimir'),
        //             error => this.handleError(error)
        //         );
        // } else {
        //     this.handleError('Nenhum jogo na aposta!');
        // }
    }

    consultarAposta() {
        this.preApostaService.getPreAposta(this.codigo)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                preAposta => {
                    console.log(preAposta);
                    this.exibirPreAposta = true;
                    this.preAposta = preAposta;
                    this.form.patchValue(preAposta);
                },
                error => this.handleError(error)
            );
    }

    success(data, action) {
        if (action === 'compartilhar') {
            HelperService.sharedSportsTicket(data.results);
        } else {
            this.printService.sportsTicket(data.results);
        }

        this.messageService.success('Aposta validada!');
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
