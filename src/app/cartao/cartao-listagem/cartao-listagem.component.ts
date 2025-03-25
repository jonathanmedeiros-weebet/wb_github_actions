import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import {MessageService, CartaoService, MenuFooterService} from './../../services';
import { CartaoAposta } from './../../models';
import moment from 'moment';

@Component({
    selector: 'app-cartao-listagem',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './cartao-listagem.component.html',
    styleUrls: ['./cartao-listagem.component.css']
})
export class CartaoListagemComponent extends BaseFormComponent implements OnInit, OnDestroy {
    dataInicial;
    dataFinal;
    showLoadingIndicator = true;
    cartoes: CartaoAposta[];

    constructor(
        private fb: UntypedFormBuilder,
        private cd: ChangeDetectorRef,
        private messageService: MessageService,
        private cartaoService: CartaoService,
        private menuFooterService: MenuFooterService
    ) {
        super();
    }

    ngOnInit() {
        if (moment().day() === 0 || moment().day() === 1) {
            const startWeek = moment().startOf('week');
            this.dataInicial = startWeek.subtract(6, 'days');

            if (moment().day() === 0) {
                this.dataFinal = moment();
            } else {
                this.dataFinal = moment().subtract(1, 'days');
            }
        } else {
            this.dataInicial = moment().startOf('week').add('1', 'day');
            this.dataFinal = moment();
        }

        this.createForm();
        this.getCartoes();
        this.menuFooterService.setIsPagina(true);
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            apostador: [''],
            dataInicial: [this.dataInicial.format('YYYY-MM-DD'), Validators.required],
            dataFinal: [this.dataFinal.format('YYYY-MM-DD'), Validators.required]
        });
    }

    submit() {
        this.showLoadingIndicator = !this.showLoadingIndicator;
        this.getCartoes(this.form.value);
    }

    getCartoes(params?) {
        let queryParams: any = {
            'data-inicial': this.dataInicial.format('YYYY-MM-DD'),
            'data-final': this.dataFinal.format('YYYY-MM-DD 23:59:59'),
            'sort': '-id'
        };

        if (params) {
            queryParams = {
                'data-inicial': params.dataInicial,
                'data-final': params.dataFinal,
                'apostador': params.apostador,
                'sort': '-id'
            };
        }

        this.cartaoService.getCartoes(queryParams)
            .subscribe(
                cartoes => {
                    this.cartoes = cartoes;
                    this.showLoadingIndicator = false;
                    this.cd.detectChanges();
                },
                error => this.handleError(error)
            );
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    trackById(index: number, record: any): string {
        return record.id;
    }

}
