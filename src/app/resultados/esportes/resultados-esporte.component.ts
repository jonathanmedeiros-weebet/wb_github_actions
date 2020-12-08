import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { ResultadoService, MessageService } from './../../services';
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
    showLoadingIndicator = true;
    unsub$ = new Subject();

    constructor(
        private messageService: MessageService,
        private resultadoService: ResultadoService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.getResultados();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            data: [moment().format('YYYY-MM-DD'), Validators.required],
            sport_id: ['1', Validators.required]
        });
    }

    submit() {
        this.showLoadingIndicator = true;
        this.getResultados(this.form.value);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    getResultados(params?) {
        let queryParams: any = {
            'data': moment().format('YYYY-MM-DD'),
            'sport': 1
        };

        if (params) {
            queryParams = params;
        }

        this.resultadoService.getResultados(queryParams)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => {
                    this.showLoadingIndicator = false;
                    this.campeonatos = campeonatos;
                },
                error => this.handleError(error)
            );
    }
}
