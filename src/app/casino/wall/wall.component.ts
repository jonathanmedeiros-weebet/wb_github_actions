import { GameCasino } from './../../shared/models/casino/game-casino';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren, Input, ViewChild } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import { AuthService, ParametrosLocaisService, SidebarService, WidgetService } from './../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginModalComponent } from '../../shared/layout/modals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { WallProviderFilterModalComponent } from './components/wall-provider-filter-modal/wall-provider-filter-modal.component';
import { NavigationHistoryService } from 'src/app/shared/services/navigation-history.service';
import { CronService } from 'src/app/shared/services/timer.service';
import { isUndefined } from 'lodash';

export interface Fornecedor {
    gameFornecedor: string;
    gameFornecedorExibicao: string;
    imagem?: string;
}

export interface GameSection {
    id: string;
    title: string;
    gameList: GameCasino[];
    show: boolean;
}

@Component({
    selector: 'app-wall',
    templateUrl: './wall.component.html',
    styleUrls: ['./wall.component.css']
})
export class WallComponent implements OnInit, AfterViewInit {
    @ViewChildren('scrollGames') private gamesScrolls: QueryList<ElementRef>;
    @Input() games: GameCasino[];
    @ViewChild('listagem') listagemJogos: ElementRef;
    @ViewChild('scrollMenu') scrollMenu: ElementRef;

    public scrolls: ElementRef[];
    public qtdItens: number = 20;
    public scrollStep = 700;

    public showLoadingIndicator: boolean = true;
    public isCliente: boolean;
    public isLoggedIn: boolean;

    public gameList: GameCasino[];
    public gamesCassino: GameCasino[];
    public gamesDestaque: GameCasino[];
    public gamesRecommended: GameCasino[];
    private newGamesCassino: GameCasino[];
    public cassinoFornecedores: Fornecedor[] = [];

    public gamesSection: GameSection[] = [];

    // Cassino
    public gamesSlot: GameCasino[];
    public gamesCrash: GameCasino[];
    public gamesRaspadinha: GameCasino[];
    public gamesRoleta: GameCasino[];
    public gamesMesa: GameCasino[];
    public gamesBingo: GameCasino[];
    public gamesLive: GameCasino[];

    // Cassino ao vivo
    public gamesBlackjack: GameCasino[];
    public gamesBaccarat: GameCasino[];
    public gamesPoker: GameCasino[];
    public gamesGameshow: GameCasino[];

    public gameFornecedor: string;
    public categorySelected: string = 'cassino';
    public gameTitle: string;

    public filteredCategory: string;
    public widgets = [];

    constructor(
        private casinoApi: CasinoApiService,
        private widgetService: WidgetService,
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private sideBarService: SidebarService,
        private renderer: Renderer2,
        private el: ElementRef,
        private cd: ChangeDetectorRef,
        private translate: TranslateService,
        private paramsService: ParametrosLocaisService,
        private navigationHistoryService: NavigationHistoryService,
        private casinoService: CasinoApiService,
        private cron: CronService
    ) {
    }

    get showFilterBox(): boolean {
        return !this.showLoadingIndicator && !this.hideProviders;
    }

    get hideProviders(){
        return this.isVirtualPage;
    }

    get isDemo(): boolean {
        return false;
    }

    get blink(): string {
        const urlTree = this.router.parseUrl(this.router.url);
        const pathSegments = urlTree.root.children['primary'].segments;
        return Boolean(pathSegments.length) ? pathSegments[0].path : 'casino';
    }

    get isHomeCassino(): boolean {
        return (
            ['', 'todos', 'cassino', 'cassino-live'].includes(this.categorySelected) &&
            (this.isCassinoPage || this.isCassinoAoVivoPage) &&
            !this.gameFornecedor
        );
    }

    get isVirtualPage(): boolean {
        return this.blink === 'virtual-sports';
    }

    get isCassinoAoVivoPage(): boolean {
        return this.blink === 'live-casino'
    }

    get isCassinoPage(): boolean {
        return this.blink === 'casino'
    }

    get isMobile(): boolean {
        return window.innerWidth < 1025;
    }

    get isSalsaCassino(): boolean {
        return this.paramsService.getOpcoes().salsa_cassino;
    }

    get subMenuCategory(): string {
        return this.isCassinoPage ? 'cassino' : 'cassino-live'
    }

