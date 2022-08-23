import { Component, OnInit } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import {AuthService, SidebarService} from './../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginModalComponent} from '../../shared/layout/modals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GameCasino} from '../../shared/models/casino/game-casino';


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

    isHomeCassino = true;
    public gameList: GameCasino[];
    public gameAllList: GameCasino[];
    public gameDestaques: GameCasino[];

    blink: string;

    constructor(
        private casinoApi: CasinoApiService,
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private sideBarService: SidebarService,
    ) { }

    ngOnInit(): void {
        this.blink = this.router.url.split('/')[2];

        this.casinoApi.getGamesList().subscribe(response => {
            this.filterGame(response.gameList);
            this.sub = this.route.params.subscribe(params => {
                this.gameType = params['game_type'];
                if (this.gameType === 'virtuais') {
                    this.sideBarService.changeItens({
                        contexto: 'virtuais',
                        dados: {}
                    });
                    this.showVirtuais(this.gameAllList);
                } else {
                    this.isHomeCassino = this.gameType === 'todos' || this.gameType === '';
                    this.gameDestaques = this.filterDestaques(this.gameAllList);

                    this.sideBarService.changeItens({
                        contexto: 'casino',
                        dados: {}
                    });
                    if (this.gameType === 'slot') {
                        this.showSlot(this.gameAllList);
                    } else if (this.gameType === 'roleta') {
                        this.showRoulette(this.gameAllList);
                    } else if (this.gameType === 'raspadinha') {
                        this.showRaspadinha(this.gameAllList);
                    } else if (this.gameType === 'mesa') {
                        this.showMesa(this.gameAllList);
                    } else if (this.gameType === 'destaques') {
                        this.showDestaques(this.gameAllList);
                    } else if (this.isHomeCassino) {
                        this.showAll(this.gameAllList);
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
    // REMOVENDO JOGOS
    filterGame(games) {
        this.gameAllList = games.filter(function (game) {
            return game.gameID !== 'vs4096bufking' && game.gameID !== 'vswayswerewolf'
                && game.gameID !== 'vs25davinci' && game.gameID !== 'vs243dancingpar' && game.gameID !== 'vs1600drago'
                && game.gameID !== 'vs20eking' && game.gameID !== 'vs20ekingrr' && game.gameID !== 'vs10fruity2'
                && game.gameID !== 'vs4096jurassic' && game.gameID !== 'vs25peking' && game.gameID !== 'vs40pirate'
                && game.gameID !== 'vswayshive' && game.gameID !== 'vs1024dtiger' && game.gameID !== 'vs50mightra';
        });
    }

    getGamesList() {
        return this.gameList;
    }

    showAll(games) {
        this.gameList = games.filter(function (game) {
            return game.dataType !== 'VSB';
        });
    }

    showSlot(games) {
        this.gameList = games.filter(function(game) {
            return game.gameTypeID === 'vs';
        });
    }

    showRaspadinha(games) {
        this.gameList = games.filter(function(game) {
            return game.gameTypeID === 'sc';
        });
    }

    showRoulette(games) {
        this.gameList = games.filter(function(game) {
            return game.gameTypeID === 'rl';
        });
    }

    showMesa(games) {
        this.gameList = games.filter(function(game) {
            return game.gameTypeID === 'vp' || game.gameTypeID === 'bj' || game.gameTypeID === 'bc';
        });
    }

    showVirtuais(games) {
        this.gameList = games.filter(function(game) {
            return game.dataType === 'VSB';
        });
    }

    showDestaques(games) {
       //  const destaques = [
       //      '1301', 'rla', 'vs20olympgate', 'vs20doghouse', 'vs25wolfgold',
       //      '1101', 'vs20kraken', 'vs9chen', 'vs20goldfever', 'vs5joker',
       //      'vswayszombcarn', 'vs20hburnhs', '422', 'vpa'
       //  ];
       // let destaquesFiltrados = games.filter(function (game) {
       //      return game.gameID === '1301' || game.gameID === 'rla' || game.gameID === 'vs20olympgate'
       //          || game.gameID === 'vs20doghouse' || game.gameID === 'vswayszombcarn' || game.gameID === '1101'
       //          || game.gameID === 'vs20kraken' || game.gameID === 'vs9chen'  || game.gameID === 'vs20goldfever'
       //          || game.gameID === 'vs5joker' || game.gameID === 'vs25wolfgold' || game.gameID === 'vs20hburnhs'
       //          || game.gameID === '422' || game.gameID === 'vpa';
       //  });
       //  for (let cont = 0; cont < destaques.length; cont++ ) {
       //      const posicao = destaquesFiltrados.findIndex((element) => element.gameID === destaques[cont]);
       //      if (posicao >= 0) {
       //          destaquesFiltrados = mudarPosicao(destaquesFiltrados, posicao, cont);
       //      }
       //  }
       //  this.gameList = destaquesFiltrados;
       //
       //  function mudarPosicao(array, from, to) {
       //      array.splice(to, 0, array.splice(from, 1)[0]);
       //      return array;
       //  }
        this.gameList = this.filterDestaques(games);
    }

    filterDestaques(games) {
        const destaques = [
            '1301', 'rla', 'vs20olympgate', 'vs20doghouse', 'vs25wolfgold',
            '1101', 'vs20kraken', 'vs9chen', 'vs20goldfever', 'vs5joker',
            'vswayszombcarn', 'vs20hburnhs', '422', 'vpa'
        ];
        let destaquesFiltrados = games.filter(function (game) {
            return game.gameID === '1301' || game.gameID === 'rla' || game.gameID === 'vs20olympgate'
                || game.gameID === 'vs20doghouse' || game.gameID === 'vswayszombcarn' || game.gameID === '1101'
                || game.gameID === 'vs20kraken' || game.gameID === 'vs9chen'  || game.gameID === 'vs20goldfever'
                || game.gameID === 'vs5joker' || game.gameID === 'vs25wolfgold' || game.gameID === 'vs20hburnhs'
                || game.gameID === '422' || game.gameID === 'vpa';
        });
        for (let cont = 0; cont < destaques.length; cont++ ) {
            const posicao = destaquesFiltrados.findIndex((element) => element.gameID === destaques[cont]);
            if (posicao >= 0) {
                destaquesFiltrados = mudarPosicao(destaquesFiltrados, posicao, cont);
            }
        }

        return destaquesFiltrados;

        function mudarPosicao(array, from, to) {
            array.splice(to, 0, array.splice(from, 1)[0]);
            return array;
        }
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
