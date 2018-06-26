import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from './services';
import { config } from './shared/config';

declare var $;

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
    constructor(
        private auth: AuthService,
        private route: ActivatedRoute,
        private titleService: Title
    ) { }

    ngOnInit() {
        this.titleService.setTitle(config.BANCA_NOME);

        let element = document.querySelector('html');
        element.style.setProperty('--background-primario', config.PRIMARY_COLOR);

        this.route.queryParams.subscribe(params => {
            if (params['app'] && !this.auth.isAppMobile()) {
                this.auth.setAppMobile();
            }
        });
    }
}
