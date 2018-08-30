import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { MessageService, ApostaEsportivaService, PrintService, HelperService } from '../services';
import { BilheteEsportivo, PreApostaEsportiva } from '../models';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { BaseFormComponent } from '../shared/base-form/base-form.component';

@Component({
    selector: 'app-validar-aposta',
    templateUrl: 'validar-aposta.component.html',
    styleUrls: ['./validar-aposta.component.css']
})
export class ValidarApostaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    codigo;
    exibirPreAposta = false;
    preAposta: PreApostaEsportiva;
    bilhete: BilheteEsportivo = new BilheteEsportivo();
    unsub$ = new Subject();

    constructor(
        private apostaEsportivaService: ApostaEsportivaService,
        private messageService: MessageService,
        private printService: PrintService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
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
        console.log(this.form.value);
        // this.bilhete.apostador = this.preAposta.apostador;
        // this.bilhete.valor = this.preAposta.valor;

        // const itens = [];
        // this.preAposta.itens.forEach(item => {
        //     itens.push({
        //         jogo_id: item.jogo.id,
        //         jogo_nome: item.jogo.nome,
        //         ao_vivo: item.ao_vivo,
        //         cotacao: {
        //             chave: item.aposta_tipo.chave,
        //             valor: item.cotacao
        //         }
        //     });
        // });
        // this.bilhete.itens = itens;

        // this.apostaEsportivaService.create(this.bilhete)
        //     .pipe(takeUntil(this.unsub$))
        //     .subscribe(
        //         result => this.success(result, 'imprimir'),
        //         error => this.handleError(error)
        //     );
    }

    consultarAposta() {
        this.apostaEsportivaService.getPreAposta(this.codigo)
            .pipe(
                takeUntil(this.unsub$),
                tap(console.log)
            )
            .subscribe(
                preAposta => {
                    this.exibirPreAposta = true;
                    this.preAposta = preAposta;
                    this.form.patchValue(preAposta);
                    this.setItens(preAposta.itens);
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
