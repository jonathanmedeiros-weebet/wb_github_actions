import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CadastroModalComponent, LoginModalComponent } from '../shared/layout/modals';
import { AuthService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositoComponent } from '../clientes/deposito/deposito.component';
import { TranslateService } from '@ngx-translate/core';

declare function BTRenderer(): void;

@Component({
    selector: 'app-betby',
    templateUrl: 'betby.component.html',
    styleUrls: ['betby.component.css'],
})

export class BetbyComponent implements OnInit, OnDestroy {

    private bt: any;
    private queryParamsSubscription: any;
    private langs = { pt: 'pt-br', en: 'en', es: 'es' };
    private heightHeader = 92;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private translate: TranslateService,
    ) { }

    ngOnInit() {

        if (window.innerWidth <= 1280) {
            this.heightHeader = 103;
        }

        let currentLang = this.translate.currentLang;
        this.authService.getTokenBetby(currentLang).subscribe(
            (res) => {
                this.betbyInitialize(res.token, currentLang);
            } ,
            (error) => {
                console.log(error)
            }
        );

        this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
            if (this.bt) {
                this.bt.updateOptions({url: params['bt-path']});
            }
        });

        this.translate.onLangChange.subscribe(
            change => {
                this.onChangeLang(change.lang);
            }
        );
    }

    ngOnDestroy() {
        if (this.bt) {
            this.bt.kill();
        }
        if (this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe();
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
            brand_id: '2429614261820076032',
            token: token ?? null,
            themeName: "demo-turquoise-dark-table",
            lang: this.langs[lang],
            target: document.getElementById('betby'),
            betSlipOffsetTop: this.heightHeader,
            stickyTop: this.heightHeader,
            betslipZIndex: 95,
            onTokenExpired: () => that.refreshTokenExpired(),
            onRouteChange: (path: string) => console.log('PATH', path),
            onLogin: () => that.openLogin(),
            onRegister: () => that.openRegister(),
            onRecharge: () => that.openDeposit(),
            onSessionRefresh: () => that.refreshSession(),
            onBetSlipStateChange: () => console.log('CHANGE STATE')
        });
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
