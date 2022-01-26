import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {FinanceiroService} from '../../../shared/services/financeiro.service';
import {MessageService} from '../../../shared/services/utils/message.service';
import {Pix} from '../../../models';

@Component({
    selector: 'app-deposito-pix',
    templateUrl: './deposito-pix.component.html',
    styleUrls: ['./deposito-pix.component.css']
})
export class DepositoPixComponent extends BaseFormComponent implements OnInit {
    submitting = false;
    pix: Pix;
    exibirMensagemPagamento = false;
    novoSaldo;
    clearSetInterval;
    verificacoes = 0;

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
        this.novoSaldo = 0;
        this.exibirMensagemPagamento = false;
        const detalhesPagamento = this.form.value;
        detalhesPagamento.metodo = 'pix';
        this.financeiroService.processarPagamento(detalhesPagamento)
            .subscribe(
                res => {
                    this.pix = res;
                    this.clearSetInterval = setInterval(() => {
                        this.verificarPagamento(res);
                    }, 10000);
                },
                error => {
                    this.handleError(error);
                    this.submitting = false;
                }
            );
    }

    copyInputMessage(inputElement) {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        this.messageService.success('QRCode copiado para área de transferência');
    }

    novoPix() {
        this.pix = null;
        this.form.patchValue({'valor': null});
        this.submitting = false;
        clearInterval(this.clearSetInterval);
        this.verificacoes = 0;
    }

    verificarPagamento(pix) {
        if (this.verificacoes >= 12) {
            clearInterval(this.clearSetInterval);
            this.verificacoes = 0;
        } else {
            this.financeiroService.verificarPagamento({'pagamento_id': pix.pagamento_id})
                .subscribe(
                    res => {
                        if (res.deposito_status === 'approved') {
                            this.novoSaldo = res.novo_saldo;
                            this.exibirMensagemPagamento = true;
                            this.novoPix();
                        }
                    },
                    error => {
                        this.handleError(error);
                    }
                );
            this.verificacoes++;
        }
    }
}
