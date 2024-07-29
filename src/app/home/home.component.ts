import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import { HomeService } from '../shared/services/home.service';
import { LayoutService } from '../shared/services/utils/layout.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ParametrosLocaisService } from '../services';

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

    widgets = [];

    unsub$ = new Subject();

    constructor(
        private layoutService: LayoutService,
        private casinoApi: CasinoApiService,
        private homeService: HomeService,
        private cd: ChangeDetectorRef,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit(): void {
        this.homeService.getPosicaoWidgets().subscribe(response => {
            this.widgets = response;
        });

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
}
