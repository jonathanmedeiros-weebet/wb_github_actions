import { GameCasino } from './../../shared/models/casino/game-casino';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren, Input, ViewChild } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import { AuthService, ParametrosLocaisService, SidebarService } from './../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginModalComponent } from '../../shared/layout/modals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { config } from '../../shared/config';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { WallProviderFilterModalComponent } from './components/wall-provider-filter-modal/wall-provider-filter-modal.component';

export interface Fornecedor {
    gameFornecedor: string;
    gameFornecedorExibicao: string;
    imagem?: string;
}

@Component({
    selector: 'app-wall',
    templateUrl: './wall.component.html',
    styleUrls: ['./wall.component.css']
})
export class WallComponent implements OnInit, AfterViewInit {
    @ViewChildren('scrollGames') private gamesScrolls: QueryList<ElementRef>;
    @Input() games: GameCasino[];
    @ViewChild('listagem') listagemJogos;
    @ViewChild('scrollMenu') scrollMenu: ElementRef;
    scrolls: ElementRef[];
    showLoadingIndicator = true;
    isCliente;
    isLoggedIn;
    gameType: string;
    gameFornecedor: string;
    tituloPagina;
    private sub: any;
    isHome = false;
    isMobile = false;
    salsaCassino;
    cassinoFornecedores: Fornecedor[] = [];
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
    termFornecedorMobile;
    cassinoFornecedoresTemp = [];
    cassinoFornecedoresFiltrados = [];
    isVirtual = false;
    pesquisarTextoAlterado = new Subject<string>();
    textoAlterado;
    limparCampoSearch;
    qtdItens = 20;

    private newGamesCassino: GameCasino[];
    public fornecedorSelecionado: string;

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

    get showFilterBox(): boolean {
        return !this.showLoadingIndicator && this.gameType !== 'virtuais'
    }

    get isDemo(): boolean {
        return location.host === 'demo.wee.bet';
    }

    get blink(): string {
        return this.isVirtual ? 'virtual-sports' : 'casino'
    }

