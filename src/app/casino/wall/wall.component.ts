import { GameCasino } from './../../shared/models/casino/game-casino';
import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren, Input, ViewChild} from '@angular/core';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
import {AuthService, ParametrosLocaisService, SidebarService} from './../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginModalComponent} from '../../shared/layout/modals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {config} from '../../shared/config';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-wall',
    templateUrl: './wall.component.html',
    styleUrls: ['./wall.component.css']
})
export class WallComponent implements OnInit, AfterViewInit {
    @ViewChildren('scrollGames') private gamesScrolls: QueryList<ElementRef>;
    @Input() games: GameCasino[];
    @ViewChild('fornecedorModal', {static: true}) fornecedorModal;
    @ViewChild('campoFiltroGames', { static: true }) campoFiltroGames: ElementRef;
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
    cassinoFornecedores;
    isHomeCassino = true;
    gameList: GameCasino[];
    gameAllList: GameCasino[];
    term = '';
    termFornecedor = '';
    gameTitle;
    gamesCassinoTemp = [];
    gamesCassinoFiltrados = [];
    gamesCassino: GameCasino[];
    gamesDestaque: GameCasino[];
    gamesSlot: GameCasino[];
    gamesRaspadinha: GameCasino[];
    gamesRoleta: GameCasino[];
    gamesMesa: GameCasino[];
    gamesBingo: GameCasino[];
    gamesLive: GameCasino[];
    LOGO = config.LOGO;
    blink: string;
    modalFiltro;
    termFornecedorMobile;
    cassinoFornecedoresTemp = [];
    cassinoFornecedoresFiltrados = [];
    totalJogos = 0;
    isDemo = false;
    filtroGames;
    filtros;
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
        this.filtros = document.getElementById('filtros');
        this.filtros.style.display="none";
        this.blink = this.router.url.split('/')[2];
        this.salsaCassino = this.paramsService.getOpcoes().salsa_cassino;
        this.casinoApi.getGamesList().subscribe(response => {
            this.gamesCassino = response.gameList.filter(function (game) {
                return game.dataType !== 'VSB';
            });;
            this.gamesDestaque = response.destaques;
            this.cassinoFornecedores = response.fornecedores;
            this.totalJogos = this.gamesCassino.length;
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
                        this.gameList =  this.gamesCassino;
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

                    this.gamesCassinoTemp = [];
                    this.gamesCassinoFiltrados = [];
                    this.term = '';
                    this.termFornecedor = '';
                }
            });
            this.showLoadingIndicator = false;
            this.filtros.style.display="";
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

        if (location.host === 'demo.wee.bet') {
           this.isDemo = true;
        }

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

        fromEvent(this.campoFiltroGames.nativeElement, 'keyup').pipe(debounceTime(2000)).subscribe(() => {
            this.term = this.campoFiltroGames.nativeElement.value
            this.filtrarJogos();
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

    filtrarJogos(fornecedor = null) {
        if(fornecedor){
            if(fornecedor == 'todos'){
                this.termFornecedor = null
            }else{
                this.termFornecedor = fornecedor;
            }
        }
        if (this.term || this.termFornecedor) {

            if(!this.gamesCassinoTemp.length){
                this.gamesCassinoTemp = this.gameList;
            }else{
                this.gameList = this.gamesCassinoTemp;
            }

            this.gamesCassinoFiltrados =  this.gameList.filter(jogo => {
                if(this.term && this.termFornecedor){
                    if (jogo.gameName.toUpperCase().includes(this.term.toUpperCase()) && jogo.fornecedor.toUpperCase().includes(this.termFornecedor.toUpperCase())) {
                        return true;
                    }
                    return false;
                }else if(this.term){
                    if (jogo.gameName.toUpperCase().includes(this.term.toUpperCase())) {
                        return true;
                    }
                    return false;
                }else{
                    if (jogo.fornecedor.toUpperCase().includes(this.termFornecedor.toUpperCase())) {
                        return true;
                    }
                    return false;
                }

            }).map(jogo => Object.assign({}, jogo));

            this.gameList = this.gamesCassinoFiltrados;

        } else {
            if (this.gamesCassinoTemp.length)   {
                this.gameList = this.gamesCassinoTemp;
                this.gamesCassinoTemp = [];
                this.gamesCassinoFiltrados = [];
            }
        }

        if(this.modalFiltro){
            this.modalFiltro.close();
        }
    }

    filtrarFornecedor() {
        if (this.termFornecedorMobile) {
            if(!this.cassinoFornecedoresTemp.length){
                this.cassinoFornecedoresTemp = this.cassinoFornecedores;
            }else{
                this.cassinoFornecedores = this.cassinoFornecedoresTemp;
            }

            this.cassinoFornecedoresFiltrados =  this.cassinoFornecedores.filter(fornecedor => {
              if(this.termFornecedorMobile){
                    if (fornecedor.gameFornecedor.includes(this.termFornecedorMobile)) {
                        return true;
                    }
                    return false;
                }
            }).map(fornecedor => Object.assign({}, fornecedor));

            this.cassinoFornecedores = this.cassinoFornecedoresFiltrados;

        } else {
            if (this.cassinoFornecedoresTemp.length)   {
                this.cassinoFornecedores = this.cassinoFornecedoresTemp;
                this.cassinoFornecedoresTemp = [];
                this.cassinoFornecedoresFiltrados = [];
            }
        }
    }

    limparPesquisa() {
        if(this.term){
            this.term = '';
            this.filtroGames = document.getElementById('filtroGames');
            this.filtroGames.value = '';
            this.filtrarJogos();
        }else{
            this.termFornecedorMobile = '';
            this.filtrarFornecedor();
        }

    }

    openFiltroFornecedores(){
        this.modalFiltro = this.modalService.open(
            this.fornecedorModal,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true,
            }
        );
    }
}
