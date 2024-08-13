import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CadastroModalComponent, LoginModalComponent } from '../shared/layout/modals';
import { AuthService, HelperService, MessageService, ParametrosLocaisService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositoComponent } from '../clientes/deposito/deposito.component';
import { TranslateService } from '@ngx-translate/core';

declare function BTRenderer(): void;

@Component({
    selector: 'app-betby',
    templateUrl: 'betby.component.html',
    styleUrls: ['betby.component.css'],
})

export class BetbyComponent implements OnInit, AfterViewInit, OnDestroy {
    private resizeObserver: ResizeObserver;
    private bt: any;
    private queryParamsSubscription: any;
    private langs = { pt: 'pt-br', en: 'en', es: 'es' };
    public heightHeader = 92;

    constructor(
        private helper: HelperService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private translate: TranslateService,
        private params: ParametrosLocaisService,
        private elementRef: ElementRef
    ) { }

    ngOnInit() {
        let currentLang = this.translate.currentLang;

        if (window.innerWidth <= 1280) {
            this.heightHeader = 103;
        }

        if (this.params.getOpcoes().indique_ganhe_habilitado) {
            this.heightHeader = 129;
            if (window.innerWidth <= 1280) {
                this.heightHeader = 140;
            }
        }

        this.helper.injectBetbyScript(this.params.getOpcoes().betby_script).then(() => {
            this.authService.getTokenBetby(currentLang).subscribe(
                (res) => {
                    this.betbyInitialize(res.token, currentLang);
                } ,
                (_) => {
                    this.messageService.error(this.translate.instant('geral.erroInesperado').toLowerCase());
                }
            );
        }).catch((_) => {
            this.messageService.error(this.translate.instant('geral.erroInesperado').toLowerCase());
        });

        this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
            if (this.bt && (params['bt-path'] == '/' || params['bt-path'] == '/live')) {
                this.bt.updateOptions({url: params['bt-path']})
            }
        });

        this.translate.onLangChange.subscribe(
            change => {
                this.onChangeLang(change.lang);
            }
        );
    }

    ngAfterViewInit() {
        const divElement = this.elementRef.nativeElement.querySelector('app-header');

        this.resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                this.heightHeader = entry.contentRect.height;
                if (this.bt) {
                    this.bt.updateOptions({
                        betSlipOffsetTop: this.heightHeader,
                        stickyTop: this.heightHeader
                    });
                }
            }
        });

        this.resizeObserver.observe(divElement);
    }

    ngOnDestroy() {
        if (this.bt) {
            this.bt.kill();
        }
        if (this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe();
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    onChangeLang(lang: string) {
        if (this.bt) {
            this.bt.kill();
            this.authService.getTokenBetby(lang).subscribe(
                (res) => {
                    this.betbyInitialize(res.token, lang);
                }
            );
        }
    }

    betbyInitialize(token = null, lang = 'pt') {
        let that = this;

        this.bt = new BTRenderer().initialize({
            brand_id: this.params.getOpcoes().betby_brand,
            token: token ?? null,
            themeName: this.params.getOpcoes().betby_theme,
            lang: this.langs[lang],
            target: document.getElementById('betby'),
            betSlipOffsetTop: this.heightHeader,
            stickyTop: this.heightHeader,
            betslipZIndex: 95,
            onTokenExpired: () => that.refreshTokenExpired(),
            onLogin: () => that.openLogin(),
            onRegister: () => that.openRegister(),
            onRecharge: () => that.openDeposit(),
            onSessionRefresh: () => that.refreshSession()
        });
    }

    handleChangeSection(url: string) {
        this.router.navigateByUrl(`/sports${url}`, { skipLocationChange: true });
    }

    refreshTokenExpired() {
        return new Promise((resolve, reject) => {
            this.authService.refreshTokenBetby(this.translate.currentLang).subscribe(
                (res) => {
                    if (res.refresh) {
                        resolve(res.token);
                    } else {
                        reject(new Error('Token not expired!'));
                    }
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    refreshSession() {
        this.authService.refreshTokenBetby(this.translate.currentLang).subscribe(
            (response) => {
                location.reload();
            },
            (error) => {
                console.log('ERROR', error);
            }
        )
    }

    openRegister() {
        this.modalService.open(
            CadastroModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'md',
                centered: true,
                windowClass: 'modal-500 modal-cadastro-cliente'
            }
        );
    }

    openLogin() {
        this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350 modal-login',
                centered: true,
            }
        );
    }

    openDeposit() {
        if (window.innerWidth < 1025) {
            this.modalService.open(DepositoComponent);
            this.router.navigate(['/']);
        } else {
            this.router.navigate(['/clientes/deposito']);
        }
    }
}
