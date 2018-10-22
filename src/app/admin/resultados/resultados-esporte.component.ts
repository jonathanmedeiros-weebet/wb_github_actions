import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { CampeonatoService, MessageService } from './../../services';
import { Campeonato } from './../../models';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-resultados-esporte',
    templateUrl: 'resultados-esporte.component.html',
    styleUrls: ['resultados-esporte.component.css']
})
export class ResultadosEsporteComponent extends BaseFormComponent implements OnInit, OnDestroy {
    campeonatos: Campeonato[] = [];
    unsub$ = new Subject();

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

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
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

        this.campeonatoService.getResultados(queryParams)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => this.campeonatos = campeonatos,
                error => this.handleError(error)
            );
    }
}
