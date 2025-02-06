import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../shared/layout/modals';
import { AuthService, HelperService, MessageService, ParametrosLocaisService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositoComponent } from '../clientes/deposito/deposito.component';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../shared/services/login.service';
import { Subscription } from 'rxjs';
import { RegisterModalComponentComponent } from '../shared/layout/modals/register-modal/register-modal-component/register-modal-component.component';

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
        @Inject(DOCUMENT) private document: any
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

        const zendeskChat = this.document.querySelector('iframe#launcher');
        if (zendeskChat) {
            this.renderer.setStyle(zendeskChat, 'display', 'none');
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

        this.loginSubscription = this.loginService.event$.subscribe(() => {
            this.refreshBetby();
        })
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

        setTimeout(() => {
            this.hideGtmElements();
        }, 1200);
    }

    hideGtmElements() {
        const elementChat = document.querySelector('#chat-widget-container');
        const elementChatWeebet = document.querySelector('.botao-contato-flutuante');
        const elementChatJivo = document.querySelector('#jivo_custom_widget');
        const elementChatIntercom = document.querySelector('#intercom-container');
        const elementChatIntercomLight = document.querySelector('.intercom-lightweight-app');

        if (elementChat) {
            this.renderer.setStyle(elementChat, 'display', 'none');
        }

        if (elementChatWeebet) {
            this.renderer.setStyle(elementChatWeebet, 'display', 'none');
        }

        if (elementChatJivo) {
            this.renderer.setStyle(elementChatJivo, 'display', 'none');
        }

        if (elementChatIntercom) {
            this.renderer.setStyle(elementChatIntercom, 'display', 'none');
        }

        if (elementChatIntercomLight) {
            this.renderer.setStyle(elementChatIntercomLight, 'display', 'none');
        }
    }

    showGtmElements() {
        const elementChat = document.querySelector('#chat-widget-container');
        const elementChatWeebet = document.querySelector('.botao-contato-flutuante');
        const elementChatJivo = document.querySelector('#jivo_custom_widget');
        const elementChatIntercom = document.querySelector('#intercom-container');
        const elementChatIntercomLight = document.querySelector('.intercom-lightweight-app');

        if (elementChat) {
            this.renderer.removeStyle(elementChat, 'display');
        }

        if (elementChatWeebet) {
            this.renderer.removeStyle(elementChatWeebet, 'display');
        }

        if (elementChatJivo) {
            this.renderer.removeStyle(elementChatJivo, 'display');
        }

        if (elementChatIntercom) {
            this.renderer.removeStyle(elementChatIntercom, 'display');
        }

        if (elementChatIntercomLight) {
            this.renderer.removeStyle(elementChatIntercomLight, 'display');
        }
    }

    ngOnDestroy() {
        const zendeskChat = this.document.querySelector('iframe#launcher');
        if (zendeskChat) {
            this.renderer.setStyle(zendeskChat, 'display', 'block');
        }

        if (this.bt) {
            this.bt.kill();
        }
        if (this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe();
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        this.showGtmElements();
        this.loginSubscription.unsubscribe();
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
            RegisterModalComponentComponent,
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
