import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService, ParametroService } from './services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    @ViewChild('demoModal', { static: true }) demoModal;
    myVar: string;

    constructor(
        private auth: AuthService,
        private parametroService: ParametroService,
        public modalService: NgbModal,
    ) {
        this.myVar = 'black';
    }

    ngOnInit() {
        document.documentElement.style.setProperty('--header', '#000000');
        document.documentElement.style.setProperty('--foreground-header', '#35cc96');
        document.documentElement.style.setProperty('--sidebar-right', '#1a2226');
        document.documentElement.style.setProperty('--foreground-sidebar-right', '#fff');
        document.documentElement.style.setProperty('--sidebar-left', '#1a2226');
        document.documentElement.style.setProperty('--foreground-sidebar-left', '#fff');
        document.documentElement.style.setProperty('--highlight', '#000000');
        document.documentElement.style.setProperty('--foreground-highlight', '#d2d6de');
        document.documentElement.style.setProperty('--odds', '#2c3b41');
        document.documentElement.style.setProperty('--foreground-odds', '#fff');
        document.documentElement.style.setProperty('--foreground-selected-odds', '#fff');
        document.documentElement.style.setProperty('--selected-event', '#1e282c');
        document.documentElement.style.setProperty('--event-time', '#1e282c');

        if (location.search.indexOf('app') >= 0) {
            this.auth.setAppMobile();
        }

        if (this.auth.isLoggedIn()) {
            this.parametroService.getOdds()
                .subscribe(
                    tiposAposta => {
                        localStorage.setItem('tipos_aposta', JSON.stringify(tiposAposta));
                    },
                    error => {
                        this.auth.logout();
                    }
                );
        }

        if (location.host === 'demo.wee.bet') {
            this.modalService.open(
                this.demoModal,
                {
                    ariaLabelledBy: 'modal-basic-title',
                    centered: true
                }
            );
        }
    }
}
