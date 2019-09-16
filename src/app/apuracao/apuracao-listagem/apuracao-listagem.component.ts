import { Component, OnInit, } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { MessageService, ParametrosLocaisService } from './../../services';
import * as moment from 'moment';

@Component({
    selector: 'app-apuracao-listagem',
    templateUrl: './apuracao-listagem.component.html',
    styleUrls: ['./apuracao-listagem.component.css']
})
export class ApuracaoListagemComponent extends BaseFormComponent implements OnInit {
    queryParams;
    dataInicial;
    dataFinal;
    loteriasHabilitada;
    acumuladaoHabilitado;
    tipo = 'esporte';

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        private params: ParametrosLocaisService
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

        this.loteriasHabilitada = this.params.getOpcoes().loterias;
        this.acumuladaoHabilitado = this.params.getOpcoes().acumuladao;

        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            dataInicial: [this.dataInicial.format('YYYY-MM-DD'), Validators.required],
            dataFinal: [this.dataFinal.format('YYYY-MM-DD'), Validators.required],
            status: [''],
            apostador: ['']
        });

        this.submit();
    }

    submit() {
        this.queryParams = this.form.value;
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
