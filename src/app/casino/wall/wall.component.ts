import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
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
export class WallComponent implements OnInit, AfterViewInit {
    @ViewChildren('scrollGames') private gamesScrolls: QueryList<ElementRef>;
    scrolls: ElementRef[];
    showLoadingIndicator = true;
    isCliente;
    isLoggedIn;
    gameType: string;
    private sub: any;
    modalRef;
    isHome = false;

    isHomeCassino = true;
    gameList: GameCasino[];
    gameAllList: GameCasino[];

    gamesCassino: GameCasino[];
    gamesDestaque: GameCasino[];
    gamesSlot: GameCasino[];
    gamesRaspadinha: GameCasino[];
    gamesRoleta: GameCasino[];
    gamesMesa: GameCasino[];

    blink: string;

    constructor(
        private casinoApi: CasinoApiService,
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private sideBarService: SidebarService,
        private renderer: Renderer2,
        private el: ElementRef,
        private cd: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.blink = this.router.url.split('/')[2];

        this.casinoApi.getGamesList().subscribe(response => {
            this.filterGame(response.gameList);

            this.gamesCassino = this.filterAll(this.gameAllList);
            this.gamesDestaque = this.filterDestaques(this.gameAllList);
            this.gamesSlot = this.filterSlot(this.gameAllList);
            this.gamesRaspadinha = this.filterRaspadinha(this.gameAllList);
            this.gamesRoleta = this.filterRoleta(this.gameAllList);
            this.gamesMesa = this.filterMesa(this.gameAllList);

            this.sub = this.route.params.subscribe(params => {
                this.gameType = params['game_type'];

                this.isHomeCassino = this.gameType === 'todos' || this.gameType === '';

                if (this.gameType === 'virtuais') {
                    this.sideBarService.changeItens({
                        contexto: 'virtuais',
                        dados: {}
                    });
                    this.showVirtuais(this.gameAllList);
                } else {
                    this.sideBarService.changeItens({
                        contexto: 'casino',
                        dados: {}
                    });
                    if (this.gameType === 'slot') {
                        this.showSlot();
                    } else if (this.gameType === 'roleta') {
                        this.showRoulette();
                    } else if (this.gameType === 'raspadinha') {
                        this.showRaspadinha();
                    } else if (this.gameType === 'mesa') {
                        this.showMesa();
                    } else if (this.gameType === 'destaques') {
                        this.showDestaques();
                    } else if (this.isHomeCassino) {
                        this.showAll();
                    }
                }
            });
            this.showLoadingIndicator = false;
        }, erro => {
        });
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

    ngAfterViewInit() {
        this.gamesScrolls.changes.subscribe((scrolls) => {
            this.scrolls = scrolls.toArray();
        });
    }

    scrollLeft(scrollId) {
        const scrollTemp = this.scrolls.find((scroll) => scroll.nativeElement.id === scrollId + '-scroll');
        scrollTemp.nativeElement.scrollLeft -= 700;
    }

    scrollRight(scrollId) {
        const scrollTemp = this.scrolls.find((scroll) => scroll.nativeElement.id === scrollId + '-scroll');
        scrollTemp.nativeElement.scrollLeft += 700;
    }

    onScroll(scrollId) {
        this.cd.detectChanges();
        const scrollTemp = this.scrolls.find((scroll) => scroll.nativeElement.id === scrollId + '-scroll');
        const scrollLeft = scrollTemp.nativeElement.scrollLeft;
        const scrollWidth = scrollTemp.nativeElement.scrollWidth;

        const scrollLeftTemp = this.el.nativeElement.querySelector(`#${scrollId}-left`);
        const scrollRightTemp = this.el.nativeElement.querySelector(`#${scrollId}-right`);

        const maxScrollSize = window.innerWidth - 240;

        if (scrollLeft <= 0) {
            this.renderer.addClass(scrollLeftTemp, 'disabled-scroll-button');
            this.renderer.removeClass(scrollLeftTemp, 'enabled-scroll-button');
        } else {
            this.renderer.addClass(scrollLeftTemp, 'enabled-scroll-button');
            this.renderer.removeClass(scrollLeftTemp, 'disabled-scroll-button');
        }

        if ((scrollWidth - (scrollLeft + maxScrollSize)) <= 0) {
            this.renderer.addClass(scrollRightTemp, 'disabled-scroll-button');
            this.renderer.removeClass(scrollRightTemp, 'enabled-scroll-button');
        } else {
            this.renderer.addClass(scrollRightTemp, 'enabled-scroll-button');
            this.renderer.removeClass(scrollRightTemp, 'disabled-scroll-button');
        }
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

    showAll() {
        this.gameList = this.gameAllList;
    }

    showSlot() {
        this.gameList = this.gamesSlot;
    }

    showRaspadinha() {
        this.gameList = this.gamesRaspadinha;
    }

    showRoulette() {
        this.gameList = this.gamesRoleta;
    }

    showMesa() {
        this.gameList = this.gamesMesa;
    }

    showVirtuais(games) {
        this.gameList = games.filter(function (game) {
            return game.dataType === 'VSB';
        });
    }

    showDestaques() {
        this.gameList = this.gamesDestaque;
    }

    filterAll(games) {
        return games.filter(function (game) {
            return game.dataType !== 'VSB';
        });
    }

    filterSlot(games) {
        return games.filter(function (game) {
            return game.gameTypeID === 'vs';
        });
    }

    filterRaspadinha(games) {
        return games.filter(function (game) {
            return game.gameTypeID === 'sc';
        });
    }

    filterRoleta(games) {
        return games.filter(function (game) {
            return game.gameTypeID === 'rl';
        });
    }

    filterMesa(games) {
        return games.filter(function (game) {
            return game.gameTypeID === 'vp' || game.gameTypeID === 'bj' || game.gameTypeID === 'bc';
        });
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
                || game.gameID === 'vs20kraken' || game.gameID === 'vs9chen' || game.gameID === 'vs20goldfever'
                || game.gameID === 'vs5joker' || game.gameID === 'vs25wolfgold' || game.gameID === 'vs20hburnhs'
                || game.gameID === '422' || game.gameID === 'vpa';
        });
        for (let cont = 0; cont < destaques.length; cont++) {
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
