import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import {SorteioService, MessageService, MenuFooterService} from './../../services';
import { Sorteio } from './../../models';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import moment from 'moment';

@Component({
    selector: 'app-resultados-loterias',
    templateUrl: './resultados-loterias.component.html',
    styleUrls: ['./resultados-loterias.component.css']
})
export class ResultadosLoteriasComponent extends BaseFormComponent implements OnInit, OnDestroy {
    sorteios: Sorteio[] = [];
    showLoadingIndicator = true;
    unsub$ = new Subject();

    constructor(
        private messageService: MessageService,
        private sorteioService: SorteioService,
        private fb: UntypedFormBuilder,
        private menuFooterService: MenuFooterService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.getResultados();
        this.menuFooterService.setIsPagina(true);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            'data-inicial': [moment().subtract(1, 'w').format('YYYY-MM-DD'), Validators.required],
            'data-final': [moment().format('YYYY-MM-DD'), Validators.required],
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
            'data-inicial': moment().subtract(1, 'w').format('YYYY-MM-DD'),
            'data-final': moment().format('YYYY-MM-DD'),
            'sport': 1
        };

        if (params) {
            queryParams = params;
        }

        this.sorteioService.getSorteios(queryParams)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                sorteios => {
                    this.showLoadingIndicator = false;
                    this.sorteios = sorteios;
                },
                error => this.handleError(error)
            );
    }

    qtdNumeros(tipo) {
        let result = [];
        if (tipo === 'seninha') {
            result = [1, 2, 3, 4, 5, 6];
        } else {
            result = [1, 2, 3, 4, 5];
        }
        return result;
    }
}
