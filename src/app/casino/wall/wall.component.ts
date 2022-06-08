import { Component, OnInit } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import {AuthService} from './../../services';
import { interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-wall',
    templateUrl: './wall.component.html',
    styleUrls: ['./wall.component.css']
})
export class WallComponent implements OnInit {

    showLoadingIndicator = true;
    isCliente;
    isLoggedIn;
    gameType: string;
    private sub: any;

    public gameList: [];
    public gameAllList: [];
    public gameSlotList: [];
    public gameRoletaList: [];
    public gameMesaList: [];

    constructor(
        private casinoApi: CasinoApiService,
        private auth: AuthService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.casinoApi.getGamesList().subscribe(response => {
            this.filterGame(response.gameList);
            this.sub = this.route.params.subscribe(params => {
                this.gameType = params['game_type'];
                if (this.gameType === 'slot') {
                    this.showSlot();
                } else if (this.gameType === 'roleta') {
                    this.showRoulette();
                } else if (this.gameType === 'mesa') {
                    this.showMesa();
                } else {
                   this.showAll();
                }
            });
            interval(2000)
                .subscribe(() => {
                    this.showLoadingIndicator = false;
                });
        }, erro => {});
        this.auth.logado
            .subscribe(
                isLoggedIn => {
                    this.isLoggedIn = isLoggedIn;
                }
            );

        this.auth.cliente
            .subscribe(
                isCliente => {
                    this.isCliente = isCliente;
                }
            );
    }

    filterGame(games) {
        this.gameSlotList = games.filter(function(game) {
            return game.gameTypeID === 'vs' || game.gameTypeID === 'sc';
        });
        this.gameRoletaList = games.filter(function(game) {
            return game.gameTypeID === 'rl'; //Roleta
        });
        this.gameMesaList = games.filter(function(game) {
            return game.gameTypeID === 'vp' || game.gameTypeID === 'bj' || game.gameTypeID === 'bc';
        });
        this.gameAllList = games;
    }

    getGamesList() {
        return this.gameList;
    }

    showAll() {
        this.gameList = this.gameAllList;
    }

    showSlot() {
        this.gameList = this.gameSlotList;
    }

    showRoulette() {
        this.gameList = this.gameRoletaList;
    }

    showMesa() {
        this.gameList = this.gameMesaList;
    }

    // showLiveGames() {
    //     this.gameList = this.gameLgList;
    // }
}
