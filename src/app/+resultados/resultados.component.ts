import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

import { SorteioService, MessageService } from './../services';
import { Sorteio } from './../models';

import * as moment from 'moment';

@Component({
    selector: 'app-resultados',
    templateUrl: 'resultados.component.html',
    styleUrls: ['resultados.component.css']
})
export class ResultadosComponent implements OnInit {
    sorteios: Sorteio[] = [];
    searchForm: FormGroup;

    constructor(
        private sorteioService: SorteioService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.getSorteios();
        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            tipo: ['']
        });
    }

    getSorteios(params?) {
        let queryParams: any = {
            "data-inicial": moment().subtract('7', 'd').format('YYYY-MM-DD'),
            "data-final": moment().format('YYYY-MM-DD 23:59:59'),
            "sort": "-data"
        };

        if (params && params.tipo) {
            queryParams = {
                "data-inicial": moment().subtract('7', 'd').format('YYYY-MM-DD'),
                "data-final": moment().format('YYYY-MM-DD 23:59:59'),
                "sort": "-data",
                "tipo": params.tipo
            };
        }

        this.sorteioService.getSorteios(queryParams).subscribe(
            sorteios => this.sorteios = sorteios,
            error => this.handleError(error)
        );
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    search() {
        if (this.searchForm.valid) {
            this.getSorteios(this.searchForm.value);
        } else {
            this.checkFormValidations(this.searchForm);
        }
    }

    /* Validation Functions */
    checkFormValidations(form) {
        Object.keys(form.controls).forEach(field => {
            const control = form.get(field);
            control.markAsTouched();
            if (control instanceof FormGroup || control instanceof FormArray) {
                this.checkFormValidations(control);
            }
        });
    }

    verifyInvalidTouch(form, field) {
        const control = form.get(field);
        return !control.valid && control.touched;
    }

    applyCssErrorInput(form, field: string, children?: string) {
        if (children != undefined) {
            field = field.concat(`.${children}`);
        }
        return {
            'is-invalid': this.verifyInvalidTouch(form, field)
        };
    }

    hasError(form, field: string, errorName: string, children?: string): boolean {
        if (children != undefined) {
            field = field.concat(`.${children}`);
        }
        let hasError = false;
        const control = form.get(field);

        if (control.touched) {
            hasError = control.hasError(errorName);
        }

        return hasError;
    }
    /* END Validation Functions */
}
