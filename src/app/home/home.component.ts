import { Component, ElementRef, OnInit, Renderer2, ViewChildren, QueryList } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    @ViewChildren('scrollGames') gamesScroll: QueryList<ElementRef>;
    gamesCassino = [];
    gamesDestaque = [];

    isMobile = false;
    qtdItens = 0;
    modalRef;

    constructor(
        private casinoApi: CasinoApiService,
    ) { }

    ngOnInit(): void {
        this.casinoApi.getGamesList(false).subscribe(response => {
            this.gamesCassino = response.gameList.filter(function(game) {
                return game.dataType !== 'VSB';
            });
            this.gamesDestaque = response.populares;
        }, erro => { console.log(erro) });
    }
}