    ngOnInit(): void {
        const page = this.isCassinoPage ? 'casino' : 'live_casino'
        this.widgetService.byPage(page).subscribe(response => {
            if (response) {
                this.widgets = response.map((i) => ({ ...i, selector: 'w' + i.id}));
                this.getGamesCasino();
            }
        });

        this.navigationHistoryService.limparFiltro$.subscribe(() => {
            this.clearFilters();
        });

        this.cd.detectChanges();
        this.onTranslateChange();
        this.getGameList();

        if (this.isMobile) {
            this.scrollStep = 200;
        }

        this.auth.logado.subscribe(isLoggedIn => {
            this.isLoggedIn = isLoggedIn
            this.getGameList();
        });

        this.auth.cliente.subscribe(isCliente => this.isCliente = isCliente);
    }

    getGamesCasino() {
        this.widgets.forEach(widget => {
            if (widget.items && widget.items.length > 0) {
                this.casinoService.getCasinoGamesByIds(widget.items.map(i => i.item_id))
                    .subscribe((result) => {
                        widget.items = result.games;
                    });
            }
        });
    }

    private onTranslateChange() {
        this.translate.onLangChange.subscribe(() => {
            this.filterGames(this.gameFornecedor, this.categorySelected, false);
            this.cd.detectChanges();
        });
    }

    private getGameList() {
        if (this.isCassinoPage || this.isVirtualPage) {
            this.getGameCassinoList();
        }

        if(this.isCassinoAoVivoPage) {
            this.getGameCassinoAoVivoList();
        }
    }

    private async getGameCassinoList() {
        const {
            fornecedores,
            gameList,
            news,
            populares
        } = await this.casinoApi.getGamesList(false).toPromise();

        this.cassinoFornecedores = fornecedores.map((fornecedor: Fornecedor) => ({
            ...fornecedor,
            imagem: `https://wb-assets.com/img/logos/providers/${fornecedor.gameFornecedor}.png`
        }));

        if (this.isVirtualPage) {
            this.sideBarService.changeItens({
                contexto: 'virtuais',
                dados: {}
            });
            this.gamesCassino = gameList.filter((game: GameCasino) => game.category === 'virtual');
            this.categorySelected = 'virtual';
        } else {
            this.gamesCassino = gameList.filter((game: GameCasino) => game.dataType !== 'VSB');
            this.newGamesCassino = news;
            this.gamesDestaque = populares;
            await this.getGamesRecommendations();

            this.gamesSection = [
                {
                    id: 'recommendedToYou',
                    title: this.translate.instant('cassino.recommendedToYou'),
                    gameList: this.gamesRecommended,
                    show: !isUndefined(this.gamesRecommended) && this.isLoggedIn
                },
                {
                    id: 'destaques',
                    title: this.translate.instant('cassino.maisPopulares'),
                    gameList: this.gamesDestaque,
                    show: true
                },
                {
                    id: 'crash',
                    title: this.translate.instant('cassino.crash'),
                    gameList: this.filterDestaques(this.gamesCassino, 'crash'),
                    show: true
                },
                {
                    id: 'slot',
                    title: this.translate.instant('cassino.slot'),
                    gameList: this.filterDestaques(this.gamesCassino, 'slot'),
                    show: true
                },
                {
                    id: 'roleta',
                    title: this.translate.instant('cassino.roleta'),
                    gameList: this.filterDestaques(this.gamesCassino, 'roulette'),
                    show: true
                },
                {
                    id: 'mesa',
                    title: this.translate.instant('cassino.mesa'),
                    gameList: this.filterDestaques(this.gamesCassino, 'table'),
                    show: true
                },
                {
                    id: 'raspadinha',
                    title: this.translate.instant('cassino.raspadinha'),
                    gameList: this.filterDestaques(this.gamesCassino, 'scratchcard'),
                    show: true
                },
                {
                    id: 'bingo',
                    title: this.translate.instant('cassino.bingo'),
                    gameList: this.filterDestaques(this.gamesCassino, 'bingo'),
                    show: true
                }
            ]

            this.gamesLive = this.filterDestaques(this.gamesCassino, 'live');

            this.sideBarService.changeItens({
                contexto: 'casino',
                dados: {}
            });
        }

        this.gameList = this.gamesCassino;
        this.gameTitle = this.translate.instant('geral.todos');

        this.route.queryParamMap.subscribe(params => {
            const provider = params.get('provider');
            this.categorySelected = params.get('category');

            if (this.categorySelected == 'roulette') {
                this.categorySelected = 'roleta';
            } else if(this.categorySelected == 'table') {
                this.categorySelected = 'mesa';
            } else if(this.categorySelected == 'scratchcard') {
                this.categorySelected = 'raspadinha';
            }

            if (provider && typeof provider === 'string' && !['c', 'cl', 'v'].includes(provider)) {
                this.filterGames(provider, this.categorySelected ?? null);
            } else {
                this.filterGames(null, this.categorySelected ?? null);
            }
        });

        this.listagemJogos.nativeElement.scrollTo(0, 0);
        this.showLoadingIndicator = false;
    }

