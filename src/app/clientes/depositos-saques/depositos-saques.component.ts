import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder} from '@angular/forms';
import {DepositosESaques} from '../../models';
import {ClienteService} from "../../shared/services/clientes/cliente.service";
import {FinanceiroService} from "../../shared/services/financeiro.service";
import {MenuFooterService} from "../../shared/services/utils/menu-footer.service";

@Component({
    selector: 'app-depositos-saques',
    templateUrl: './depositos-saques.component.html',
    styleUrls: ['./depositos-saques.component.css']
})
export class DepositosSaquesComponent extends BaseFormComponent implements OnInit, OnDestroy {
    showLoading;
    depositosESaques: DepositosESaques[] = [];
    totalSolicitacoes;
    dataInicial;
    dataFinal;
    queryParams;

    constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private financeiroService: FinanceiroService,
        private menuFooterService: MenuFooterService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.menuFooterService.setIsPagina(true);
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
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
        this.financeiroService.getDepositosSaques(queryParams)
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
