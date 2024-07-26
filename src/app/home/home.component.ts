import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
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
export class HomeComponent implements OnInit {
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
    betby = true;

    widgets = [];

    unsub$ = new Subject();

    private bt: any;
    private queryParamsSubscription: any;
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
    }

    changeDisplayFeaturedMatches(hasFeaturedMatches: boolean) {
        this.hasFeaturedMatches = hasFeaturedMatches;
    }

    betbyInitialize(token = null, lang = 'pt-br') {
        this.bt = new BTRenderer().initialize({
            brand_id: '2415231049618558976',
            token: token ?? null,
            themeName: "demo-turquoise-dark-table",
            lang: this.langs[lang],
            target: document.getElementById('betby'),
            widgetName: "promo",
            widgetParams: {
                placeholder: "operator_page",
            }
        });
    }
}
