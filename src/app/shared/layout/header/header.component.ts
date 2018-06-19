import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Rx';
import { AuthService } from './../../../services';
import { Usuario } from './../../../models';
import { config } from './../../config';

import * as moment from 'moment';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit {
    usuario = new Usuario();
    LOGO;
    BANCA_NOME;
    now = moment();

    constructor(private router: Router, private auth: AuthService) { }

    ngOnInit() {
        this.usuario = this.auth.getUser();
        this.LOGO = config.LOGO;
        this.BANCA_NOME = config.BANCA_NOME;

        setInterval(() => this.now = moment(), 1000);
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/auth/login']);
    }
}
