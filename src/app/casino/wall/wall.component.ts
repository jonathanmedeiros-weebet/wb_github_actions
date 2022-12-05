import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
import {AuthService, SidebarService} from './../../services';
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
        private translate: TranslateService
    ) {
    }

    ngOnInit(): void {
        this.blink = this.router.url.split('/')[2];

        this.casinoApi.getGamesList().subscribe(response => {
            this.gameAllList = response.gameList;

            this.gamesCassino = response.gameList;
            this.gamesDestaque = response.destaques;
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
                    this.gameTitle = this.translate.instant('cassino.virtuais');
                    this.gameList = this.gameAllList.filter(function (game) {
                        return game.dataType === 'VSB';
                    });
                } else {
                    this.sideBarService.changeItens({
                        contexto: 'casino',
                        dados: {}
                    });
                    switch (this.gameType) {
                        case 'slot':
                            this.gameList =  this.gamesSlot;
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
                        case 'todos':
                            this.gameList = this.gamesCassino;
                            this.gameTitle = this.translate.instant('geral.todos');
                            break;
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

        this.isMobile = window.innerWidth < 1025;
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
