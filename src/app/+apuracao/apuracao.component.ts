import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

import { ApostaService, MessageService, PrintService } from './../services';
import { Aposta } from './../models';

@Component({
    selector: 'app-apuracao',
    templateUrl: 'apuracao.component.html',
    styleUrls: ['apuracao.component.css']
})
export class ApuracaoComponent implements OnInit {
    apostas: Aposta[];
    searchForm: FormGroup;

    constructor(
        private apostaService: ApostaService,
        private messageService: MessageService,
        private printService: PrintService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.apostaService.getApostas().subscribe(
            apostas => this.apostas = apostas,
            error => this.handleError(error)
        );

        this.createForm();
    }

    createForm() {
        this.searchForm = this.fb.group({
            dataInicial: ['', Validators.required],
            dataFinal: ['', Validators.required],
            status: ['']
        });
    }

    search() {
        if (this.searchForm.valid) {
            const values = this.searchForm.value;
            let queryParams = {
                "data-inicial": values.dataInicial,
                "data-final": values.dataFinal,
                "status": values.status
            };

            this.apostaService.getApostas(queryParams).subscribe(
                apostas => this.apostas = apostas,
                error => this.handleError(error)
            );
        } else {
            this.checkFormValidations(this.searchForm);
        }
    }

    imprimirBilhete(aposta) {
        this.printService.bilhete(aposta);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

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
}
