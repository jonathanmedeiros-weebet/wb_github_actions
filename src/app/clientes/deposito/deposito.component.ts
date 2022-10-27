import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { SidebarService, FinanceiroService, MessageService } from 'src/app/services';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';

@Component({
    selector: 'app-deposito',
    templateUrl: './deposito.component.html',
    styleUrls: ['./deposito.component.css']
})
export class DepositoComponent implements OnInit, OnDestroy {
    whatsapp;
    hasApiPagamentos;
    modalidade;

    depositos = [];

    constructor(
        private paramsLocais: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private siderbarService: SidebarService,
        private financeiroService: FinanceiroService,
        private messageService: MessageService,
    ) {
    }

    ngOnInit() {
        this.siderbarService.changeItens({contexto: 'cliente'});

        if (this.paramsLocais.getOpcoes().whatsapp) {
            this.whatsapp = this.paramsLocais.getOpcoes().whatsapp.replace(/\D/g, '');
        }
        this.hasApiPagamentos = this.paramsLocais.getOpcoes().api_pagamentos;

        if (!this.hasApiPagamentos && this.whatsapp) {
            this.modalidade = "whatsapp";
        } else {
            this.modalidade = 'pix';
        }

        const queryParams: any = {
            'periodo': '',
            'tipo':  'depositos',
        };
        this.financeiroService.getDepositosSaques(queryParams)
            .subscribe(
                response => {
                    this.depositos = response;
                },
                error => {
                    this.handleError(error);
                }
            );

        this.menuFooterService.setIsPagina(true);
    }

    selecionarModalidade(modalide) {
        this.modalidade = modalide;
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
