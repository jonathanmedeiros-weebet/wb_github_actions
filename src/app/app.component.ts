import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from './services';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
    constructor(
        private auth: AuthService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['app'] && !this.auth.isAppMobile()) {
                this.auth.setAppMobile();
            }
        });
    }
}
