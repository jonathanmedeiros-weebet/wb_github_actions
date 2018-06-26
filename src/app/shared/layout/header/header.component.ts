import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Rx';
import { AuthService } from './../../../services';
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
    usuario = new Usuario();
    LOGO;
    BANCA_NOME;
    appMobile;
    now = moment();

    constructor(
        private router: Router,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.usuario = this.auth.getUser();
        this.LOGO = config.LOGO;
        this.BANCA_NOME = config.BANCA_NOME;
        this.appMobile = this.auth.isAppMobile();
        setInterval(() => this.now = moment(), 1000);

        $('.nav-item').click(() => $('.navbar-toggler:visible').click());
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/auth/login']);
    }

    listPrinters() {
        let message = {
            data: '',
            action: 'listPrinters',
        };

        parent.postMessage(message, 'file://'); //file://
        console.log('listPrinters');
    }

    appVersion() {
        let message = {
            data: '',
            action: 'showVersion',
        };

        parent.postMessage(message, 'file://'); //file://
        console.log('app version');
    }
}
