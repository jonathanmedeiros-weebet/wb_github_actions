import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import { HomeService } from '../shared/services/home.service';
import { LayoutService } from '../shared/services/utils/layout.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService, ParametrosLocaisService } from '../services';
import { TranslateService } from '@ngx-translate/core';

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

    loadingCassino = true;
    loadingCassinoAoVivo = true;

    hasFeaturedMatches = true;
    betby = false;

    widgets = [];

    unsub$ = new Subject();

    private bt: any;
    private langs = { pt: 'pt-br', en: 'en', es: 'es' };

    constructor(
        private layoutService: LayoutService,
        private casinoApi: CasinoApiService,
        private homeService: HomeService,
        private cd: ChangeDetectorRef,
        private translate: TranslateService,
        private authService: AuthService,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit(): void {
        this.homeService.getPosicaoWidgets().subscribe(response => {
            this.widgets = response;
        });

        let currentLang = this.translate.currentLang;
        this.authService.getTokenBetby(currentLang).subscribe(
            (res) => {
                this.betbyInitialize(res.token, currentLang);
            }
        );

        this.translate.onLangChange.subscribe(
            change => {
                this.handleChangeLang(change.lang);
            }
        );

        this.casinoApi.getGamesHome().subscribe(response => {
            this.gamesPopulares = response.populares;
            this.loadingCassino = false;
            this.gamesPopularesAoVivo = response.popularesAoVivo;
            this.loadingCassinoAoVivo = false;
        });

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.cd.detectChanges();
            });

        this.liveFootballIsActive = this.paramsService.futebolAoVivoAtivo();
        this.betby = this.paramsService.getOpcoes().betby;
    }

    ngOnDestroy() {
        if (this.bt) {
            this.bt.kill();
        }
    }

    changeDisplayFeaturedMatches(hasFeaturedMatches: boolean) {
        this.hasFeaturedMatches = hasFeaturedMatches;
    }

    betbyInitialize(token = null, lang = 'pt-br') {
        let that = this;

        this.bt = new BTRenderer().initialize({
            brand_id: '2429614261820076032',
            token: token,
            themeName: 'demo-turquoise-dark-table',
            lang: this.langs[lang],
            target: document.getElementById('betby'),
            widgetName: 'promo',
            widgetParams: {
                placeholder: 'operator_page',
                onBannerClick: args => that.handleClickBanner(args),
                withSportsList: true,
                onSportClick: args => {console.log(args)},
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
        console.log(args);
    }
}
