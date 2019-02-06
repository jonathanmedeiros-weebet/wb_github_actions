import { Component, OnInit } from '@angular/core';

import { AuthService } from './services';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    constructor(
        private auth: AuthService
    ) { }

    ngOnInit() {
        if (location.search.indexOf('app') >= 0) {
            this.auth.setAppMobile();
        }
    }
}
