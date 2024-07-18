import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CadastroModalComponent, LoginModalComponent } from '../shared/layout/modals';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';
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
    private langs = { pt: 'pt-br', en: 'en' };

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private authService: AuthService,
        private translate: TranslateService,
    ) {
        let node = document.createElement("script");
        node.src = "https://ui.invisiblesport.com/bt-renderer.min.js";
        document.body.prepend(node);
    }

    ngOnInit() {
        setTimeout(() => {
            console.log(this.translate.currentLang);
            let currentLang = this.translate.currentLang;
            this.authService.getTokenBetby().subscribe(
                (res) => {
                    this.betbyInitialize(res.token, currentLang);
                }
            );
        }, 500);

        this.translate.onLangChange.subscribe(
            change => {
                this.onChangeLang(change.lang);
            }
        );
    }

    ngOnDestroy() {
        this.bt.kill();
    }

    onChangeLang(lang: string) {
        if (this.bt) {
            this.bt.kill();
            this.authService.getTokenBetby().subscribe(
                (res) => {
                    this.betbyInitialize(res.token, lang);
                }
            );
        }
    }

    betbyInitialize(token = null, lang = 'pt') {
        let that = this;

        this.bt = new BTRenderer().initialize({
            brand_id: '2415231049618558976',
            token: token ?? null,
            themeName: "get-x",
            lang: this.langs[lang],
            target: document.getElementById('betby'),
            betSlipOffsetTop: 92,
            betslipZIndex: 0,
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
            this.authService.refreshTokenBetby().subscribe(
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
        this.authService.refreshTokenBetby().subscribe(
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
