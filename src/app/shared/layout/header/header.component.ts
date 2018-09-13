import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../base-form/base-form.component';
import { AuthService, MessageService, ParametroService } from './../../../services';
import { Usuario } from './../../../models';
import { config } from './../../config';

import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent extends BaseFormComponent implements OnInit, OnDestroy {
    posicaoFinanceira = {
        saldo: 0,
        credito: 0
    };
    usuario = new Usuario();
    isLoggedIn = false;
    LOGO;
    BANCA_NOME;
    appMobile;
    now = moment();
    unsub$ = new Subject();

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private parametroService: ParametroService,
        private auth: AuthService
    ) {
        super();
    }

    ngOnInit() {
        setInterval(() => this.now = moment(), 1000);

        this.LOGO = config.LOGO;
        this.BANCA_NOME = config.BANCA_NOME;
        this.appMobile = this.auth.isAppMobile();

        this.getUsuario();
        this.createForm();

        $('.nav-item').click(() => $('.navbar-toggler:visible').click());
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            username: ['', Validators.compose([Validators.required])],
            password: [
                '',
                Validators.compose([Validators.required, Validators.minLength(2)])
            ]
        });
    }

    submit() {
        this.auth.login(this.form.value)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                () => this.getUsuario(),
                error => this.handleError(error)
            );
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    logout() {
        this.auth.logout();
        this.getUsuario();
        this.atualizarTiposAposta();
    }

    getUsuario() {
        this.usuario = this.auth.getUser();
        this.isLoggedIn = this.auth.isLoggedIn();
    }

    atualizarTiposAposta() {
        this.parametroService.getParametros().subscribe(
            parametros => {
                localStorage.setItem('tipos-aposta', JSON.stringify(parametros['tipos-aposta']));
            },
            error => this.messageService.error(error)
        );
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
        if (this.isLoggedIn) {
            this.auth.getPosicaoFinanceira().subscribe(
                posicaoFinanceira => this.posicaoFinanceira = posicaoFinanceira,
                error => this.handleError(error)
            );
        }
    }
}
