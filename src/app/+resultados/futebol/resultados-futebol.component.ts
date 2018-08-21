import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BaseFormComponent } from '../../shared/base-form/base-form.component';
import { CampeonatoService, MessageService } from './../../services';
import { Campeonato, Jogo } from './../../models';

import * as moment from 'moment';

@Component({
    selector: 'app-resultados-futebol',
    templateUrl: 'resultados-futebol.component.html',
    styleUrls: ['resultados-futebol.component.css']
})
export class ResultadosFutebolComponent extends BaseFormComponent implements OnInit {
    campeonatos: Campeonato[] = [];

    constructor(
        private messageService: MessageService,
        private campeonatoService: CampeonatoService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.getResultados();
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            data: [moment().format('YYYY-MM-DD')]
        });
    }

    submit() {
        this.getResultados(this.form.value);
    }

    success() { }

    handleError(msg) {
        this.messageService.error(msg);
    }

    getResultados(params?) {
        let queryParams: any = {
            'data': moment().format('YYYY-MM-DD')
        };

        if (params) {
            queryParams = {
                'data': params.data
            };
        }

        this.campeonatoService.getResultados(queryParams).subscribe(
            campeonatos => this.campeonatos = campeonatos,
            error => this.handleError(error)
        );
    }
}
