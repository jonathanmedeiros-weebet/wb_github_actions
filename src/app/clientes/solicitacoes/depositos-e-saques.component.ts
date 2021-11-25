import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder} from '@angular/forms';
import {DepositosESaques} from '../../models';
import {ClienteService} from "../../shared/services/clientes/cliente.service";
import {FinanceiroService} from "../../shared/services/financeiro.service";

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
    queryParams;

    constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private financeiroService: FinanceiroService
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
        this.queryParams = this.form.value;
        const queryParams: any = {
            'periodo': this.queryParams.periodo,
            'tipo': this.queryParams.tipo,
        };
        this.financeiroService.getDepositosESaques(queryParams)
            .subscribe(
                response => {
                    this.depositosESaques = response;
                },
                error => {
                    this.handleError(error);
                    this.showLoading = false;
                }
            );
    }

    testLen() {
        console.log(this.depositosESaques.length);
    }

}
