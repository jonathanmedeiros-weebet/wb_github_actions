import { Component, ElementRef, OnInit, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';

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

    constructor(
        private casinoApi: CasinoApiService,
    ) { }

    ngOnInit(): void {
        this.casinoApi.getGamesHome().subscribe(response => {
            this.gamesPopulares = response.populares;
            this.gamesPopularesAoVivo = response.popularesAoVivo;
        }, erro => { console.log(erro) });
    }
}
