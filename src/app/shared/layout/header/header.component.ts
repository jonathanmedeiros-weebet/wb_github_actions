import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, MessageService } from './../../../services';
import { Usuario } from './../../../models';
import { config } from './../../config';

import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit {
    posicaoFinanceira = {
        saldo: 0,
        credito: 0
    };
    usuario = new Usuario();
    LOGO;
    BANCA_NOME;
    appMobile;
    now = moment();

    constructor(
        private messageService: MessageService,
        private router: Router,
        private auth: AuthService
    ) { }

    ngOnInit() {
        setInterval(() => this.now = moment(), 1000);

        this.usuario = this.auth.getUser();
        this.LOGO = config.LOGO;
        this.BANCA_NOME = config.BANCA_NOME;
        this.appMobile = this.auth.isAppMobile();

        $('.nav-item').click(() => $('.navbar-toggler:visible').click());
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/auth/login']);
    }

    listPrinters() {
        const message = {
            data: '',
            action: 'listPrinters',
        };

        parent.postMessage(message, 'file://'); // file://
        console.log('listPrinters');
    }

    appVersion() {
        const message = {
            data: '',
            action: 'showVersion',
        };

        parent.postMessage(message, 'file://'); // file://
        console.log('app version');
    }

    getPosicaoFinanceira(event) {
        this.auth.getPosicaoFinanceira().subscribe(
            posicaoFinanceira => this.posicaoFinanceira = posicaoFinanceira,
            error => this.handleError(error)
        );
    }
}
