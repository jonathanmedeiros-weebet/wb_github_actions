import {Component, HostListener, OnInit, ViewChild} from '@angular/core';

import {AuthService, HelperService, ParametroService} from './services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {config} from './shared/config';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    @ViewChild('demoModal', {static: true}) demoModal;
    @ViewChild('wrongVersionModal', {static: true}) wrongVersionModal;
    appUrl = 'https://weebet.s3.amazonaws.com/' + config.SLUG + '/app/app.apk?v=' + (new Date()).getTime();

    constructor(
        private auth: AuthService,
        private parametroService: ParametroService,
        public modalService: NgbModal,
        private helperService: HelperService
    ) {
    }

    @HostListener('window:message', ['$event']) onPostMessage(event) {
        switch (event.data.action) {
            case 'printerWidth':
                localStorage.setItem('printer_width', event.data.width);
                console.log('Printer Width set to ' + event.data.width);
                break;
            case 'printGraphics':
                localStorage.setItem('print_graphics', event.data.print_graphics);
                console.log(`Print Graphics set to ${event.data.print_graphics == '1'}`);
                break;
            default:
        }
    }

    ngOnInit() {
        if (location.search.indexOf('app') >= 0) {
            this.auth.setAppMobile();
            const params = new URLSearchParams(location.search);
            const appVersion = params.get('app_version') ? parseInt(params.get('app_version'), 10) : null;
            localStorage.setItem('app_version', String(appVersion));
            if (appVersion < 2) {
                this.modalService.open(
                    this.wrongVersionModal,
                    {
                        ariaLabelledBy: 'modal-basic-title-wrong-version',
                        centered: true,
                        backdrop: 'static'
                    }
                );
            }
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

    downloadApp() {
        this.helperService.sendExternalUrl(this.appUrl);
    }
}
