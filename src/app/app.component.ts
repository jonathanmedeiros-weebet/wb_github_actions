import { Component, OnInit } from '@angular/core';

import { AuthService, ParametroService } from './services';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    constructor(
        private auth: AuthService,
        private parametroService: ParametroService
    ) { }

    ngOnInit() {
        if (location.search.indexOf('app') >= 0) {
            this.auth.setAppMobile();
        }

        if (this.auth.isLoggedIn()) {
            this.parametroService.getOdds()
                .subscribe(
                    tiposAposta => {
                        localStorage.setItem('tipos_aposta', JSON.stringify(tiposAposta))
                    }
                );
        }
    }
}
