import {ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';

import {AuthService, HelperService, ParametroService, ImagemInicialService, MessageService, ParametrosLocaisService} from './services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {config} from './shared/config';
import { filter } from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CadastroModalComponent} from './shared/layout/modals';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    @ViewChild('demoModal', {static: true}) demoModal;
    @ViewChild('inicialModal', {static: true}) inicialModal;
    @ViewChild('ativacaoCadastroModal', {static: true}) ativacaoCadastroModal;
    @ViewChild('wrongVersionModal', {static: true}) wrongVersionModal;
    appUrl = 'https://weebet.s3.amazonaws.com/' + config.SLUG + '/app/app.apk?v=' + (new Date()).getTime();
    imagemInicial;
    mobileScreen = false;
    isEmpty = false;
    SLUG;
    TIMESTAMP;
    ativacaoCadastro;
    modoClienteHabilitado;

    constructor(
        private auth: AuthService,
        private parametroService: ParametroService,
        public modalService: NgbModal,
        private helperService: HelperService,
        private router: Router,
        private imagemInicialService: ImagemInicialService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef,
        private route: ActivatedRoute,
        private paramLocais: ParametrosLocaisService
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
        this.modoClienteHabilitado = this.paramLocais.getOpcoes().modo_cliente;
        this.route.queryParams
            .subscribe((params) => {
                if (this.modoClienteHabilitado && params.afiliado) {
                    this.modalService.open(CadastroModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        size: 'lg',
                        centered: true,
                        windowClass: 'modal-700'
                    });
                } else if (params.token) {
                    this.ativacaoCadastro = true;
                    this.auth.ativacaoCadastro({token: params.token})
                        .subscribe(
                            (res) => {
                                if (res.valid !== false) {
                                    this.auth.setCookie(res.cookie);
                                    this.modalService.open(
                                        this.ativacaoCadastroModal,
                                        {
                                            centered: true,
                                            backdrop: 'static'
                                        }
                                    );
                                    this.router.navigate(['esportes/futebol']);
                                }
                            },
                            error => this.handleError(error)
                        );
                } else {
                    this.ativacaoCadastro = false;
                }
            });
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
                    } else if (!this.isEmpty && this.ativacaoCadastro === false) {
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
                        if (!this.auth.isCliente()) {
                            this.appendGoogleAnalyticsScripts();
                        }
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

    private appendGoogleAnalyticsScripts() {
        const head = document.getElementsByTagName('head')[0];
        const body = document.getElementsByTagName('body')[0];

        const cambistaAnalyticsHeadScript = document.createElement('script');
        cambistaAnalyticsHeadScript.append('(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start": new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","GTM-PC2GRL8");');

        const cambistaAnalyticsBodyScript = document.createElement('noscript');
        cambistaAnalyticsBodyScript.append('<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PC2GRL8" height="0" width="0" style="display:none;visibility:hidden"></iframe>');

        head.appendChild(cambistaAnalyticsHeadScript);
        body.appendChild(cambistaAnalyticsBodyScript);
    }
}
