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
    public gameDestaquesList: [];
    public gameSpaceMan: [];

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
                } else if (this.gameType === 'destaques') {
                    this.showDestaques();
                } else if (this.gameType === 'todos' || this.gameType === '') {
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
            return game.gameTypeID === 'rl';
        });
        this.gameMesaList = games.filter(function(game) {
            return game.gameTypeID === 'vp' || game.gameTypeID === 'bj' || game.gameTypeID === 'bc';
        });
        this.gameDestaquesList = games.filter(function(game) {
            return game.gameID === '1301' || game.gameID === 'vs20doghouse' || game.gameID === 'vswayshammthor' || game.gameID === 'vs20olympgate' || game.gameID === 'vs20olympgate'
                // tslint:disable-next-line:max-line-length
                || game.gameID === '422' || game.gameID === 'rla' || game.gameID === 'vs243dancingpar' || game.gameID === 'vpa' || game.gameID === '1101' || game.gameID === 'vs1dragon8'
                // tslint:disable-next-line:max-line-length
                || game.gameID === 'vs50mightra' || game.gameID === 'vs40wildwest' || game.gameID === 'vs25asgard' || game.gameID === 'vs20fruitsw' || game.gameID === 'vs4096jurassic' || game.gameID === 'vs25pandagold' ;
        });
        this.gameSpaceMan = games.filter(function(game) {
            return game.gameID === '1301';
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

    showDestaques() {
        // @ts-ignore
        this.gameList = this.gameSpaceMan.concat(this.gameDestaquesList);
        console.log(this.gameList);
    }
}
