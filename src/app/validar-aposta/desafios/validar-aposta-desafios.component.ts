import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    MessageService,
    DesafioApostaService,
    ParametrosLocaisService
} from '../../services';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';

@Component({
    selector: 'app-validar-aposta-desafios',
    templateUrl: 'validar-aposta-desafios.component.html',
    styleUrls: ['./validar-aposta-desafios.component.css']
})
export class ValidarApostaDesafiosComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() success = new EventEmitter();
    @Input() preAposta: any;
    preApostaItens = [];
    disabled = false;
    estimativaGanho;
    opcoes;
    unsub$ = new Subject();

    constructor(
        private desafioApostaService: DesafioApostaService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private paramsService: ParametrosLocaisService
    ) {
        super();
    }

    ngOnInit() {
        this.opcoes = this.paramsService.getOpcoes();
        this.createForm();
        this.preApostaItens = this.preAposta.itens;
        this.form.patchValue(this.preAposta);
        this.calcularEstimativaGanho();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            apostador: ['', Validators.required],
            valor: ['', Validators.required]
        });
    }

    removerItem(i) {
        this.preAposta.itens.splice(i, 1);

        this.preAposta.cotacao = this.preAposta.itens
            .map(item => item.cotacao)
            .reduce((acumulador, valorAtual) => acumulador * valorAtual);

        this.calcularEstimativaGanho();
    }

    submit() {
        this.disabledSubmit();

        const values = this.form.value;
        values.preaposta_id = this.preAposta.id;

        values.itens = this.preApostaItens.map(item => {
            return {
                odd_id: item.odd.id
            };
        });

        if (values.itens.length) {
            this.desafioApostaService
                .create(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    result => {
                        this.enableSubmit();
                        this.success.emit(result);
                    },
                    error => this.handleError(error)
                );
        } else {
            this.handleError('Nenhum evento na aposta!');
        }
    }

    handleError(error) {
        this.enableSubmit();
        this.messageService.error(error);
    }

    disabledSubmit() {
        this.disabled = true;
    }

    enableSubmit() {
        this.disabled = false;
    }

    calcularEstimativaGanho() {
        const estimativaGanho = this.form.value.valor * this.preAposta.cotacao;
        if (estimativaGanho < this.opcoes.valor_max_premio) {
            this.estimativaGanho = estimativaGanho;
        } else {
            this.estimativaGanho = this.opcoes.valor_max_premio;
        }
    }
}
