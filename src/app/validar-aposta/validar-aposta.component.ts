import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

import {
    MessageService, PreApostaEsportivaService, ApostaEsportivaService,
    PrintService, HelperService, SorteioService, ApostaLoteriaService
} from '../services';
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
    unsub$ = new Subject();

    constructor(
        private apostaLoteriaService: ApostaLoteriaService,
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
        this.sorteioService.getSorteios().subscribe(sorteios => this.sorteios = sorteios);
        this.createForm();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            'apostador': ['', Validators.required],
            'valor': ['', Validators.required]
        });
    }

    removerItem(i) {
        this.preAposta.itens.splice(i, 1);

        if (this.preAposta.tipo === 'esportes') {
            this.preAposta.cotacao = this.preAposta.itens
                .map(item => item.cotacao)
                .reduce((acumulador, valorAtual) => acumulador * valorAtual);
        } else {
            this.preAposta.valor = this.preAposta.itens
                .map(item => item.valor)
                .reduce((acumulador, valorAtual) => acumulador * valorAtual);
        }
    }

    submit() {
        const values = this.form.value;
        values.preaposta_id = this.preAposta.id;

        if (this.preAposta.tipo === 'esportes') {
            values.itens = this.preApostaItens.map(item => {
                return {
                    jogo_id: item.jogo.id,
                    jogo_nome: item.jogo.nome,
                    ao_vivo: item.ao_vivo,
                    cotacao: {
                        chave: item.aposta_tipo.chave,
                        valor: item.cotacao,
                    }
                };
            });

            if (values.itens.length) {
                this.apostaEsportivaService.create(values)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        result => this.success(result, 'imprimir'),
                        error => this.handleError(error)
                    );
            } else {
                this.handleError('Nenhum jogo na aposta!');
            }
        } else {
            values.telefone = this.preAposta.telefone;
            values.versao_app = 'angular';

            values.itens = this.preApostaItens.map(item => {
                return {
                    valor: item.valor,
                    sorteio_id: item.sorteio_id,
                    numeros: item.numeros
                };
            });

            if (values.itens.length) {
                this.apostaLoteriaService.create(values)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        result => this.success(result, 'imprimir'),
                        error => this.handleError(error)
                    );
            } else {
                this.handleError('Nenhum palpite na aposta!');
            }
        }
    }

    consultarAposta() {
        this.preApostaService.getPreAposta(this.codigo)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                preAposta => {
                    this.exibirPreAposta = true;
                    this.preAposta = preAposta;
                    this.preApostaItens = preAposta.itens;
                    this.form.patchValue(preAposta);
                },
                error => this.handleError(error)
            );
    }

    success(data, action) {
        // if (action === 'compartilhar') {
        //     HelperService.sharedSportsTicket(data.results);
        // } else {
        //     this.printService.sportsTicket(data.results);
        // }
        this.messageService.success('Aposta validada!');
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    sorteioNome(sorteioId) {
        const sorteio = this.sorteios.find(s => s.id === sorteioId);
        return sorteio ? sorteio.nome : '';
    }
}