    private async getGameCassinoAoVivoList() {
        const {
            fornecedores,
            gameList,
            news,
            populares
        } = await this.casinoApi.getGamesList(true).toPromise();

        this.cassinoFornecedores = fornecedores.map((fornecedor: Fornecedor) => ({
            ...fornecedor,
            imagem: `https://wb-assets.com/img/logos/providers/${fornecedor.gameFornecedor}.png`
        }));

        this.gamesCassino = gameList.filter( (game: GameCasino) => game.dataType !== 'VSB');
        this.newGamesCassino = news;
        this.gamesDestaque = populares;

        this.gamesSection = [
            {
                id: 'destaques',
                title: this.translate.instant('cassino.maisPopulares'),
                gameList: this.gamesDestaque,
                show: true
            },
            {
                id: 'roleta',
                title: this.translate.instant('cassino.roleta'),
                gameList: this.filterDestaques(this.gamesCassino, 'roulette'),
                show: true
            },
            {
                id: 'blackjack',
                title: 'Blackjack',
                gameList: this.filterDestaques(this.gamesCassino, 'blackjack'),
                show: true
            },
            {
                id: 'gameshow',
                title: 'Game Show',
                gameList: this.filterDestaques(this.gamesCassino, 'gameshow'),
                show: true
            },
            {
                id: 'baccarat',
                title: 'Baccarat',
                gameList: this.filterDestaques(this.gamesCassino, 'baccarat'),
                show: true
            },
            {
                id: 'poker',
                title: 'Poker',
                gameList: this.filterDestaques(this.gamesCassino, 'poker'),
                show: true
            }
        ]

        this.sideBarService.changeItens({
            contexto: 'casino',
            dados: {}
        });

        this.gameList = this.gamesCassino;
        this.gameTitle = this.translate.instant('geral.todos');

        this.route.queryParamMap.subscribe(params => {
            const provider = params.get('provider');
            this.categorySelected = params.get('category');

            if (this.categorySelected == 'roulette') {
                this.categorySelected = 'roleta';
            } else if(this.categorySelected == 'table') {
                this.categorySelected = 'mesa';
            } else if(this.categorySelected == 'scratchcard') {
                this.categorySelected = 'raspadinha';
            }

            if (provider && typeof provider === 'string' && !['c', 'cl', 'v'].includes(provider)) {
                this.filterGames(provider ?? null, this.categorySelected ?? null);
            } else {
                this.filterGames(null, this.categorySelected ?? null);
            }
        });

        this.listagemJogos.nativeElement.scrollTo(0, 0);
        this.showLoadingIndicator = false;
    }

    ngAfterViewInit() {
        this.gamesScrolls.changes.subscribe(
            (scrolls) => this.scrolls = scrolls.toArray()
        );
    }

    public scrollLeft(scrollId: string) {
        const scrollTemp = this.scrolls.find((scroll) => scroll.nativeElement.id === scrollId + '-scroll');
        scrollTemp.nativeElement.scrollLeft -= this.scrollStep;
    }

    public scrollRight(scrollId: string) {
        const scrollTemp = this.scrolls.find((scroll) => scroll.nativeElement.id === scrollId + '-scroll');
        scrollTemp.nativeElement.scrollLeft += this.scrollStep;
    }

    public onScroll(scrollId: string) {
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
            if(fadeLeftTemp) this.renderer.setStyle(fadeLeftTemp, 'opacity', '0');
        } else {
            this.renderer.addClass(scrollLeftTemp, 'enabled-scroll-button');
            this.renderer.removeClass(scrollLeftTemp, 'disabled-scroll-button');
            if(fadeLeftTemp) this.renderer.setStyle(fadeLeftTemp, 'opacity', '1');
        }

