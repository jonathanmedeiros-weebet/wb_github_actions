import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { ConfirmModalComponent } from '../../shared/layout/modals';
import {MessageService, CartaoService, MenuFooterService} from './../../services';
import moment from 'moment';

@Component({
    selector: 'app-cartao-solicitacoes-saque',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './cartao-solicitacoes-saque.component.html',
    styleUrls: ['./cartao-solicitacoes-saque.component.css']
})
export class CartaoSolicitacoesSaqueComponent extends BaseFormComponent implements OnInit, OnDestroy {
    dataInicial;
    dataFinal;
    showLoadingIndicator = true;
    solicitacoes: any[];
    modalRef;

    constructor(
        private fb: UntypedFormBuilder,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
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
        this.getSolicitacoesSaque();
        this.menuFooterService.setIsPagina(true);
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            dataInicial: [this.dataInicial.format('YYYY-MM-DD'), Validators.required],
            dataFinal: [this.dataFinal.format('YYYY-MM-DD'), Validators.required],
            aprovado: ['1']
        });
    }

    submit() {
        this.showLoadingIndicator = !this.showLoadingIndicator;
        this.getSolicitacoesSaque(this.form.value);
    }

    getSolicitacoesSaque(params?) {
        let queryParams: any = {
            'data-inicial': this.dataInicial.format('YYYY-MM-DD'),
            'data-final': this.dataFinal.format('YYYY-MM-DD 23:59:59'),
            'aprovado': 1
        };

        if (params) {
            queryParams = {
                'data-inicial': params.dataInicial,
                'data-final': params.dataFinal,
                'aprovado': params.aprovado
            };
        }

        this.cartaoService.getSolicitacoesSaque(queryParams)
            .subscribe(
                solicitacoes => {
                    this.solicitacoes = solicitacoes;
                    this.showLoadingIndicator = false;
                    this.cd.detectChanges();
                },
                error => this.handleError(error)
            );
    }

    setPagamento(solicitacao) {
        this.modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
        this.modalRef.componentInstance.title = 'Pagamento';
        this.modalRef.componentInstance.msg = 'Tem certeza que deseja confirma o pagamento?';

        this.modalRef.result.then(
            (result) => {
                this.cartaoService.setPagamento({ id: solicitacao.id, version: solicitacao.version })
                    .subscribe(
                        () => {
                            this.messageService.success('PAGAMENTO REGISTRADO COM SUCESSO!');
                            this.getSolicitacoesSaque(this.form.value);
                        },
                        error => this.handleError(error)
                    );
            },
            (reason) => { }
        );
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    trackById(index: number, record: any): string {
        return record.id;
    }
}
