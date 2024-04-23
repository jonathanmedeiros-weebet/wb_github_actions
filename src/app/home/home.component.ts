import { Component, ElementRef, OnInit, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import { HomeService } from '../shared/services/home.service';

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

    loadingCassino = true;
    loadingCassinoAoVivo = true;

    widgets = [];

    constructor(
        private casinoApi: CasinoApiService,
        private homeService: HomeService
    ) { }

    ngOnInit(): void {
        this.homeService.getPosicaoWidgets().subscribe(response => {
            this.widgets = response
        });

        this.casinoApi.getGamesHome().subscribe(response => {
            this.gamesPopulares = response.populares;
            this.loadingCassino = false;
            this.gamesPopularesAoVivo = response.popularesAoVivo;
            this.loadingCassinoAoVivo = false;
        });
    }
}
