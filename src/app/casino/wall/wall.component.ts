import { Component, OnInit } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import {AuthService} from './../../services';
import { interval } from 'rxjs';


@Component({
    selector: 'app-wall',
    templateUrl: './wall.component.html',
    styleUrls: ['./wall.component.css']
})
export class WallComponent implements OnInit {

    showLoadingIndicator = true;
    isCliente;
    isLoggedIn;

    public gameList:[];
    public gameAllList:[];
    public gameVsList:[];
    public gameRlList:[];
    public gameVpList:[];

    constructor(
        private casinoApi: CasinoApiService,
        private auth: AuthService,
    ) { }

    ngOnInit(): void {
        let t = this;
        this.casinoApi.getGamesList().subscribe(response => {
            console.log('load games');
            t.gameList = response.gameList;
            this.filterGame(response.gameList);
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

    filterGame(games){
        this.gameVsList = games.filter(function(game){
            return game.gameTypeID == 'vs';
        });
        this.gameRlList = games.filter(function(game){
            return game.gameTypeID == 'rl';
        });
        this.gameVpList = games.filter(function(game){
            return game.gameTypeID == 'vp';
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
        this.gameList = this.gameVsList;
    }

    showRoulette() {
        this.gameList = this.gameRlList;
    }

    showPoker() {
        this.gameList = this.gameVpList;
    }

}
