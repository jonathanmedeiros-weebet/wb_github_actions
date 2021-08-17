import {Component, HostListener, OnInit, ViewChild} from '@angular/core';

import {AuthService, ImagensService, ParametroService} from './services';
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
        private imagensService: ImagensService
    ) {
    }

    @HostListener('window:message', ['$event']) onPostMessage(event) {
        console.log('recebido  do app');
        switch (event.data.action) {
            case 'printerWidth':
                localStorage.setItem('printer_width', event.data.width);
                console.log('Tamanho Recebido: ' + event.data.width);
                break;
            default:
                //
        }
    }

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

        this.imagensService.buscarLogo()
            .subscribe(
                logo => localStorage.setItem('logo', `data:image/png;base64,${logo}`)
            );

        this.imagensService.buscarLogoBilhete()
            .subscribe(
                logoBilhete => localStorage.setItem('logo_bilhete', `data:image/png;base64,${logoBilhete}`)
            );
    }
}
