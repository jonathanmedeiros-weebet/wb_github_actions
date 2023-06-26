import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {UntypedFormBuilder} from '@angular/forms';
import {DepositoSaque} from '../../models';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {FinanceiroService} from '../../shared/services/financeiro.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmModalComponent} from '../../shared/layout/modals';
import {result} from 'lodash';
import { SidebarService } from 'src/app/services';

@Component({
    selector: 'app-depositos-saques',
    templateUrl: './depositos-saques.component.html',
    styleUrls: ['./depositos-saques.component.css']
})
export class DepositosSaquesComponent extends BaseFormComponent implements OnInit, OnDestroy {
    showLoading;
    depositosESaques: DepositoSaque[] = [];
    totalSolicitacoes;
    dataInicial;
    dataFinal;
    queryParams;
    modalRef;

    constructor(
        private fb: UntypedFormBuilder,
        private clienteService: ClienteService,
        private financeiroService: FinanceiroService,
        private menuFooterService: MenuFooterService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private sidebarService: SidebarService,
    ) {
        super();
    }

    ngOnInit() {
        this.sidebarService.changeItens({contexto: 'cliente'});

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
        this.messageService.error(error);
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

    cancelarSolicitacaoSaque(solicitacaoSaqueId) {
        this.modalRef = this.modalService.open(ConfirmModalComponent, {centered: true});
        this.modalRef.componentInstance.title = 'Cancelamento';
        this.modalRef.componentInstance.msg = 'Tem certeza que deseja cancelar a solicitação de saque?';

        this.modalRef.result.then(
            () => {
                this.financeiroService.cancelarSolicitacaoSaque(solicitacaoSaqueId)
                    .subscribe(
                        response => {
                            this.messageService.success('Solicitação de Saque Cancelada');
                            this.submit();
                        },
                        error => {
                            this.handleError(error);
                        }
                    );
            }
        );
    }

    exibirCancelarSolicitacaoSaque(depositoSaque) {
        return !depositoSaque.data_pagamento
            && depositoSaque.tipo === 'saque'
            && depositoSaque.status !== 'CANCELADO'
            && depositoSaque.status !== 'REPROVADO'
            && depositoSaque.psp !== 'PRIMEPAG'
            && depositoSaque.psp !== 'SAUTOPAY';
    }
}
