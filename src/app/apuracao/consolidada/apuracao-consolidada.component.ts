import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { RelatorioService, MessageService, AuthService } from './../../services';
import * as moment from 'moment';

@Component({
    selector: 'app-apuracao-consolidada',
    templateUrl: './apuracao-consolidada.component.html',
    styleUrls: ['./apuracao-consolidada.component.css']
})
export class ApuracaoConsolidadaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    relatorio;
    showLoadingIndicator = true;
    dataInicial;
    dataFinal;

    constructor(
        private relatorioService: RelatorioService,
        private messageService: MessageService,
        private auth: AuthService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {

        if (moment().day() === 0 || moment().day() === 1) {
            const startWeek = moment().startOf('week');
            this.dataInicial = startWeek.subtract(6, 'days');

            if (moment().day() === 0) {
                this.dataFinal = moment();
            } else {
                this.dataFinal = moment().subtract(1, 'days');
            }
        } else {
            this.dataInicial = moment().startOf('week').add('1', 'day');
            this.dataFinal = moment();
        }

        this.getResultado();
        this.createForm();
    }

    ngOnDestroy() { }

    getResultado(params?) {
        let queryParams: any = {
            'data-inicial': this.dataInicial.format('YYYY-MM-DD'),
            'data-final': this.dataFinal.format('YYYY-MM-DD 23:59:59')
        };

        if (params) {
            queryParams = {
                'data-inicial': params.dataInicial,
                'data-final': params.dataFinal
            };
        }

        this.relatorioService.getResultado(queryParams).subscribe(
            result => {
                this.relatorio = result;
                this.showLoadingIndicator = false;
                console.log(result);
            }
        );
    }

    createForm() {
        this.form = this.fb.group({
            dataInicial: [this.dataInicial.format('YYYY-MM-DD'), Validators.required],
            dataFinal: [this.dataFinal.format('YYYY-MM-DD'), Validators.required]
        });
    }
    submit() {
        this.showLoadingIndicator = !this.showLoadingIndicator;
        this.getResultado(this.form.value);
    }
    handleError(error: string) {
        this.messageService.error(error);
    }
}
