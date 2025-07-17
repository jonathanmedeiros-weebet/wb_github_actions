import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../shared/layout/modals';
import { AccountVerificationService, AuthService, HelperService, MessageService, ParametrosLocaisService, LayoutService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositoComponent } from '../clientes/deposito/deposito.component';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../shared/services/login.service';
import { Subscription } from 'rxjs';

declare function BTRenderer(): void;

@Component({
    selector: 'app-betby',
    templateUrl: 'betby.component.html',
    styleUrls: ['betby.component.css'],
})

export class BetbyComponent implements OnInit, AfterViewInit, OnDestroy {
    private resizeObserver: ResizeObserver;
    private loginSubscription: Subscription;
    private bt: any;
    private queryParamsSubscription: any;
    private langs = { pt: 'pt-br', en: 'en', es: 'es' };
    public heightHeader = 92;

    private loggedSubscription: Subscription;
    private accountVerifiedSubscription: Subscription;

    private hasCustomerLoggedIn: boolean = false;
    private accountVerified: boolean = false;

    constructor(
        private helper: HelperService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private translate: TranslateService,
        private params: ParametrosLocaisService,
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private loginService: LoginService,
        private accountVerificationService: AccountVerificationService,
        private layoutService: LayoutService,
        @Inject(DOCUMENT) private document: any
    ) { }

    async ngOnInit() {
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

        this.checkIfHasCustomerLoggedIn();
        this.initAccountVerification();

        if (this.hasCustomerLoggedIn) {
            if (!this.accountVerificationService.terms_accepted.getValue()) {
                const result = await this.accountVerificationService.openModalTermsPromise();
                if (!result && this.accountVerified) {
                    this.accountVerificationService.termAcceptRedirectDefault('/clientes/personal-data');
                    return;
                }
            }

            if (!this.accountVerified) {
                const accountVerificationAlert: NgbModalRef = this.accountVerificationService.openModalAccountVerificationAlert();
                accountVerificationAlert.componentInstance.redirectEvenWhenClosing = true;
                return;
            }
        }

        this.helper.injectBetbyScript(this.params.getOpcoes().betby_script).then(() => {
            this.authService.getTokenBetby(currentLang).subscribe(
                (res) => {
                    this.betbyInitialize(res.token, currentLang);
                },
                (_) => {
                    this.messageService.error(this.translate.instant('geral.erroInesperado').toLowerCase());
                }
            );
        }).catch((_) => {
            this.messageService.error(this.translate.instant('geral.erroInesperado').toLowerCase());
        });

        this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
            if (this.bt && (params['bt-path'] == '/' || params['bt-path'] == '/live')) {
                this.bt.updateOptions({ url: params['bt-path'] });
            }
        });

        this.translate.onLangChange.subscribe(
            change => {
                this.refreshBetby(change.lang);
            }
        );

        this.loginSubscription = this.loginService.event$.subscribe(async () => {
            this.checkIfHasCustomerLoggedIn();
            this.initAccountVerification();

            if (this.hasCustomerLoggedIn) {
                if (!this.accountVerificationService.terms_accepted.getValue()) {
                    const result = await this.accountVerificationService.openModalTermsPromise();

                    if (!result && this.accountVerified) {
                        this.destroyBetbyIFrame();
                        this.accountVerificationService.termAcceptRedirectDefault('/clientes/personal-data');
                        return;
                    }
                }

                if (!this.accountVerified) {
                    this.destroyBetbyIFrame();

                    const accountVerificationAlert: NgbModalRef = this.accountVerificationService.openModalAccountVerificationAlert();
                    accountVerificationAlert.componentInstance.redirectEvenWhenClosing = true;
                    return;
                }
            }

            this.refreshBetby();
        })
    }

    ngAfterViewInit() {
        if (this.hasCustomerLoggedIn && !this.accountVerified) {
            return;
        }

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

        setTimeout(() => {
            this.layoutService.hideLiveChats(this.renderer);
        }, 1200);
    }

    private initAccountVerification() {
        this.accountVerifiedSubscription = this.accountVerificationService
            .accountVerified
            .subscribe((accountVerified) => this.accountVerified = accountVerified);
    }

    private checkIfHasCustomerLoggedIn() {
        this.loggedSubscription = this.authService
            .logado
            .subscribe((hasCustomerLoggedIn) => this.hasCustomerLoggedIn = hasCustomerLoggedIn);
    }

    ngOnDestroy() {
        if (this.hasCustomerLoggedIn && !this.accountVerified) {
            return;
        }

        this.destroyBetbyIFrame();
    }

    refreshBetby(lang: string = null) {
        if (this.bt) {
            const currentLang = lang ?? this.translate.currentLang;
            this.bt.kill();
            this.authService.getTokenBetby(currentLang).subscribe(
                (res) => {
                    this.betbyInitialize(res.token, currentLang);
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
        this.authService
            .refreshTokenBetby(this.translate.currentLang)
            .subscribe(
                () => location.reload(),
                (error) => console.error('ERROR', error)
            )
    }

    openRegister() {
        this.authService.openRegisterV3Modal();
    }

    openLogin() {
        this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-400 modal-h-350 modal-login',
                centered: true,
            }
        );
    }

    async openDeposit() {
        if (window.innerWidth < 1025) {
            if (!this.accountVerificationService.terms_accepted.getValue()) {
                const result = await this.accountVerificationService.openModalTermsPromise();
                if (!result && this.accountVerified) {
                    this.accountVerificationService.termAcceptRedirectDefault('/');
                    return;
                }
            }

            if (!this.accountVerified) {
                this.accountVerificationService.openModalAccountVerificationAlert();
                return;
            }
            this.modalService.open(DepositoComponent);
            this.router.navigate(['/']);
        } else {
            this.router.navigate(['/clientes/deposito']);
        }
    }

    destroyBetbyIFrame() {
        if (this.bt) {
            this.bt.kill();
        }

        if (this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe();
        }

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        this.layoutService.restoreLiveChats(this.renderer);

        if (this.loginSubscription) {
            this.loginSubscription.unsubscribe();
        }
        if (this.loggedSubscription) {
            this.loggedSubscription.unsubscribe();
        }
        if (this.accountVerifiedSubscription) {
            this.accountVerifiedSubscription.unsubscribe();
        }
    }

}
