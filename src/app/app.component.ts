import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthService, ParametroService } from './services';
import { config } from './shared/config';
import { NgxSpinnerService } from 'ngx-spinner';

import { ParametrosLocais } from './shared/utils/parametros-locais';
declare var WB: any;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    loading = true;

    constructor(
        private auth: AuthService,
        private titleService: Title,
        private parametroService: ParametroService,
        private router: Router,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.spinner.show();
        this.titleService.setTitle(config.BANCA_NOME);
        const versaoLocal = localStorage.getItem('versao');

        if (parseFloat(versaoLocal) !== config.VERSAO) {
            this.auth.limparStorage();
            localStorage.setItem('versao', config.VERSAO);
        }

        if (location.search.indexOf('app') >= 0) {
            this.auth.setAppMobile();
        }

        this.parametroService.atualizarParametros(ParametrosLocais.getParametrosLocais());

        this.spinner.hide();
    }

    getParametros(fn) {
        this.parametroService.getParametros().subscribe(
            fn,
            error => {
                console.log(error);
                if (error === 'Expired token') {
                    this.auth.logout();
                }
            }
        );
    }
}
