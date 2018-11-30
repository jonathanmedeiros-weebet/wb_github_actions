import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AuthService } from './services';
import { config } from './shared/config';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
    constructor(
        private auth: AuthService,
        private titleService: Title
    ) { }

    ngOnInit() {
        this.titleService.setTitle(config.BANCA_NOME);

        if (location.search.indexOf('app') >= 0) {
            this.auth.setAppMobile();
        }

        // const element = document.querySelector('html');
        // element.style.setProperty('--background-primario', config.PRIMARY_COLOR);
        // element.style.setProperty('--background-secundaria', config.SECONDARY_COLOR);
    }
}
