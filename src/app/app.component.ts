import {ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';

import {AuthService, HelperService, ParametroService, ImagemInicialService, MessageService} from './services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {config} from './shared/config';
import { filter } from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    @ViewChild('demoModal', {static: true}) demoModal;
    @ViewChild('inicialModal', {static: true}) inicialModal;
    @ViewChild('wrongVersionModal', {static: true}) wrongVersionModal;
    appUrl = 'https://weebet.s3.amazonaws.com/' + config.SLUG + '/app/app.apk?v=' + (new Date()).getTime();
    imagemInicial;
    mobileScreen = false;
    isEmpty = false;
    SLUG;
    TIMESTAMP;

    constructor(
        private auth: AuthService,
        private parametroService: ParametroService,
        public modalService: NgbModal,
        private helperService: HelperService,
        private router: Router,
        private imagemInicialService: ImagemInicialService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef,
    ) {
    }

    @HostListener('window:message', ['$event']) onPostMessage(event) {
        switch (event.data.action) {
            case 'printerWidth':
                localStorage.setItem('printer_width', event.data.width);
                break;
            case 'printGraphics':
                localStorage.setItem('print_graphics', event.data.print_graphics);
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

        this.SLUG = config.SLUG;
        this.TIMESTAMP = new Date().getTime();
        this.imagemInicialService.getImagens().subscribe(
            imagem => {
                if (imagem && imagem['src']) {
                    this.imagemInicial = imagem;
                } else {
                    this.isEmpty = true;
                }

                this.cd.markForCheck();

                if (location.host === 'demo.wee.bet') {
                    this.modalService.open(
                        this.demoModal,
                        {
                            ariaLabelledBy: 'modal-basic-title',
                            centered: true
                        }
                    );
                } else if (!this.isEmpty) {
                    const variavel = localStorage.getItem('imagemInicialData');
                    if (!variavel) {
                        this.modalService.open(
                            this.inicialModal,
                            {
                                centered: true,
                                backdrop: 'static'
                            }
                        );
                        const horario = new Date();
                        localStorage.setItem('imagemInicialData', String(horario));
                    } else {
                        // @ts-ignore
                        const data1 = new Date(variavel);
                        const data2 = new Date();
                        // const data2 = new Date('2022-07-30T03:24:00');
                        const diffTime = dateDiffInDays(data1, data2);
                        if (diffTime > 0) {
                            this.modalService.open(
                                this.inicialModal,
                                {
                                    centered: true,
                                    backdrop: 'static'
                                }
                            );
                            const horario = Date();
                            localStorage.setItem('imagemInicialData', String(horario));
                        }
                    }
                }
            },
            error => this.handleError(error)
        );
        this.mobileScreen = window.innerWidth <= 1024;

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

        function dateDiffInDays(a, b) {
            const _MS_PER_DAY = 1000 * 60 * 60 * 24;
            // Discard the time and time-zone information.
            const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

            return Math.floor((utc2 - utc1) / _MS_PER_DAY);
        }

        this.router.events
            .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
            .subscribe(event => {
                let refresh;
                if (event.id === 1 && event.url === event.urlAfterRedirects) {
                    refresh = true;
                } else {
                    refresh = false;
                }
                if (event.id === 1 && refresh === false) {
                    sessionStorage.clear();
                }
            });
    }

    downloadApp() {
        this.helperService.sendExternalUrl(this.appUrl);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
