import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { BaseFormComponent } from '../../shared/base-form/base-form.component';
import { SorteioService, MessageService } from './../../services';
import { Sorteio } from './../../models';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-resultados-loteria',
    templateUrl: 'resultados-loteria.component.html',
    styleUrls: ['resultados-loteria.component.css']
})
export class ResultadosLoteriaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    sorteios: Sorteio[] = [];
    unsub$ = new Subject();

    constructor(
        private sorteioService: SorteioService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.getSorteios();
        this.createForm();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            tipo: ['']
        });
    }

    submit() {
        this.getSorteios(this.form.value);
    }

    success() { }

    handleError(msg) {
        this.messageService.error(msg);
    }

    getSorteios(params?) {
        let queryParams: any = {
            'data-inicial': moment().subtract('7', 'd').format('YYYY-MM-DD'),
            'data-final': moment().format('YYYY-MM-DD 23:59:59'),
            'sort': '-data'
        };

        if (params && params.tipo) {
            queryParams = {
                'data-inicial': moment().subtract('7', 'd').format('YYYY-MM-DD'),
                'data-final': moment().format('YYYY-MM-DD 23:59:59'),
                'sort': '-data',
                'tipo': params.tipo
            };
        }

        this.sorteioService.getSorteios(queryParams)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                sorteios => this.sorteios = sorteios,
                error => this.handleError(error)
            );
    }
}
