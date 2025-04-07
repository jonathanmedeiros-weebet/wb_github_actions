import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import { LayoutService } from '../shared/services/utils/layout.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { AccountVerificationService, AuthService, HelperService, MessageService, ParametrosLocaisService } from '../services';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { WidgetService } from '../shared/services/widget.service';

declare function BTRenderer(): void;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{
    @ViewChildren('scrollGames') gamesScroll: QueryList<ElementRef>;
    gamesPopulares = [];
    gamesPopularesAoVivo = [];

    isMobile = false;
    qtdItens = 0;
    modalRef;
    headerHeight = 92;
    liveFootballIsActive: boolean;

    hasFeaturedMatches = true;
    betby = false;

    widgets = [];

    unsub$ = new Subject();

    private bt: any;
    private langs = { pt: 'pt-br', en: 'en', es: 'es' };

    private loggedSubscription: Subscription;
    private accountVerifiedSubscription: Subscription;

    private hasCustomerLoggedIn: boolean = false;
    private accountVerified: boolean = false;

    constructor(
        private messageService: MessageService,
        private helper: HelperService,
        private layoutService: LayoutService,
        private casinoApi: CasinoApiService,
        private widgetService: WidgetService,
        private cd: ChangeDetectorRef,
        private translate: TranslateService,
        private authService: AuthService,
        private paramsService: ParametrosLocaisService,
        private router: Router,
        private accountVerificationService: AccountVerificationService
    ) { }

    ngOnInit(): void {
        let currentLang = this.translate.currentLang;

        this.betby = this.paramsService.getOpcoes().betby;

        this.checkIfHasCustomerLoggedIn();
        this.initAccountVerification();

        if (this.hasCustomerLoggedIn && !this.accountVerified) {
            this.betby = false;
        }

        this.widgetService.byPage('home').subscribe(response => {
            this.widgets = response;
        });

        if (this.betby) {
            this.helper.injectBetbyScript(this.paramsService.getOpcoes().betby_script).then(() => {
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
        }

        this.translate.onLangChange.subscribe(
            change => {
                this.handleChangeLang(change.lang);
            }
        );

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.cd.detectChanges();
            });

        this.liveFootballIsActive = this.paramsService.futebolAoVivoAtivo();
    }

    ngOnDestroy() {
        if (this.bt) {
            this.bt.kill();
        }

        this.loggedSubscription.unsubscribe();
        this.accountVerifiedSubscription.unsubscribe();
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

    changeDisplayFeaturedMatches(hasFeaturedMatches: boolean) {
        this.hasFeaturedMatches = hasFeaturedMatches;
    }

    betbyInitialize(token = null, lang = 'pt-br') {
        let that = this;

        this.bt = new BTRenderer().initialize({
            brand_id: this.paramsService.getOpcoes().betby_brand,
            token: token,
            themeName: this.paramsService.getOpcoes().betby_theme,
            lang: this.langs[lang],
            target: document.getElementById('betby'),
            widgetName: 'promo',
            widgetParams: {
                placeholder: 'operator_page',
                onBannerClick: args => that.handleClickBanner(args)
            }
        });
    }

    handleChangeLang(lang: string) {
        if (this.bt) {
            this.bt.kill();
            this.authService.getTokenBetby(lang).subscribe(
                (res) => {
                    this.betbyInitialize(res.token, lang);
                }
            );
        }
    }

    handleClickBanner(args: any) {
        this.router.navigate(['/sports'], {
            queryParams: { "bt-path": args.url }
        });
    }

    getGameIds(items: Array<any>) {
        return items.map(i => i.item_id)
    }
}
