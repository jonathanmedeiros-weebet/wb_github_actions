import { Component, OnInit } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import {AuthService} from './../../services';
import { interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {LoginModalComponent} from '../../shared/layout/modals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


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
    modalRef;

    public gameList: [];
    public gameAllList: [];
    public gameSlotList: [];
    public gameRoletaList: [];
    public gameMesaList: [];
    public gameDestaquesList: [];
    public gameDestaques1: [];
    public gameDestaques2: [];
    public gameDestaques3: [];
    public gameDestaques4: [];
    public gameDestaques5: [];
    public gameDestaques6: [];
    public gameDestaques7: [];
    public gameDestaques8: [];
    public gameDestaques9: [];
    public gameDestaques10: [];
    public gameDestaques11: [];
    public gameDestaques12: [];

    constructor(
        private casinoApi: CasinoApiService,
        private auth: AuthService,
        private route: ActivatedRoute,
        private modalService: NgbModal,
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
            this.showLoadingIndicator = false;
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
        // Aleatório
        this.gameDestaquesList = games.filter(function (game) {
            return game.gameID === 'vs20doghouse' || game.gameID === 'vswayshammthor'
                || game.gameID === '422' || game.gameID === 'vpa'
                || game.gameID === 'vs1dragon8' || game.gameID === 'vs50mightra'
                || game.gameID === 'vs40wildwest' || game.gameID === 'vs20fruitsw' || game.gameID === 'vs4096jurassic';
        });
        // Ordenado
        this.gameDestaques1 = games.filter(function (game) {
            return game.gameID === '1301';
        });
        this.gameDestaques2 = games.filter(function (game) {
            return game.gameID === 'rla';
        });
        this.gameDestaques3 = games.filter(function (game) {
            return game.gameID === 'vswayszombcarn';
        });
        this.gameDestaques4 = games.filter(function (game) {
            return game.gameID === '1101';
        });
        this.gameDestaques5 = games.filter(function (game) {
            return game.gameID === 'vs20kraken';
        });
        this.gameDestaques6 = games.filter(function (game) {
            return game.gameID === 'vs20olympgate';
        });
        this.gameDestaques7 = games.filter(function (game) {
            return game.gameID === 'vs9chen';
        });
        this.gameDestaques8 = games.filter(function (game) {
            return game.gameID === 'vs20goldfever';
        });
        this.gameDestaques9 = games.filter(function (game) {
            return game.gameID === 'vs5joker';
        });
        this.gameDestaques10 = games.filter(function (game) {
            return game.gameID === 'vs25wolfgold';
        });
        this.gameDestaques11 = games.filter(function (game) {
            return game.gameID === 'vs20hburnhs';
        });
        this.gameDestaques12 = games.filter(function (game) {
            return game.gameID === 'vs4096bufking';
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
        this.gameList = this.gameDestaques1.concat(
            this.gameDestaques2).concat(
            this.gameDestaques3).concat(
            this.gameDestaques4).concat(
            this.gameDestaques6).concat(
            this.gameDestaques7).concat(
            this.gameDestaques8).concat(
            this.gameDestaques9).concat(
            this.gameDestaques10).concat(
            this.gameDestaques11).concat(
            this.gameDestaques12).concat(
            this.gameDestaquesList);
    }

    abrirModalLogin() {
        this.modalRef = this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true,
            }
        );

        this.modalRef.result
            .then(
                result => {
                },
                reason => {
                }
            );
    }
}
