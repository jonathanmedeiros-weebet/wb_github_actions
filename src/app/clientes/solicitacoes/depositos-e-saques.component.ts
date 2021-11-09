import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder} from '@angular/forms';
import {DepositosESaques} from '../../models';

@Component({
    selector: 'app-solicitacoes',
    templateUrl: './depositos-e-saques.component.html',
    styleUrls: ['./depositos-e-saques.component.css']
})
export class DepositosESaquesComponent extends BaseFormComponent implements OnInit {
    showLoading;
    depositosESaques: DepositosESaques[] = [];
    totalSolicitacoes;
    dataInicial;
    dataFinal;

    constructor(
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            periodo: ['semana_atual'],
            tipo: [''],
        });

        this.submit();
    }

    handleError(error: string) {
    }

    submit() {
    }

}
