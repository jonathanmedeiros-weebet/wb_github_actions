import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';

import { AuthService, HelperService, ParametroService, ImagemInicialService, MessageService, ParametrosLocaisService, UtilsService } from './services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { config } from './shared/config';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CadastroModalComponent } from './shared/layout/modals';
import { LoginModalComponent } from './shared/layout/modals';

import { TranslateService } from '@ngx-translate/core';
import { IdleDetectService } from './shared/services/idle-detect.service';
import { ConfiguracaoLimiteTempoModalComponent } from './shared/layout/modals/configuracao-limite-tempo-modal/configuracao-limite-tempo-modal.component';
import { ActivityDetectService } from './shared/services/activity-detect.service';
declare var xtremepush;
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    @ViewChild('demoModal', { static: true }) demoModal;
    @ViewChild('inicialModal', { static: true }) inicialModal;
    @ViewChild('ativacaoCadastroModal', { static: true }) ativacaoCadastroModal;
    @ViewChild('wrongVersionModal', { static: true }) wrongVersionModal;
    appUrl = 'https://weebet.s3.amazonaws.com/' + config.SLUG + '/app/app.apk?v=' + (new Date()).getTime();
    imagemInicial;
    mobileScreen = false;
    isEmpty = false;
    SLUG;
    TIMESTAMP;
    ativacaoCadastro;
    modoClienteHabilitado;
    whatsapp;
    isDemo = location.host === 'demo.wee.bet';
    isCadastro = false;
    public acceptedCookies: boolean = false;
    modalPush;
    xtremepushHabilitado = false;
    hasPoliticaPrivacidade = false;

    constructor(
        private auth: AuthService,
        private parametroService: ParametroService,
        private paramsLocais: ParametrosLocaisService,
        public modalService: NgbModal,
        private helperService: HelperService,
        private router: Router,
        private imagemInicialService: ImagemInicialService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef,
        private route: ActivatedRoute,
        private paramLocais: ParametrosLocaisService,
        private translate: TranslateService,
        private idleDetectService: IdleDetectService,
        private utilsService: UtilsService,
        private activityDetectService: ActivityDetectService
    ) {
        const linguaEscolhida = localStorage.getItem('linguagem') ?? 'pt';
        translate.setDefaultLang('pt');
        translate.use(linguaEscolhida);
    }

    @HostListener('window:message', ['$event']) onPostMessage(event) {
        switch (event.data.action) {
            case 'printerWidth':
                localStorage.setItem('printer_width', event.data.width);
                break;
            case 'printGraphics':
                localStorage.setItem('print_graphics', event.data.print_graphics);
                break;
            case 'apkVersion':
                localStorage.setItem('apk_version', event.data.version);
                break;
            default:
        }
    }

    ngOnInit() {
        this.route.queryParams
            .subscribe((params) => {
                if (params.token) {
                    this.ativacaoCadastro = true;

                    this.auth.ativacaoCadastro({ token: params.token })
                        .subscribe(
                            (res) => {
                                if (res.valid !== false) {
                                    this.auth.setCookie(res.cookie);
                                    this.modalService.open(
                                        this.ativacaoCadastroModal,
                                        {
                                            ariaLabelledBy: 'modal-basic-title',
                                            windowClass: 'modal-pop-up',
                                            centered: true,
                                        }
                                    );
                                    this.router.navigate(['esportes/futebol']);
                                }
                            },
                            error => this.handleError(error)
                        );
                } else if (this.router.url.includes('/cadastro')) {
                    this.isCadastro = true;
                } else {
                    this.ativacaoCadastro = false;
                }
            });

        this.hasPoliticaPrivacidade = this.paramsLocais.getOpcoes().has_politica_privacidade;
        this.acceptedCookies = localStorage.getItem('accepted_cookies') === 'true';

        this.eventPushXtremepush();

        this.auth.logado.subscribe((isLogged) => {
            const logoutByInactivityIsEnabled = Boolean(this.paramsLocais.getOpcoes()?.logout_by_inactivity)
            const activityUserConfig = Boolean(this.activityDetectService.getActivityTimeConfig());
            const isCliente = this.auth.isCliente();

            if (isLogged && isCliente) {
                this.activityDetectService.getActivityGoalReached().subscribe(() => {
                    this.openModalTimeLimit();
                });
            }

            if (isLogged && isCliente && logoutByInactivityIsEnabled) {
                this.idleDetectService.startTimer(1800000);
            } else {
                this.idleDetectService.stopTimer();
            }

            if (isLogged && isCliente && activityUserConfig) {
                this.activityDetectService.getActivityTimeConfig().subscribe((timeGoal) => {
                    if (timeGoal > 0) {
                        this.activityDetectService.startActivityTimer(this.activityDetectService.HALF_MINUTE_IN_MS);
                    } else {
                        this.activityDetectService.stopActivityTimer();
                    }
                });
            }
        })

        this.idleDetectService
            .watcher()
            .subscribe(isExpired => {
                if (isExpired) {
                    if (this.auth.isLoggedIn()) {
                        this.auth.logout();
                    }
                }
            });

        this.modoClienteHabilitado = this.paramLocais.getOpcoes().modo_cliente;

        if (this.modoClienteHabilitado && this.router.url.includes('/cadastro')) {
            this.modalService.open(CadastroModalComponent, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'md',
                centered: true,
                windowClass: 'modal-500 modal-cadastro-cliente'
            });

            this.router.navigate(['/']);
        }

        if (this.router.url.includes('/login')) {
            this.modalService.open(LoginModalComponent, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'md',
                centered: true,
                windowClass: 'modal-500 modal-cadastro-cliente'
            });

            this.router.navigate(['esportes/futebol']);
        }

        const params = new URLSearchParams(location.search);

        if (params.get('app')) {
            this.auth.setAppMobile();
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

                if (this.isDemo) {
                    this.modalService.open(
                        this.demoModal,
                        {
                            ariaLabelledBy: 'modal-basic-title',
                            windowClass: 'modal-pop-up',
                            centered: true
                        }
                    );
                } else if (!this.isEmpty && this.ativacaoCadastro === false && !this.isCadastro) {
                    let exibirImagemInicial = false;
                    const variavel = localStorage.getItem('imagemInicialData');
                    if (!variavel) {
                        exibirImagemInicial = true;
                        const horario = new Date();
                        localStorage.setItem('imagemInicialData', String(horario));
                    } else {
                        // @ts-ignore
                        const data1 = new Date(variavel);
                        const data2 = new Date();
                        // const data2 = new Date('2022-07-30T03:24:00');
                        const diffTime = dateDiffInDays(data1, data2);
                        if (diffTime > 0) {
                            exibirImagemInicial = true;
                            const horario = Date();
                            localStorage.setItem('imagemInicialData', String(horario));
                        }
                    }

                    if (exibirImagemInicial) {
                        this.modalService.open(
                            this.inicialModal,
                            {
                                centered: true,
                                windowClass: 'modal-pop-up'
                            }
                        );
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

        if (this.paramLocais.getOpcoes().whatsapp) {
            this.whatsapp = this.paramLocais.getOpcoes().whatsapp.replace(/\D/g, '');
        }
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

    public acceptCookies() {
        this.acceptedCookies = true;
        localStorage.setItem('accepted_cookies', 'true');
    }

    eventPushXtremepush() {
        const xtremepushHabilitado = this.paramLocais.getOpcoes().xtremepush_habilitado;
        if (xtremepushHabilitado) {
            xtremepush('event', 'push');
        }
    }

    openModalTimeLimit() {
        this.modalService.open(ConfiguracaoLimiteTempoModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            windowClass: 'modal-pop-up',
            centered: true,
            backdrop: 'static',
        });
    }
}
