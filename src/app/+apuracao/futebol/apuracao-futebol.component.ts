import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

import { BaseFormComponent } from '../../shared/base-form/base-form.component';
import {
    ApostaEsportivaService, MessageService,
    PrintService, AuthService,
    HelperService
} from './../../services';
import { ApostaEsportiva } from './../../models';

import * as moment from 'moment';

@Component({
    selector: 'app-apuracao-futebol',
    templateUrl: 'apuracao-futebol.component.html',
    styleUrls: ['apuracao-futebol.component.css']
})
export class ApuracaoFutebolComponent extends BaseFormComponent implements OnInit {
    apostas: ApostaEsportiva[] = [];
    appMobile;

    constructor(
        private apostaService: ApostaEsportivaService,
        private messageService: MessageService,
        private printService: PrintService,
        private auth: AuthService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.getApostas();
        this.createForm();
    }

    getApostas(params?) {
        let queryParams: any = {
            'data-inicial': moment().subtract('7', 'd').format('YYYY-MM-DD'),
            'data-final': moment().format('YYYY-MM-DD 23:59:59'),
            'sort': '-horario'
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
        this.form = this.fb.group({
            dataInicial: [moment().subtract('7', 'd').format('YYYY-MM-DD'), Validators.required],
            dataFinal: [moment().format('YYYY-MM-DD'), Validators.required],
            status: ['']
        });
    }

    submit() {
        this.getApostas(this.form.value);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    printTicket(aposta: ApostaEsportiva) {
        this.printService.sportsTicket(aposta);
    }

    sharedTicket(aposta) {
        HelperService.sharedSportsTicket(aposta);
    }
}
