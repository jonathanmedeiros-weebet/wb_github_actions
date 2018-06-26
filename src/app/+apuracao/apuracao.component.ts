import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

import {
    ApostaService, MessageService,
    PrintService, SorteioService,
    AuthService
} from './../services';
import { Aposta, Sorteio } from './../models';
import { config } from './../shared/config';

import * as moment from 'moment';

@Component({
    selector: 'app-apuracao',
    templateUrl: 'apuracao.component.html',
    styleUrls: ['apuracao.component.css']
})
export class ApuracaoComponent implements OnInit {
    apostas: Aposta[];
    sorteios: Sorteio[] = [];
    searchForm: FormGroup;
    appMobile;

    constructor(
        private apostaService: ApostaService,
        private sorteioService: SorteioService,
        private messageService: MessageService,
        private printService: PrintService,
        private auth: AuthService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.getApostas();
        this.getSorteios();
        this.createForm();
    }

    getSorteios(params?) {
        let queryParams: any = {
            'data-inicial': moment().subtract('7', 'd').format('YYYY-MM-DD'),
            'data-final': moment().format('YYYY-MM-DD 23:59:59'),
            'sort': "-data"
        };

        if (params) {
            queryParams = {
                'data-inicial': params.dataInicial,
                'data-final': params.dataFinal,
                'status': params.status,
                'sort': '-data'
            };
        }

        this.sorteioService.getSorteios(queryParams).subscribe(
            sorteios => this.sorteios = sorteios,
            error => this.handleError(error)
        );
    }

    getApostas(params?) {
        let queryParams: any = {
            'data-inicial': moment().subtract('7', 'd').format('YYYY-MM-DD'),
            'data-final': moment().format('YYYY-MM-DD 23:59:59'),
            'sort': "-horario"
        };

        if (params) {
            queryParams = {
                'data-inicial': params.dataInicial,
                'data-final': params.dataFinal,
                'status': params.status,
                'sort': '-horario'
            };
        }

        this.apostaService.getApostas(queryParams).subscribe(
            apostas => this.apostas = apostas,
            error => this.handleError(error)
        );
    }

    createForm() {
        this.searchForm = this.fb.group({
            dataInicial: [moment().subtract('7', 'd').format('YYYY-MM-DD'), Validators.required],
            dataFinal: [moment().format('YYYY-MM-DD'), Validators.required],
            status: ['']
        });
    }

    search() {
        if (this.searchForm.valid) {
            this.getApostas(this.searchForm.value);
            this.getSorteios(this.searchForm.value);
        } else {
            this.checkFormValidations(this.searchForm);
        }
    }

    printTicket(aposta: Aposta) {
        this.printService.ticket(aposta);
    }

    sharedTicket(aposta: Aposta) {
        parent.postMessage(
            {
                data: `${config.HOST}/aposta/${aposta.chave}`,
                action: 'shareURL'
            },
            'file://'
        );
    }

    checkResult(sorteioId, numero) {
        let sorteio: Sorteio = this.sorteios.find(sorteio => sorteio.id == sorteioId);
        let result: any = {};

        if (sorteio && sorteio.resultado) {
            let exist = sorteio.resultado.find(n => n == numero);

            if (exist) {
                result.hit = true;
            } else {
                result.miss = true;
            }
        }

        return result;
    }

    handleError(msg) {
        this.messageService.error(msg);
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