        if ((scrollWidth - (scrollLeft + maxScrollSize)) <= 1) {
            this.renderer.addClass(scrollRightTemp, 'disabled-scroll-button');
            this.renderer.removeClass(scrollRightTemp, 'enabled-scroll-button');
            if(fadeRightTemp) this.renderer.setStyle(fadeRightTemp, 'opacity', '0');
        } else {
            this.renderer.addClass(scrollRightTemp, 'enabled-scroll-button');
            this.renderer.removeClass(scrollRightTemp, 'disabled-scroll-button');
            if(fadeRightTemp) this.renderer.setStyle(fadeRightTemp, 'opacity', '1');
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

    public async filterGames(
        provider: string = '',
        category: string = '',
        enableSelectProvider: boolean = true
    ) {
        let providerName = provider ?? this.gameFornecedor;
        let categoryName = this.getCategorySlug(category ?? this.categorySelected);

        this.navigationHistoryService.setCategory(categoryName);
        this.navigationHistoryService.setProvider(providerName);

        this.categorySelected = category ?? 'cassino';
        let gamesCassinoList = this.gamesCassino;

        if(['news', 'destaques'].includes(categoryName)) {
            gamesCassinoList = categoryName === 'news' ? this.newGamesCassino : this.gamesDestaque;
        }

        if(['cassino', 'cassino-live', 'todos', 'news', 'destaques', 'virtual'].includes(categoryName)) {
            categoryName = null;
        }

        if(enableSelectProvider){
            // Responsável pela seleção do provedor no front;
            providerName = (this.gameFornecedor !== providerName) ? providerName : null;
            this.gameFornecedor = providerName;
        }

        if(!providerName && !categoryName) {
            this.gameList = gamesCassinoList
        }else{
            this.gameList = gamesCassinoList.filter((game: any) => {
                const gameProvider = game.fornecedor.toUpperCase();
                const gameCategory = game.category.toUpperCase();

                if(providerName && categoryName) {
                    return (
                        gameProvider.includes(providerName.toUpperCase()) &&
                        gameCategory.includes(categoryName.toUpperCase())
                    );
                }

                if(providerName){
                    return gameProvider.includes(providerName.toUpperCase());
                }

                if(categoryName){
                    return gameCategory.includes(categoryName.toUpperCase());
                }
            });

            if (categoryName == 'recommendedToYou') {
                this.gameList = this.gamesRecommended;
            }
        }

        this.gameTitle = this.getGameTitle(category);
    }

    private getGameTitle(category: string) {
        const gameTitles = {
            // Cassino
            recommendedToYou: this.translate.instant('cassino.recommendedToYou'),
            slot: this.translate.instant('cassino.slot'),
            crash: this.translate.instant('cassino.crash'),
            roleta: this.translate.instant('cassino.roleta'),
            mesa: this.translate.instant('cassino.mesa'),
            bingo: this.translate.instant('cassino.bingo'),
            raspadinha: this.translate.instant('cassino.raspadinha'),
            destaques: this.translate.instant('cassino.maisPopulares'),
            news: this.translate.instant('cassino.news'),
            todos: this.translate.instant('geral.todos'),
            cassino: this.translate.instant('geral.todos'),
            virtual: this.translate.instant('geral.todos'),

            // Cassino ao vivo
            blackjack: 'Blackjack',
            baccarat: 'Baccarat',
            poker: 'Poker',
            gameshow: 'Game Show'
        }

        const categoryTitle = gameTitles[category] ?? '';
        const providerTitle = this.gameFornecedor
            ? this.cassinoFornecedores.find(provider => provider.gameFornecedor === this.gameFornecedor)?.gameFornecedorExibicao ?? null
            : null;

        return categoryTitle && providerTitle ? `${categoryTitle} | ${providerTitle}` : categoryTitle;
    }

    private getCategorySlug(category: string) {
        const categories = {
            recommendedToYou: "recommendedToYou",
            slot: 'slot',
            crash: 'crash',
            roleta: 'roulette',
            mesa: 'table',
            bingo: 'bingo',
            raspadinha: 'scratchcard',
            destaques: 'destaques',
            news: 'news',
            todos: 'cassino',
            cassino: 'cassino',
        }

        return categories[category] ?? category
    }

    public openFiltroFornecedores() {
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
        modalRef.componentInstance.providerSelected = this.gameFornecedor;
        modalRef.componentInstance.container =  this.listagemJogos;
        modalRef.result.then(({event, data}) => {
            if(event == 'apply'){
                const {providerSelected} = data;
                this.filterGames(providerSelected, this.categorySelected, true)
            }
        })
    }

    private filterDestaques(games: GameCasino[], modalidade: string) {
        return games.filter((game) => game.modalidade === modalidade);
    }

    public exibirMais() {
        this.qtdItens += 3;
    }

    public clearFilters() {
        this.categorySelected = 'todos';
        this.gameFornecedor = null;
        this.navigationHistoryService.setCategory(null);
        this.navigationHistoryService.setProvider(null);
    }

    private async getGamesRecommendations() {
        if (this.isLoggedIn) {
            const userId = this.auth.getUser().id;

            try {
                const res = await this.casinoApi.getCasinoRecommendations(userId).toPromise();

                if (res.success) {
                    this.gamesRecommended = res.results ?? [];
                }
            } catch (error) {
                console.error('Erro ao obter recomendações:', error);
            }
        }
    }
}
