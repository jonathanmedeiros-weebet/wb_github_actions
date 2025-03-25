import {Component, OnDestroy, OnInit} from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';

import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import {MenuFooterService, MessageService, ParametrosLocaisService} from './../../services';
import moment from 'moment';

@Component({
    selector: 'app-apuracao-listagem',
    templateUrl: './apuracao-listagem.component.html',
    styleUrls: ['./apuracao-listagem.component.css']
})
export class ApuracaoListagemComponent extends BaseFormComponent implements OnInit, OnDestroy {
    queryParams;
    dataInicial;
    dataFinal;
    loteriasHabilitada;
    acumuladaoHabilitado;
    desafioHabilitado;
    activeId = 'esporte';

    constructor(
        private messageService: MessageService,
        private fb: UntypedFormBuilder,
        private params: ParametrosLocaisService,
        private menuFooterService: MenuFooterService
    ) {
        super();
    }

    ngOnInit() {
        if (moment().day() === 0) {
            const startWeek = moment().startOf('week');
            this.dataInicial = startWeek.subtract(6, 'days');
            this.dataFinal = moment();

        } else {
            this.dataInicial = moment().startOf('week').add('1', 'day');
            this.dataFinal = moment();
        }

        this.loteriasHabilitada = this.params.getOpcoes().loterias;
        this.acumuladaoHabilitado = this.params.getOpcoes().acumuladao;
        this.desafioHabilitado = this.params.getOpcoes().desafio;

        this.createForm();
        this.menuFooterService.setIsPagina(true);
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
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
