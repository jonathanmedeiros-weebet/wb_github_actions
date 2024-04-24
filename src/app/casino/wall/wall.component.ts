import { GameCasino } from './../../shared/models/casino/game-casino';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren, Input, ViewChild } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import { AuthService, ParametrosLocaisService, SidebarService } from './../../services';
import { Router } from '@angular/router';
import { LoginModalComponent } from '../../shared/layout/modals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
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
    public gamesSlot: GameCasino[];
    public gamesCrash: GameCasino[];
    public gamesRaspadinha: GameCasino[];
    public gamesRoleta: GameCasino[];
    public gamesMesa: GameCasino[];
    public gamesBingo: GameCasino[];
    public gamesLive: GameCasino[];
    private newGamesCassino: GameCasino[];
    public cassinoFornecedores: Fornecedor[] = [];

    public gameFornecedor: string;
    public categorySelected: string = 'cassino';
    public gameTitle: string;

    constructor(
        private casinoApi: CasinoApiService,
        private auth: AuthService,
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
        return !this.showLoadingIndicator && !this.isVirtual;
    }

    get isDemo(): boolean {
        return location.host === 'demo.wee.bet';
    }

    get blink(): string {
        return this.router.url.split('/')[1] ?? 'casino';
    }

    get isHomeCassino(): boolean {
        return ['', 'todos', 'cassino'].includes(this.categorySelected) && !this.gameFornecedor && !this.isVirtual
    }

    get isVirtual(): boolean {
        return this.blink === 'virtual-sports';
    }

    get isMobile(): boolean {
        return window.innerWidth < 1025;
    }

    get isSalsaCassino(): boolean {
        return this.paramsService.getOpcoes().salsa_cassino;
    }

    ngOnInit(): void {
        this.cd.detectChanges();

        if (this.isHomeCassino || this.isVirtual) {
            this.getGameCassinoList();
        }

        if (this.isMobile) {
            this.scrollStep = 200;
        }

        this.auth.logado.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
        this.auth.cliente.subscribe(isCliente => this.isCliente = isCliente);
    }

    private getGameCassinoList() {
        this.casinoApi.getGamesList(false).subscribe(response => {
            this.cassinoFornecedores = response.fornecedores.map((fornecedor: Fornecedor) => ({
                ...fornecedor,
                imagem: `https://cdn.wee.bet/img/cassino/logos/providers/${fornecedor.gameFornecedor}.png`
            }));

            if (this.isVirtual) {
                this.sideBarService.changeItens({
                    contexto: 'virtuais',
                    dados: {}
                });
                this.gamesCassino = response.gameList.filter(function(game) {
                    return game.category === 'virtual';
                });

                this.categorySelected = 'virtual';
            } else {
                this.gamesCassino = response.gameList.filter(function(game) {
                    return game.dataType !== 'VSB';
                });

                this.newGamesCassino = response.news;
                this.gamesDestaque = response.populares;
                this.gamesSlot = this.filterDestaques(this.gamesCassino, 'slot');
                this.gamesCrash = this.filterDestaques(this.gamesCassino, 'crash');
                this.gamesRaspadinha = this.filterDestaques(this.gamesCassino, 'scratchcard');
                this.gamesRoleta = this.filterDestaques(this.gamesCassino, 'roulette');
                this.gamesMesa = this.filterDestaques(this.gamesCassino, 'table');
                this.gamesBingo = this.filterDestaques(this.gamesCassino, 'bingo');
                this.gamesLive = this.filterDestaques(this.gamesCassino, 'live');

                this.sideBarService.changeItens({
                    contexto: 'casino',
                    dados: {}
                });

                this.categorySelected = 'cassino';
            }

            this.gameList = this.gamesCassino;
            this.gameTitle = this.translate.instant('geral.todos');
            this.listagemJogos.nativeElement.scrollTo(0, 0);

            // this.filterGames('todos', this.categorySelected, false);
            this.showLoadingIndicator = false;
        });
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

    public async filterGames(
        provider: string = '',
        category: string = '',
        enableSelectProvider: boolean = true
    ) {
        let providerName = provider ?? this.gameFornecedor;
        let categoryName = this.getCategorySlug(category ?? this.categorySelected);
        this.gameTitle = this.getGameTitle(category);
        this.categorySelected = category ?? 'cassino';
        let gamesCassinoList = this.gamesCassino;

        if(['news', 'destaques'].includes(categoryName)) {
            gamesCassinoList = categoryName === 'news' ? this.newGamesCassino : this.gamesDestaque;
        }

        if(['cassino', 'todos', 'news', 'destaques', 'virtual'].includes(categoryName)) {
            categoryName = null;
        }

        if(enableSelectProvider){
            // Responsável pela seleção do provedor no front;
            providerName = (this.gameFornecedor !== providerName) ? providerName : null;
            this.gameFornecedor = providerName;
        }

        console.log(providerName)
        console.log(categoryName)


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
        }
        console.log(this.gameList)
    }

    private getGameTitle(category: string) {
        const gameTitles = {
            slot: this.translate.instant('cassino.slot'),
            crash: this.translate.instant('cassino.crash'),
            roulette: this.translate.instant('cassino.roleta'),
            table: this.translate.instant('cassino.mesa'),
            bingo: this.translate.instant('cassino.bingo'),
            scratchcard: this.translate.instant('cassino.raspadinha'),
            destaques: this.translate.instant('cassino.maisPopulares'),
            news: this.translate.instant('cassino.news'),
            todos: this.translate.instant('geral.todos'),
            cassino: this.translate.instant('geral.todos'),
            virtual: this.translate.instant('geral.todos')
        }

        return gameTitles[category] ?? ''
    }

    private getCategorySlug(category: string) {
        const categories = {
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
}
