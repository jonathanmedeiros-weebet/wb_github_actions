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

        if(location.search.indexOf('app') >= 0) {
            this.auth.setAppMobile();
        }

        let element = document.querySelector('html');
        element.style.setProperty('--background-primario', config.PRIMARY_COLOR);
    }
}
