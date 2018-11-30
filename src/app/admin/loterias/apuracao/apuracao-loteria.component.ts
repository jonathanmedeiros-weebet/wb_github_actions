import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../../../shared/layout/base-form/base-form.component';
import {
    ApostaService, MessageService,
    PrintService, SorteioService,
    AuthService, HelperService
} from './../../../services';
import { Aposta, Sorteio } from './../../../models';
import * as moment from 'moment';

@Component({
    selector: 'app-admin-apuracao-loteria',
    templateUrl: 'apuracao-loteria.component.html',
    styleUrls: ['apuracao-loteria.component.css']
})
export class AdminApuracaoLoteriaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    apostas: Aposta[];
    sorteios: Sorteio[] = [];
    appMobile;
    unsub$ = new Subject();

    constructor(
        private apostaService: ApostaService,
        private sorteioService: SorteioService,
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
        this.getSorteios();
        this.createForm();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    getSorteios(params?) {
        let queryParams: any = {
            'data-inicial': moment().subtract('7', 'd').format('YYYY-MM-DD'),
            'data-final': moment().format('YYYY-MM-DD 23:59:59'),
            'sort': '-data'
        };

        if (params) {
            queryParams = {
                'data-inicial': params.dataInicial,
                'data-final': params.dataFinal,
                'status': params.status,
                'sort': '-data'
            };
        }

        this.sorteioService.getSorteios(queryParams)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                sorteios => this.sorteios = sorteios,
                error => this.handleError(error)
            );
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

        this.apostaService.getApostas(queryParams)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
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
        this.getSorteios(this.form.value);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    printTicket(aposta: Aposta) {
        this.printService.lotteryTicket(aposta);
    }

    sharedTicket(aposta) {
        HelperService.sharedLotteryTicket(aposta);
    }

    checkResult(numero, sorteioResultado) {
        const result: any = {};

        if (sorteioResultado) {
            const exist = sorteioResultado.find(n => parseInt(n, 10) === numero);

            if (exist) {
                result.hit = true;
            } else {
                result.miss = true;
            }
        }

        return result;
    }
}
