import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.spinner.show();
        this.titleService.setTitle(config.BANCA_NOME);

        if (location.search.indexOf('app') >= 0) {
            this.auth.setAppMobile();
        }

        this.parametroService.getParametros().subscribe(
            parametros => {
                localStorage.setItem('cotacoes_locais', JSON.stringify(parametros['cotacoes_local']));
                localStorage.setItem('campeonatos_bloqueados', JSON.stringify(parametros['campeonatos_bloqueados']));
                localStorage.setItem('tipos_aposta', JSON.stringify(parametros['tipos_aposta']));
                localStorage.setItem('opcoes', JSON.stringify(parametros['opcoes']));

                this.spinner.hide();

                if (this.router.url === '/' || this.router.url === '/?app=TRUE') {
                    this.router.navigate(['/esportes/futebol/jogos']);
                }
            }
        );
    }
}
