import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService, ParametroService } from './services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    @ViewChild('demoModal', { static: true }) demoModal;

    constructor(
        private auth: AuthService,
        private parametroService: ParametroService,
        public modalService: NgbModal,
    ) { }

    ngOnInit() {
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
