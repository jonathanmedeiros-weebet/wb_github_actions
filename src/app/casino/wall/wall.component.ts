import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
import {AuthService, ParametrosLocaisService, SidebarService} from './../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginModalComponent} from '../../shared/layout/modals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GameCasino} from '../../shared/models/casino/game-casino';
import {TranslateService} from '@ngx-translate/core';


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
    tituloPagina;
    private sub: any;
    modalRef;
    isHome = false;
    isMobile = false;
    salsaCassino;

    isHomeCassino = true;
    gameList: GameCasino[];
    gameAllList: GameCasino[];

    gameTitle;

    gamesCassino: GameCasino[];
    gamesDestaque: GameCasino[];
    gamesSlot: GameCasino[];
    gamesRaspadinha: GameCasino[];
    gamesRoleta: GameCasino[];
    gamesMesa: GameCasino[];
    gamesBingo: GameCasino[];
    gamesLive: GameCasino[];

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
        private cd: ChangeDetectorRef,
        private translate: TranslateService,
        private paramsService: ParametrosLocaisService
    ) {
    }

    ngOnInit(): void {
        this.blink = this.router.url.split('/')[2];
        this.salsaCassino = this.paramsService.getOpcoes().salsa_cassino;
        this.casinoApi.getGamesList().subscribe(response => {
            this.gamesCassino = response.gameList;
            this.gamesDestaque = response.destaques;
            this.gamesSlot = this.filterSlot(response.gameList);
            this.gamesRaspadinha = this.filterRaspadinha(response.gameList);
            this.gamesRoleta = this.filterRoleta(response.gameList);
            this.gamesMesa = this.filterMesa(response.gameList);
            this.gamesBingo = this.filterBingo(response.gameList);
            this.gamesLive = this.filterLive(response.gameList);
            this.sub = this.route.params.subscribe(params => {
                this.gameType = params['game_type'];

                this.isHomeCassino = this.gameType === 'todos' || this.gameType === '';

                if (this.gameType === 'virtuais') {
                    this.sideBarService.changeItens({
                        contexto: 'virtuais',
                        dados: {}
                    });
                    this.gameList = response.gameList.filter(function (game) {
                        return game.dataType === 'VSB';
                    });
                } else {
                    this.sideBarService.changeItens({
                        contexto: 'casino',
                        dados: {}
                    });
                    if (this.isHomeCassino) {
                        this.gameList = this.gameAllList;
                        this.gameTitle = this.translate.instant('geral.todos');
                    }
                    switch (this.gameType) {
                        case 'slot':
                            this.gameList = this.gamesSlot;
                            this.gameTitle = this.translate.instant('cassino.slot');
                            break;
                        case 'roleta':
                            this.gameList = this.gamesRoleta;
                            this.gameTitle = this.translate.instant('cassino.roleta');
                            break;
                        case 'raspadinha':
                            this.gameList = this.gamesRaspadinha;
                            this.gameTitle = this.translate.instant('cassino.raspadinha');
                            break;
                        case 'mesa':
                            this.gameList = this.gamesMesa;
                            this.gameTitle = this.translate.instant('cassino.mesa');
                            break;
                        case 'destaques':
                            this.gameList = this.gamesDestaque;
                            this.gameTitle = this.translate.instant('cassino.destaques');
                            break;
                        case 'bingo':
                            this.gameList = this.gamesBingo;
                            this.gameTitle = 'Bingo';
                            break;
                        case 'live':
                            this.gameList = this.gamesLive;
                            this.gameTitle = this.translate.instant('cassino.aoVivo');
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

        this.isMobile = window.innerWidth < 1025;
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
            return game.gameTypeID === 'tb' || game.gameTypeID === 'bj' || game.gameTypeID === 'bc';
        });
    }

    filterBingo(games) {
        return games.filter(function (game) {
            return game.gameTypeID === 'bingo';
        });
    }

    filterLive(games) {
        return games.filter(function (game) {
            return game.gameTypeID === 'lg';
        });
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

    abrirModalLogin() {
        let options = {};

        if (this.isMobile) {
            options = {
                windowClass: 'modal-fullscreen',
            };
        } else {
            options = {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350',
                centered: true,
            };
        }

        this.modalRef = this.modalService.open(
            LoginModalComponent, options
        );
    }
}
