import { GameCasino } from './../../shared/models/casino/game-casino';
import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren, Input, ViewChild} from '@angular/core';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
import {AuthService, ParametrosLocaisService, SidebarService} from './../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginModalComponent} from '../../shared/layout/modals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {config} from '../../shared/config';
import { Subject} from 'rxjs';
import { debounceTime} from 'rxjs/operators';

@Component({
    selector: 'app-wall',
    templateUrl: './wall.component.html',
    styleUrls: ['./wall.component.css']
})
export class WallComponent implements OnInit, AfterViewInit {
    @ViewChildren('scrollGames') private gamesScrolls: QueryList<ElementRef>;
    @Input() games: GameCasino[];
    @ViewChild('fornecedorModal', {static: true}) fornecedorModal;
    @ViewChild('listagem') listagemJogos;
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
    filtroCassinoFornecedores;
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
    gamesCrash: GameCasino[];
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
    isDemo = false;
    pesquisarTextoAlterado = new Subject<string>();
    textoAlterado;
    limparCampoSearch;
    qtdItens = 20;
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
        this.casinoApi.getGamesList(false).subscribe(response => {
            this.gamesCassino = response.gameList.filter(function (game) {
                return game.dataType !== 'VSB';
            });
            this.cassinoFornecedores = response.fornecedores;
            this.gamesDestaque = response.populares;
            this.gamesSlot = this.filterDestaques(this.gamesCassino, 'slot');
            this.gamesCrash = this.filterDestaques(this.gamesCassino, 'crash');
            this.gamesRaspadinha = this.filterDestaques(this.gamesCassino, 'scratchcard');
            this.gamesRoleta = this.filterDestaques(this.gamesCassino, 'roulette');
            this.gamesMesa = this.filterDestaques(this.gamesCassino, 'table');
            this.gamesBingo = this.filterDestaques(this.gamesCassino, 'bingo');
            this.gamesLive = this.filterDestaques(this.gamesCassino, 'live');

            this.sub = this.route.params.subscribe(params => {
                this.gameType = params['game_type'];

                this.isHomeCassino = this.gameType === 'todos' || this.gameType === '';

                if (this.gameType === 'virtuais') {
                    this.sideBarService.changeItens({
                        contexto: 'virtuais',
                        dados: {}
                    });
                    this.gameList = response.gameList.filter(function (game) {
                        return game.category === 'virtual';
                    });
                } else {
                    this.sideBarService.changeItens({
                        contexto: 'casino',
                        dados: {}
                    });
                    if (this.isHomeCassino) {
                        this.gameList =  this.gamesCassino;
                        this.gameTitle = this.translate.instant('geral.todos');
                        this.filtroCassinoFornecedores = this.cassinoFornecedores;
                    }else{
                        this.qtdItens = 20;
                    }
                    this.listagemJogos.nativeElement.scrollTo( 0, 0 );
                    switch (this.gameType) {
                        case 'slot':
                            this.gameList = this.filterModalidades(this.gamesCassino, 'slot');
                            this.filtroCassinoFornecedores = this.setFiltroFornecedores(this.gameList, this.cassinoFornecedores);
                            this.gameTitle = this.translate.instant('cassino.slot');
                            break;
                        case 'crash':
                            this.gameList =this.filterModalidades(this.gamesCassino, 'crash');
                            this.filtroCassinoFornecedores = this.setFiltroFornecedores(this.gameList, this.cassinoFornecedores);
                            this.gameTitle = this.translate.instant('cassino.crash');
                            break;
                        case 'roleta':
                            this.gameList = this.filterModalidades(this.gamesCassino, 'roulette');
                            this.filtroCassinoFornecedores = this.setFiltroFornecedores(this.gameList, this.cassinoFornecedores);
                            this.gameTitle = this.translate.instant('cassino.roleta');
                            break;
                        case 'raspadinha':
                            this.gameList = this.filterModalidades(this.gamesCassino, 'scratchcard');
                            this.filtroCassinoFornecedores = this.setFiltroFornecedores(this.gameList, this.cassinoFornecedores);
                            this.gameTitle = this.translate.instant('cassino.raspadinha');
                            break;
                        case 'mesa':
                            this.gameList = this.filterModalidades(this.gamesCassino, 'table');
                            this.filtroCassinoFornecedores = this.setFiltroFornecedores(this.gameList, this.cassinoFornecedores);
                            this.gameTitle = this.translate.instant('cassino.mesa');
                            break;
                        case 'bingo':
                            this.gameList = this.filterModalidades(this.gamesCassino, 'bingo');
                            this.filtroCassinoFornecedores = this.setFiltroFornecedores(this.gameList, this.cassinoFornecedores);
                            this.gameTitle = 'Bingo';
                            break;
                    }

                    this.gamesCassinoTemp = [];
                    this.gamesCassinoFiltrados = [];
                    this.term = '';
                    this.termFornecedor = '';
                }
            });

            this.showLoadingIndicator = false;
            this.pesquisarTextoAlterado.pipe(debounceTime(1500)).subscribe(() => {
                this.term = this.textoAlterado;
                this.filtrarJogos();
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

        if (location.host === 'demo.wee.bet') {
           this.isDemo = true;
        }

        this.isMobile = window.innerWidth < 1025;
    }

    search($event) {
        this.pesquisarTextoAlterado.next($event.target.value);
        this.textoAlterado = $event.target.value;
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

        const fadeLeftTemp = this.el.nativeElement.querySelector(`#${scrollId}-fade-left`);
        const fadeRightTemp = this.el.nativeElement.querySelector(`#${scrollId}-fade-right`);

        const maxScrollSize = scrollTemp.nativeElement.clientWidth;

        if (scrollLeft <= 0) {
            if (!this.isMobile) {
                this.renderer.addClass(scrollLeftTemp, 'disabled-scroll-button');
                this.renderer.removeClass(scrollLeftTemp, 'enabled-scroll-button');
            }
            this.renderer.setStyle(fadeLeftTemp, 'opacity', '0');
        } else {
            if (!this.isMobile) {
                this.renderer.addClass(scrollLeftTemp, 'enabled-scroll-button');
                this.renderer.removeClass(scrollLeftTemp, 'disabled-scroll-button');
            }
            this.renderer.setStyle(fadeLeftTemp, 'opacity', '1');
        }

        if ((scrollWidth - (scrollLeft + maxScrollSize)) <= 1) {
            if (!this.isMobile) {
                this.renderer.addClass(scrollRightTemp, 'disabled-scroll-button');
                this.renderer.removeClass(scrollRightTemp, 'enabled-scroll-button');
            }
            this.renderer.setStyle(fadeRightTemp, 'opacity', '0');
        } else {
            if (!this.isMobile) {
                this.renderer.addClass(scrollRightTemp, 'enabled-scroll-button');
                this.renderer.removeClass(scrollRightTemp, 'disabled-scroll-button');
            }
            this.renderer.setStyle(fadeRightTemp, 'opacity', '1');
        }
    }

    abrirModalLogin() {
        this.modalRef = this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350 modal-login',
                centered: true,
            }
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
            if (!this.cassinoFornecedoresTemp.length) {
                this.cassinoFornecedoresTemp = this.cassinoFornecedores;
            } else {
                this.cassinoFornecedores = this.cassinoFornecedoresTemp;
            }

            this.cassinoFornecedoresFiltrados = this.cassinoFornecedores.filter(fornecedor => {
                if (this.termFornecedorMobile) {
                    return fornecedor.gameFornecedor.includes(this.termFornecedorMobile.toLowerCase()) ||
                        fornecedor.gameFornecedorExibicao.toLowerCase().includes(this.termFornecedorMobile.toLowerCase());
                }
            }).map(fornecedor => Object.assign({}, fornecedor));

            this.cassinoFornecedores = this.cassinoFornecedoresFiltrados;
        } else {
            if (this.cassinoFornecedoresTemp.length) {
                this.cassinoFornecedores = this.cassinoFornecedoresTemp;
                this.cassinoFornecedoresTemp = [];
                this.cassinoFornecedoresFiltrados = [];
            }
        }
    }

    limparPesquisa() {
        if(this.term){
            this.term = '';
            this.limparCampoSearch = document.getElementById('limparCampoSearch');
            this.limparCampoSearch.value = '';
            this.filtrarJogos();
        }else{
            this.termFornecedorMobile = '';
            this.filtrarFornecedor();
        }

    }

    openFiltroFornecedores() {
        this.modalFiltro = this.modalService.open(
            this.fornecedorModal,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true,
            }
        );
    }

    filterDestaques(games, modalidade) {
        return games.filter(function (game) {
            return game.modalidade === modalidade;
        });
    }

    filterModalidades(games, modalidade) {
        return games.filter(function (game) {
            return game.category === modalidade;
        });
    }

    exibirMais() {
       this.qtdItens += 3;
    }

    setFiltroFornecedores(games: any[], fornecedores: any[]) {
        const fornecedoresSet = new Set(games.map(game => game.fornecedor));
        return fornecedores.filter(fornecedor => fornecedoresSet.has(fornecedor.gameFornecedor));
    }
}
