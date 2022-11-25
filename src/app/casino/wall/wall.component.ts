import { Component, OnInit } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import {AuthService, SidebarService} from './../../services';
import { interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {LoginModalComponent} from '../../shared/layout/modals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {forEach, includes, indexOf} from 'lodash';


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


    constructor(
        private casinoApi: CasinoApiService,
        private auth: AuthService,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private sideBarService: SidebarService,
    ) { }

    ngOnInit(): void {
        this.casinoApi.getGamesList().subscribe(response => {
            const games = response.gameList;
            this.sub = this.route.params.subscribe(params => {
                this.gameType = params['game_type'];
                if (this.gameType === 'virtuais') {
                    this.sideBarService.changeItens({
                        contexto: 'virtuais',
                        dados: {}
                    });
                    this.gameList = games.filter(function(game) {
                        return game.dataType === 'VSB';
                    });
                } else {
                    this.sideBarService.changeItens({
                        contexto: 'casino',
                        dados: {}
                    });
                    switch (this.gameType) {
                        case 'slot':
                            this.gameList = games.filter(function (game) {
                                return game.gameTypeID === 'vs';
                            });
                            break;
                        case 'roleta':
                            this.gameList = games.filter(function (game) {
                                return game.gameTypeID === 'rl';
                            });
                            break;
                        case 'raspadinha':
                            this.gameList = games.filter(function (game) {
                                return game.gameTypeID === 'sc';
                            });
                            break;
                        case 'mesa':
                            this.gameList = games.filter(function (game) {
                                return game.gameTypeID === 'vp' || game.gameTypeID === 'bj' || game.gameTypeID === 'bc';
                            });
                            break;
                        case 'bingo':
                            this.gameList = games.filter(function (game) {
                                return game.gameTypeID === 'bingo';
                            });
                            break;
                        case 'destaques':
                            this.gameList = response.destaques;
                            break;
                        case 'todos':
                            this.gameList = games.filter(function (game) {
                                return game.dataType !== 'VSB';
                            });
                            break;
                    }
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

    getGamesList() {
        return this.gameList;
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
