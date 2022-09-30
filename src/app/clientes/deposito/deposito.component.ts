import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {MenuFooterService} from "../../shared/services/utils/menu-footer.service";

@Component({
    selector: 'app-deposito',
    templateUrl: './deposito.component.html',
    styleUrls: ['./deposito.component.css']
})
export class DepositoComponent implements OnInit, OnDestroy {
    whatsapp;
    hasApiPagamentos;
    modalidade;

    constructor(
        private paramsLocais: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
    ) {
    }

    ngOnInit() {
        if (this.paramsLocais.getOpcoes().whatsapp) {
            this.whatsapp = this.paramsLocais.getOpcoes().whatsapp.replace(/\D/g, '');
        }
        this.hasApiPagamentos = this.paramsLocais.getOpcoes().api_pagamentos;

        if (!this.hasApiPagamentos && this.whatsapp) {
            this.modalidade = "whatsapp";
        } else {
            this.modalidade = "pix";
        }

        this.menuFooterService.setIsPagina(true);
    }

    selecionarModalide(modalide){
        this.modalidade = modalide;
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }
}
