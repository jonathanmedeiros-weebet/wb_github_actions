import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthService, ParametroService } from './services';
import { config } from './shared/config';
import { NgxSpinnerService } from 'ngx-spinner';

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

        this.getParametros(parametros => {
            localStorage.setItem('cotacoes_locais', JSON.stringify(parametros['cotacoes_local']));
            localStorage.setItem('campeonatos_aovivo', JSON.stringify(parametros['campeonatos_aovivo']));
            localStorage.setItem('campeonatos_bloqueados', JSON.stringify(parametros['campeonatos_bloqueados']));
            localStorage.setItem('campeonatos_principais', JSON.stringify(parametros['campeonatos_principais']));
            localStorage.setItem('jogos_bloqueados', JSON.stringify(parametros['jogos_bloqueados']));
            localStorage.setItem('odds_principais', JSON.stringify(parametros['odds_principais']));
            localStorage.setItem('tipos_aposta', JSON.stringify(parametros['tipos_aposta']));
            localStorage.setItem('opcoes', JSON.stringify(parametros['opcoes']));

            this.spinner.hide();

            this.parametroService.atualizarParametros(parametros);

            if (window.location.pathname === '/' || window.location.pathname === '/?app=TRUE') {
                this.router.navigate(['/esportes/futebol/jogos']);
            }
        });

        setInterval(() => {
            this.getParametros(parametros => {
                localStorage.setItem('cotacoes_locais', JSON.stringify(parametros['cotacoes_local']));
                localStorage.setItem('campeonatos_aovivo', JSON.stringify(parametros['campeonatos_aovivo']));
                localStorage.setItem('campeonatos_bloqueados', JSON.stringify(parametros['campeonatos_bloqueados']));
                localStorage.setItem('campeonatos_principais', JSON.stringify(parametros['campeonatos_principais']));
                localStorage.setItem('jogos_bloqueados', JSON.stringify(parametros['jogos_bloqueados']));
                localStorage.setItem('odds_principais', JSON.stringify(parametros['odds_principais']));
                localStorage.setItem('tipos_aposta', JSON.stringify(parametros['tipos_aposta']));
                localStorage.setItem('opcoes', JSON.stringify(parametros['opcoes']));
            });
        }, 300000);
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