    ngOnInit(): void {
        this.isVirtual = this.route.snapshot.data['virtual_sports'] ? true : false;

        this.cd.detectChanges();
        this.computeResizeChanges();

        this.translate.onLangChange.subscribe(() => {
            this.cd.detectChanges();
            this.computeResizeChanges();
        });

        this.salsaCassino = this.paramsService.getOpcoes().salsa_cassino;
        this.casinoApi.getGamesList(false).subscribe(response => {
            this.gamesCassino = response.gameList.filter(function(game) {
                return game.dataType !== 'VSB';
            });
            
            this.cassinoFornecedores = response.fornecedores.map((fornecedor: Fornecedor) => ({
                ...fornecedor,
                imagem: `https://cdn.wee.bet/img/cassino/logos/providers/${fornecedor.gameFornecedor}.png`
            }));

            this.newGamesCassino = response.news;
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
                this.gameFornecedor = params['game_fornecedor'];
                this.isHomeCassino = this.gameType === 'todos' || this.gameType === '' || this.gameFornecedor === undefined;

                if (this.isVirtual) {
                    this.isHomeCassino = false;
                    this.sideBarService.changeItens({
                        contexto: 'virtuais',
                        dados: {}
                    });
                    this.gameList = response.gameList.filter(function(game) {
                        return game.category === 'virtual';
                    });
                } else {
                    this.sideBarService.changeItens({
                        contexto: 'casino',
                        dados: {}
                    });

                    this.gameList = this.gamesCassino;
                    this.gameTitle = this.translate.instant('geral.todos');

                    this.listagemJogos.nativeElement.scrollTo(0, 0);

                    this.filtroCassinoFornecedores = this.setFiltroFornecedores(this.gameList);
                    this.gamesCassinoTemp = [];
                    this.gamesCassinoFiltrados = [];
                    this.term = '';
                    this.termFornecedor = '';
                }

                this.filtrarJogos(this.gameFornecedor);
            });

            this.showLoadingIndicator = false;
            this.pesquisarTextoAlterado.pipe(debounceTime(1500)).subscribe(() => {
                this.term = this.textoAlterado;
                this.filtrarJogos();
            });

        }, erro => {});

        this.auth.logado.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
        this.auth.cliente.subscribe(isCliente => this.isCliente = isCliente);
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
        const maxScrollSize = scrollTemp.nativeElement.clientWidth;

        const fadeLeftTemp = this.el.nativeElement.querySelector(`#${scrollId}-fade-left`);
        const fadeRightTemp = this.el.nativeElement.querySelector(`#${scrollId}-fade-right`);

        if (scrollLeft <= 0) {
            this.renderer.addClass(scrollLeftTemp, 'disabled-scroll-button');
            this.renderer.removeClass(scrollLeftTemp, 'enabled-scroll-button');
            this.renderer.setStyle(fadeLeftTemp, 'opacity', '0');
        } else {
            this.renderer.addClass(scrollLeftTemp, 'enabled-scroll-button');
            this.renderer.removeClass(scrollLeftTemp, 'disabled-scroll-button');
            this.renderer.setStyle(fadeLeftTemp, 'opacity', '1');
        }

        if ((scrollWidth - (scrollLeft + maxScrollSize)) <= 1) {
            this.renderer.addClass(scrollRightTemp, 'disabled-scroll-button');
            this.renderer.removeClass(scrollRightTemp, 'enabled-scroll-button');
            this.renderer.setStyle(fadeRightTemp, 'opacity', '0');
        } else {
            this.renderer.addClass(scrollRightTemp, 'enabled-scroll-button');
            this.renderer.removeClass(scrollRightTemp, 'disabled-scroll-button');
            this.renderer.setStyle(fadeRightTemp, 'opacity', '1');
        }
    }

    abrirModalLogin() {
        this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350 modal-login',
                centered: true,
            }
        );
    }

    handleChangeCategoria(categoria: string) {
        this.isHomeCassino = false;

        if (this.gameFornecedor) {
            this.filtrarJogos(this.gameFornecedor);
        } else {
            this.gameList = this.gamesCassino;
        }

        switch (categoria) {
            case 'slot':
                this.gameList = this.filterModalidades(this.gameList, 'slot');
                this.gameTitle = this.translate.instant('cassino.slot');
                break;
            case 'crash':
                this.gameList = this.filterModalidades(this.gameList, 'crash');
                this.gameTitle = this.translate.instant('cassino.crash');
                break;
            case 'roleta':
                this.gameList = this.filterModalidades(this.gameList, 'roulette');
                this.gameTitle = this.translate.instant('cassino.roleta');
                break;
            case 'raspadinha':
                this.gameList = this.filterModalidades(this.gameList, 'scratchcard');
                this.gameTitle = this.translate.instant('cassino.raspadinha');
                break;
            case 'mesa':
                this.gameList = this.filterModalidades(this.gameList, 'table');
                this.gameTitle = this.translate.instant('cassino.mesa');
                break;
            case 'bingo':
                this.gameList = this.filterModalidades(this.gameList, 'bingo');
                this.gameTitle = this.translate.instant('cassino.bingo');
                break;
            case 'destaques':
                this.gameList = this.gamesDestaque;
                this.gameTitle = this.translate.instant('cassino.maisPopulares');
                break;
            default:
                this.gameTitle = this.translate.instant('geral.todos');
                this.isHomeCassino = (this.gameFornecedor === undefined || this.gameFornecedor === '');
                break;
        }

        this.listagemJogos.nativeElement.scrollTo(0, 0);
    }

    handleChangeFornecedor(event) {
        const fornecedor = event.target.value;
        this.gameFornecedor = fornecedor;

        this.filtrarJogos(fornecedor);
        // this.handleChangeCategoria(this.selectedSubMenu);
        this.cd.detectChanges();
    }

    filtrarJogos(fornecedor = null) {
        this.fornecedorSelecionado = (this.fornecedorSelecionado !== fornecedor) ? fornecedor : 'todos'; // Responsável pela seleção do provedor no front;
        this.termFornecedor = (this.fornecedorSelecionado && this.fornecedorSelecionado !== 'todos') ? this.fornecedorSelecionado : null;

        if (this.term || this.termFornecedor) {
            if(!this.gamesCassinoTemp.length){
                this.gamesCassinoTemp = this.gameList;
            } else {
                this.gameList = this.gamesCassinoTemp;
            }

            const gamesCassinoFiltrados =  this.gameList.filter(jogo => {
                if(this.term && this.termFornecedor){
                    return (
                        jogo.gameName.toUpperCase().includes(this.term.toUpperCase()) &&
                        jogo.fornecedor.toUpperCase().includes(this.termFornecedor.toUpperCase())
                    );
                }
                
                if(this.term){
                    return (jogo.gameName.toUpperCase().includes(this.term.toUpperCase()));
                }

                return (jogo.fornecedor.toUpperCase().includes(this.termFornecedor.toUpperCase()))
            }).map(jogo => Object.assign({}, jogo));

            this.gameList = gamesCassinoFiltrados;
            this.gamesCassinoFiltrados = gamesCassinoFiltrados;

        } else {
            if (this.gamesCassinoTemp.length) {
                this.gameList = this.gamesCassinoTemp;
                this.gamesCassinoTemp = [];
                this.gamesCassinoFiltrados = [];
            }
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
        if (this.term) {
            this.term = '';
            this.limparCampoSearch = document.getElementById('limparCampoSearch');
            this.limparCampoSearch.value = '';
            this.filtrarJogos();
        } else {
            this.termFornecedorMobile = '';
            this.filtrarFornecedor();
        }

    }

    openFiltroFornecedores() {
        const modalRef = this.modalService.open(
            WallProviderFilterModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'xxl',
                centered: true,
                windowClass: 'modal-750'
            }
        );

        modalRef.componentInstance.providers = this.cassinoFornecedores;
        modalRef.componentInstance.providerSelected = this.fornecedorSelecionado;
        modalRef.result.then(({event, data}) => {
            if(event == 'apply'){
                const {providerSelected} = data;
                this.filtrarJogos(providerSelected)
            }
        })
    }

    filterDestaques(games, modalidade) {
        return games.filter(function(game) {
            return game.modalidade === modalidade;
        });
    }

    filterModalidades(games, modalidade) {
        return games.filter(function(game) {
            return game.category === modalidade;
        });
    }

    exibirMais() {
        this.qtdItens += 3;
    }

    setFiltroFornecedores(games: any[]) {
        const fornecedoresSet = new Set(games.map(game => game.fornecedor));
        return this.cassinoFornecedores.filter(fornecedor => fornecedoresSet.has(fornecedor.gameFornecedor));
    }
   
    computeResizeChanges() {
        this.cd.detectChanges();
        if (window.innerWidth > 1024) {
            // this.menuWidth = window.innerWidth - 270;
            this.isMobile = false;
        } else {
            this.isMobile = true;
        }
        this.checkScrollButtons();
    }

    checkScrollButtons() {
        this.cd.detectChanges();
    }

    onPageScroll(element) {
        if (!this.isMobile) {
            return;
        }

        const firstScrollTop = element.scrollTop;
        setTimeout(() => {
            const submenuContainer = this.el.nativeElement.querySelector('#submenu-container');
            const navSubmenu = this.el.nativeElement.querySelector('#nav-submenu');

            if (navSubmenu) {
                if (element.scrollTop > firstScrollTop) {
                    this.renderer.setStyle(submenuContainer, 'min-height', '0');
                    this.renderer.setStyle(navSubmenu, 'height', '0');
                } else if (element.scrollTop < firstScrollTop) {
                    this.renderer.setStyle(submenuContainer, 'min-height', '40px');
                    this.renderer.setStyle(navSubmenu, 'height', '40px');
                } else if (element.scrollTop == 0) {
                    this.renderer.setStyle(submenuContainer, 'min-height', '40px');
                    this.renderer.setStyle(navSubmenu, 'height', '40px');
                }
            }

            this.cd.detectChanges();
        }, 50);
    }
}
