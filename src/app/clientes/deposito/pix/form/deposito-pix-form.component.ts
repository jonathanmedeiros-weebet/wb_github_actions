import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {FinanceiroService} from '../../../../shared/services/financeiro.service';
import {MessageService} from '../../../../shared/services/utils/message.service';
import {Pix} from '../../../../models';

@Component({
    selector: 'app-deposito-pix-form',
    templateUrl: './deposito-pix-form.component.html',
    styleUrls: ['./deposito-pix-form.component.css']
})
export class DepositoPixFormComponent extends BaseFormComponent implements OnInit {
    submitting = false;
    pix: Pix;

    constructor(
        private fb: FormBuilder,
        private financeiroService: FinanceiroService,
        private messageService: MessageService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            valor: [null, Validators.required]
        });
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    submit() {
        this.submitting = true;
        const detalhesPagamento = this.form.value;
        detalhesPagamento.metodo = 'pix';
        this.financeiroService.processarPagamento(detalhesPagamento)
            .subscribe(
                res => {
                    this.pix = res;
                },
                error => {
                    this.handleError(error);
                    this.submitting = false;
                }
            );
    }

    finalize(values: any) {
        this.pix = null;
        this.form.patchValue({'valor': null});
        this.submitting = false;
    }
}
