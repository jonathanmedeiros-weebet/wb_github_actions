import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, Renderer2, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import {
    AuthService, LayoutService, MenuFooterService, MessageService, ParametrosLocaisService, UtilsService, FinanceiroService, HeadersService,
    GeolocationService,
    AccountVerificationService
} from '../../services';
import { interval, Subject } from 'rxjs';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CadastroModalComponent, LoginModalComponent, StateRestrictionModalComponent } from "../../shared/layout/modals";
import { ConfiguracaoLimitePerdasModalComponent } from 'src/app/shared/layout/modals/configuracao-limite-perdas-modal/configuracao-limite-perdas-modal.component';
import { takeUntil } from "rxjs/operators";
import { Fornecedor } from '../wall/wall.component';
import { GameCasino } from 'src/app/shared/models/casino/game-casino';
import { DepositoComponent } from 'src/app/clientes/deposito/deposito.component';
import { WallProviderFilterModalComponent } from '../wall/components/wall-provider-filter-modal/wall-provider-filter-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { config } from 'src/app/shared/config';
import { ClienteService } from 'src/app/shared/services/clientes/cliente.service';
import { ConfiguracaoLimitePerdasPorcentagemModalComponent } from 'src/app/shared/layout/modals/configuracao-limite-perdas-porcentagem-modal/configuracao-limite-perdas-porcentagem-modal.component';
import { ConfigurationBetLimitModalComponent } from 'src/app/shared/layout/modals/configuration-bet-limit-modal/configuration-bet-limit-modal.component';

@Component({
    selector: 'app-gameview',
    templateUrl: './gameview.component.html',
    styleUrls: ['./gameview.component.css']
})
export class GameviewComponent implements OnInit, OnDestroy {
    @ViewChildren('scrollGames') private gamesScrolls: QueryList<ElementRef>;
    @ViewChild('iframeElement', { static: false }) iframe: ElementRef<HTMLIFrameElement>;
    @ViewChild('continuarJogandoModal', { static: false }) continuarJogandoModal;
    htmlGame;
    gameUrl: SafeUrl = '';
    gameId: string = '';
    gameMode: string = '';
    gameFornecedor: string = '';
    gameName: string = '';
    params: any = [];
    mobileScreen;
    fullscreen;
    elem: any;
    showLoadingIndicator = true;
    showGameListLoadingIndicator = true;
    isCliente;
    sessionId = '';
    removerBotaoFullscreen = false;
    isLoggedIn = false;
    backgroundImageUrl = '';
    headerHeight = 92;
    currentHeight = window.innerHeight - this.headerHeight;
    public isMobile: boolean = false;
    public isDesktop: boolean = false;
    public isTablet: boolean = false;
    public isHorizontalMobile: boolean = false;
    public isFullScreen: boolean = false;
    public cassinoFornecedores: Fornecedor[] = [];
    public scrollStep = 700;
    public scrolls: ElementRef[] = [];
    public gameList: GameCasino[] = [];
    public categorySelected: String = 'cassino';
    public gameCategory: string;
    public gameTitle: string;
    public gameProviderSelected;
    public linkFacebook: string;
    public linkWhatsapp: string;
    public linkTelegram: string;
    public currentUrl: string;
    public sharedMsg: string;
    public qtdGames: number = 10;
    public qtdProviders: number = 10;
    public popularGamesIds: string[] = [];
    private casinoRelatedGamesQuantity: number = 15;
    showModalFlag: boolean = false;
    modalMessage: string = '';
    avisoCancelarBonus = false;
    modalRef;
    unsub$ = new Subject();
    tawakChatClicked: boolean = false;
    gameProviderName: string = '';
    private inGame: boolean = false

    constructor(
        private casinoApi: CasinoApiService,
        private route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer,
        private location: Location,
        private auth: AuthService,
        private menuFooterService: MenuFooterService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private utilsService: UtilsService,
        private renderer: Renderer2,
        private paramsService: ParametrosLocaisService,
        private layoutService: LayoutService,
        private cd: ChangeDetectorRef,
        private el: ElementRef,
        private financeiroService: FinanceiroService,
        private headerService: HeadersService,
        private clienteService: ClienteService,
        private translate: TranslateService,
        private geolocationService: GeolocationService,
        private accountVerificationService: AccountVerificationService,
        @Inject(DOCUMENT) private document: any

    ) {
        this.currentUrl = window.location.href;
    }

    get customCasinoName(): string {
        return this.paramsService.getCustomCasinoName();
    }

    get blink(): string {
        const urlTree = this.router.parseUrl(this.router.url);
        const pathSegments = urlTree.root.children['primary'].segments;
        return Boolean(pathSegments.length) ? pathSegments[0].path : 'casino';
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

    ngOnInit(): void {
        if (window.innerWidth <= 482) {
            this.scrollStep = 200;
        }

        if (window.innerWidth > 482 && window.innerWidth <= 1024) {
            this.isTablet = true;
        }

        this.getGameList();
        this.isLoggedIn = this.auth.isLoggedIn();
        if (this.isLoggedIn) {
            this.getPosicaoFinanceiraBonus()
        }
        const routeParams = this.route.snapshot.params;
        this.backgroundImageUrl = `https://wb-assets.com/img/thumbnails/${routeParams.game_fornecedor}/${routeParams.game_id}.png`;
        this.elem = this.el.nativeElement.querySelector('.game-frame');

        const handleWindowChange = () => {
            this.checkIfMobileOrDesktopOrTablet();

            setTimeout(() => {
                if (this.isLandscape() && (this.isMobile || this.isHorizontalMobile)) {
                    this.resolveGameScreen(true);
                    this.cd.detectChanges();
                }
            }, 200)
        };

        window.addEventListener("resize", handleWindowChange);

        this.hideLiveChats();

        if (this.utilsService.getMobileOperatingSystem() == 'ios') {
            this.removerBotaoFullscreen = true;
        }

        this.elem = document.documentElement;
        this.mobileScreen = window.innerWidth <= 1024;
        this.fullscreen = false;
        this.menuFooterService.setIsPagina(true);

        this.route.params.subscribe(params => {
            this.params = params;
            if (this.router.url.includes('parlaybay')) {
                this.gameId = "170000";
                this.gameMode = 'REAL';
                this.gameFornecedor = 'parlaybay';
            } else {
                this.gameId = params['game_id'];
                this.gameMode = params['game_mode'] ?? 'REAL';
                this.gameFornecedor = params['game_fornecedor'];
            }

            if (['c', 'cl', 'v'].includes(String(this.gameFornecedor))) {
                const casinoAcronyms = {
                    c: 'casino',
                    cl: 'live-casino',
                    v: 'virtual-sports'
                };

                this.router.navigate([casinoAcronyms[String(this.gameFornecedor)]]);
                return;
            }

            this.checkIfMobileOrDesktopOrTablet();

            if (this.avisoCancelarBonus == false) {
                this.loadGame();
            }

            this.auth.logado
                .subscribe(
                    isLoggedIn => {
                        if (isLoggedIn) {
                            this.isLoggedIn = this.auth.isLoggedIn();
                            if (this.avisoCancelarBonus === false) {
                                this.resolveGameScreen();
                            }
                        }
                        if (isLoggedIn || this.gameMode !== 'REAL') {
                            this.inGame = true;
                        }
                    }
                );

            this.auth.cliente
                .subscribe(
                    isCliente => {
                        this.isCliente = isCliente;
                    }
                );

            interval(3000)
                .subscribe(() => {
                    this.showLoadingIndicator = false;
                });
        });

        if (this.gameFornecedor === 'galaxsys') {
            this.appendScriptGalaxsys();
        }

        if ((this.isMobile || this.isTablet || this.isHorizontalMobile) && ((this.gameMode === 'REAL' && this.isLoggedIn) || this.gameMode !== 'REAL')) {
            this.disableHeader();
        }

        if (!this.isLoggedIn && this.isMobile && this.gameMode === 'REAL') {
            this.sharedMsg = encodeURIComponent("Confira este jogo incrível agora mesmo e teste sua sorte! \nBoa diversão! 🎲");

            this.linkFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.currentUrl)}`;
            this.linkWhatsapp = `https://api.whatsapp.com/send/?text=${this.sharedMsg}%0A${encodeURIComponent(this.currentUrl)}&type=custom_url&app_absent=0`;
            this.linkTelegram = `https://telegram.me/share/url?url=${encodeURIComponent(this.currentUrl)}&text=${this.sharedMsg}`;
        }
    }

    abrirLogin() {
        this.modalRef = this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-400 modal-h-350 modal-login',
                centered: true,
            }
        );
    }

    isLandscape(): boolean {
        return window.innerWidth > window.innerHeight;
    }

    checkIfMobileOrDesktopOrTablet() {
        this.isDesktop = false;
        this.isTablet = false;
        this.isMobile = false;
        this.isHorizontalMobile = false;

        if (window.innerWidth > 1024) {
            return this.isDesktop = true;
        }

        if (
            window.innerWidth > 482
            && (window.innerHeight > 320
                && window.innerHeight < window.innerWidth)
        ) {
            return this.isHorizontalMobile = true;
        }

        if (window.innerWidth > 482) {
            return this.isTablet = true;
        }

        return this.isMobile = true;
    }

    ngAfterViewInit() {
        this.gamesScrolls.changes.subscribe(
            (scrolls) => this.scrolls = scrolls.toArray()
        );

        if (!this.isLoggedIn && this.gameMode === 'REAL' && this.isMobile) {
            this.disableHeaderOptions();
            const gameView = this.el.nativeElement.querySelector('.game-view');
            this.renderer.setStyle(gameView, 'max-height', '280px');
        }

        if (this.isTablet || this.isDesktop || this.isHorizontalMobile) {
            this.fixTabletAndDesktopScreen();
        }

        if (this.inGame || (this.isLoggedIn || this.gameMode !== 'REAL')) {
            this.fixInGameSpacings();
        }
    }

    public copyLink() {
        const url = window.location.href;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                this.messageService.success('Link copiado para a área de transferência!')
            });
        } else {
            this.fallbackCopyTextToClipboard(url);
        }
    }

    //copyLink for old navigators
    public fallbackCopyTextToClipboard(text: string) {
        const textArea = document.createElement('textarea');
        textArea.value = text;

        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);

        textArea.select();
        document.execCommand('copy');
        this.messageService.success('Link copiado para a área de transferência!')

        document.body.removeChild(textArea);
    }

    public scrollLeft(scrollId: string) {
        const scrollTemp = this.scrolls.find((scroll) => scroll.nativeElement.id === scrollId + '-scroll');
        scrollTemp.nativeElement.scrollLeft -= this.scrollStep;
    }

    public scrollRight(scrollId: string) {
        const scrollTemp = this.scrolls.find((scroll) => scroll.nativeElement.id === scrollId + '-scroll');

        if (scrollTemp) {
            scrollTemp.nativeElement.scrollLeft += this.scrollStep;
        } else {
            console.error(`Elemento com ID ${scrollId + '-scroll'} não encontrado`);
        }
    }

    public onScroll(scrollId: string) {
        this.cd.detectChanges();
        const scrollTemp = this.scrolls.find((scroll) => scroll.nativeElement.id === scrollId + '-scroll');
        const scrollLeft = scrollTemp.nativeElement.scrollLeft;
        const scrollWidth = scrollTemp.nativeElement.scrollWidth;

        const scrollLeftTemp = this.el.nativeElement.querySelector(`#${scrollId}-left`);
        const scrollRightTemp = this.el.nativeElement.querySelector(`#${scrollId}-right`);
        const maxScrollSize = scrollTemp.nativeElement.clientWidth;

        if (scrollLeft <= 0) {
            this.renderer.addClass(scrollLeftTemp, 'disabled-scroll-button');
            this.renderer.removeClass(scrollLeftTemp, 'enabled-scroll-button');
        } else {
            this.renderer.addClass(scrollLeftTemp, 'enabled-scroll-button');
            this.renderer.removeClass(scrollLeftTemp, 'disabled-scroll-button');
        }

        if ((scrollWidth - (scrollLeft + maxScrollSize)) <= 1) {
            this.renderer.addClass(scrollRightTemp, 'disabled-scroll-button');
            this.renderer.removeClass(scrollRightTemp, 'enabled-scroll-button');
        } else {
            this.renderer.addClass(scrollRightTemp, 'enabled-scroll-button');
            this.renderer.removeClass(scrollRightTemp, 'disabled-scroll-button');
        }
    }

    changeGameviewHeight() {
        if (!this.isMobile) {
            const headerHeight = this.headerHeight;
            const contentEl = this.el.nativeElement.querySelector('.game-frame');
            const headerGameView = this.el.nativeElement.querySelector('.header-game-view').getBoundingClientRect().height;
            const height = window.innerHeight - headerHeight - headerGameView;
        }
    }

    showModalBetLimit(message: string, betLimitHit = true) {
        const modalRef = this.modalService.open(ConfigurationBetLimitModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            windowClass: 'modal-pop-up',
            centered: true,
            backdrop: 'static',
        });

        modalRef.componentInstance.message = message;
        modalRef.componentInstance.betLimitHit = betLimitHit;
    }

    showModal(message: string) {
        const modalRef = this.modalService.open(ConfiguracaoLimitePerdasModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            windowClass: 'modal-pop-up',
            centered: true,
            backdrop: 'static',
        });

        modalRef.componentInstance.message = message;
    }

    showModalPercentage(message_percentage: string) {
        const modalRef = this.modalService.open(ConfiguracaoLimitePerdasPorcentagemModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            windowClass: 'modal-pop-up',
            centered: true,
            backdrop: 'static',
        });
        modalRef.componentInstance.message = message_percentage;
    }

    showModalState() {
        const modalRef = this.modalService.open(StateRestrictionModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            windowClass: 'modal-pop-up',
            centered: true,
            backdrop: 'static',
        });
    }

    async loadGame() {
        if (this.paramsService.getEnableRequirementPermissionRetrieveLocation()) {
            await this.geolocationService.saveLocalStorageLocation();

            if (!this.geolocationService.checkGeolocation()) {
                this.handleError(this.translate.instant('geral.geolocationError'));
                this.router.navigate(['/']);
                return;
            }
        }

        const restrictionStateBet = this.paramsService.getRestrictionStateBet();

        if (restrictionStateBet != 'Todos') {
            let localeState = localStorage.getItem('locale_state');

            if (restrictionStateBet != localeState) {
                this.showModalState();
                this.router.navigate(['/']);
                return;
            }
        }

        this.casinoApi.getGameUrl(this.gameId, this.gameMode, this.gameFornecedor, this.isMobile)
            .subscribe(
                response => {
                    if (response['error'] == 1) {
                        this.handleError(this.translate.instant('geral.erroInesperado').toLowerCase());
                        this.router.navigate(['/']);
                    };

                    if (response?.loss_limit?.loss_hit && response?.loss_limit?.error) {
                        this.showModal(response.loss_limit.message);
                        this.router.navigate(['/']);
                    }

                    if (!response?.loss_limit?.loss_hit && response?.loss_limit?.error) {
                        this.showModalPercentage(response.loss_limit.message);
                    }

                    if (response?.bet_limit?.bet_limit_hit && response?.bet_limit?.error) {
                        this.showModalBetLimit(response.bet_limit?.message);
                        this.router.navigate(['/']);
                    }

                    if (!response?.bet_limit?.bet_limit_hit && response?.bet_limit?.error) {
                        this.showModalBetLimit(response.bet_limit?.message, false);
                    }

                    if (typeof response.gameUrl !== 'undefined') {
                        this.gameCategory = response.category;
                        this.gameFornecedor = response.fornecedor;
                        this.gameName = response.gameName;
                        this.gameProviderName = response.gameFornecedorExibicao;
                        this.backgroundImageUrl = response.gameImageExt ? 'https://weebet.s3.amazonaws.com/' + config.SLUG + '/img/thumbnails/' + response.gameId + response.gameImageExt : `https://wb-assets.com/img/thumbnails/${response.fornecedor}/${response.gameId}.png`;
                    } else {
                        // if(this.gameFornecedor !== 'pgsoft') {
                            this.gameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.gameURL);
                        // } else {
                            // this.htmlGame = response.htmlGame;
                        // }
                        this.sessionId = response.sessionId;
                        if ((this.gameFornecedor == 'tomhorn')) {
                            this.gameName = response.gameName.split("- 9", 1) || "";
                        } else {
                            this.gameName = response.gameName || "";
                        }
                    }

                    this.getRelatedAndPopularGames(response.category, this.isCassinoAoVivoPage ? true : false);
                },
                error => {
                    this.handleError(this.translate.instant('geral.erroInesperado').toLowerCase());
                    this.router.navigate(['/']);
                });
    }

    onIframeLoad(iframe: HTMLIFrameElement) {
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        if (this.htmlGame) {
            doc.open();
            doc.write(this.htmlGame);
            doc.close();
        }
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    back(): void {
        if (this.modalRef) {
            this.modalRef.close();
        }

        switch (this.gameFornecedor) {
            case 'tomhorn':
                this.closeSessionGameTomHorn();
                this.location.back();
                break;
            case 'parlaybay':
                this.router.navigate(['pb']);
                break;
            case 'ezugi':
            case 'evolution':
                this.router.navigate(['live-casino']);
                break;
            case 'pascal':
            case 'galaxsys':
            case 'pgsoft':
                this.router.navigate(['casino']);
                break;
            default:
                this.location.back();
        }

        if (this.fullscreen) {
            this.closeFullscreen();
        }
    }

    ngOnDestroy() {

        if (this.gameFornecedor === 'tomhorn') {
            this.closeSessionGameTomHorn();
        }

        if (this.mobileScreen) {
            this.menuFooterService.setIsPagina(false);
        } else {
            this.menuFooterService.setIsPagina(true);
        }

        this.restoreLiveChats();

        if (this.headerService.getIsHeaderDisabled) {
            this.disableHeaderOptions();
            this.enableHeader();
        } else {
            this.disableHeaderOptions();
        }
    }

    disableHeaderOptions() {
        const optionsHeader = this.el.nativeElement.querySelector('.header-game-view');

        if (optionsHeader) {
            this.renderer.setStyle(optionsHeader, 'display', 'none');
        }
    }

    openFullscreenMob() {
        const gameFrame = this.el.nativeElement.querySelector('.game-frame');
        const optionsHeader = this.el.nativeElement.querySelector('.header-game-view');
        const optionsHeaderHeight = optionsHeader.getBoundingClientRect().height;
        const calculatedGameHeight = `calc(100% - ${optionsHeaderHeight}px)`;

        if (gameFrame && !optionsHeader.classList.contains('in-game')) {
            this.toggleGameFrameStylesMob(gameFrame, optionsHeader, calculatedGameHeight);
        }

        this.toggleFullscreenMob();

        this.adjustFloatingButtons();

        this.fullscreen = true;
    }

    openFullscreenTablet() {
        if (this.elem.requestFullscreen) {
            this.elem.requestFullscreen();
        } else if (this.elem.mozRequestFullScreen) {
            /* Firefox */
            this.elem.mozRequestFullScreen();
        } else if (this.elem.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            this.elem.webkitRequestFullscreen();
        } else if (this.elem.msRequestFullscreen) {
            /* IE/Edge */
            this.elem.msRequestFullscreen();
        }

        const gameFrame = this.el.nativeElement.querySelector('.game-frame');

        if (gameFrame.classList.contains('in-game')) {
            this.renderer.setStyle(gameFrame, 'height', 'calc(100dvh - 50px)');
        }

        this.fullscreen = true;
    }

    closeFullscreenTablet() {
        if (this.document.exitFullscreen) {
            this.document.exitFullscreen();
        } else if (this.document.mozCancelFullScreen) {
            /* Firefox */
            this.document.mozCancelFullScreen();
        } else if (this.document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            this.document.webkitExitFullscreen();
        } else if (this.document.msExitFullscreen) {
            /* IE/Edge */
            this.document.msExitFullscreen();
        }

        this.fullscreen = false;
    }

    toggleGameFrameStylesMob(gameFrame: any, optionsHeader: any, calculatedGameHeight: string) {
        if (!this.isFullScreen) {
            this.setFixedPositionStylesMob(optionsHeader, gameFrame, calculatedGameHeight);
        } else {
            this.removeFixedPositionStylesMob(optionsHeader, gameFrame);
        }
    }

    setFixedPositionStylesMob(optionsHeader: any, gameFrame: any, calculatedGameHeight: string) {
        this.renderer.setStyle(optionsHeader, 'position', 'fixed');
        this.renderer.setStyle(optionsHeader, 'width', '100%');
        this.renderer.setStyle(optionsHeader, 'top', '0');

        this.renderer.setStyle(gameFrame, 'position', 'fixed');
        this.renderer.setStyle(gameFrame, 'top', `${optionsHeader.getBoundingClientRect().height}px`);
        this.renderer.setStyle(gameFrame, 'height', calculatedGameHeight);
    }

    removeFixedPositionStylesMob(optionsHeader: any, gameFrame: any) {
        this.renderer.removeStyle(optionsHeader, 'position');
        this.renderer.removeStyle(optionsHeader, 'width');
        this.renderer.removeStyle(optionsHeader, 'top');

        this.renderer.removeStyle(gameFrame, 'position');
        this.renderer.removeStyle(gameFrame, 'top');
        this.renderer.setStyle(gameFrame, 'height', '100%');
    }

    toggleFullscreenMob() {
        if (!this.isFullScreen) {
            this.requestFullscreenMob(this.elem);
        } else {
            this.exitFullscreenMob();
        }
    }

    requestFullscreenMob(element: any) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen(); // Firefox
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(); // Chrome, Safari, Opera
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen(); // IE/Edge
        }
    }

    exitFullscreenMob() {
        if (this.document.exitFullscreen) {
            this.document.exitFullscreen();
        } else if (this.document.mozCancelFullScreen) {
            this.document.mozCancelFullScreen(); // Firefox
        } else if (this.document.webkitExitFullscreen) {
            this.document.webkitExitFullscreen(); // Chrome, Safari, Opera
        } else if (this.document.msExitFullscreen) {
            this.document.msExitFullscreen(); // IE/Edge
        }

        this.fullscreen = false;
    }

    adjustFloatingButtons() {
        const botaoContatoFlutuante = this.document.getElementsByClassName('botao-contato-flutuante')[0];
        if (botaoContatoFlutuante) {
            this.renderer.setStyle(botaoContatoFlutuante, 'z-index', '1000');
        }

        const jivoChatBtn = this.document.getElementsByTagName('jdiv')[0];
        if (jivoChatBtn) {
            this.renderer.setStyle(jivoChatBtn, 'display', 'inline');
        }

        const liveChatBtn = this.document.getElementById('chat-widget-container');
        if (liveChatBtn) {
            this.renderer.setStyle(liveChatBtn, 'display', 'block');
        }

        const zendeskChat = this.document.querySelector('iframe#launcher');
        if (zendeskChat) {
            this.renderer.setStyle(zendeskChat, 'display', 'block');
        }
    }

    openFullscreen() {
        if (this.elem.requestFullscreen) {
            this.elem.requestFullscreen();
        } else if (this.elem.mozRequestFullScreen) {
            /* Firefox */
            this.elem.mozRequestFullScreen();
        } else if (this.elem.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            this.elem.webkitRequestFullscreen();
        } else if (this.elem.msRequestFullscreen) {
            /* IE/Edge */
            this.elem.msRequestFullscreen();
        }

        this.disableHeader();

        const optionsHeader = this.el.nativeElement.querySelector('.header-game-view');

        if (optionsHeader) {
            this.renderer.setStyle(optionsHeader, 'margin', '0');
        }

        const gameView = this.el.nativeElement.querySelector('.game-view');
        const gameFrame = this.el.nativeElement.querySelector('.game-frame');

        if (gameView) {
            this.renderer.addClass(gameView, 'desktop-fullscreen');
            this.renderer.setStyle(gameView, 'padding', '0');
        }

        if (gameFrame.classList.contains('in-game')) {
            this.renderer.setStyle(gameFrame, 'height', 'calc(100vh - 50px)');
        }

        const footer = this.el.nativeElement.querySelector('.main-footer');
        const blocoProvider = this.el.nativeElement.querySelector('.bloco-providers');
        const blocoRelatedGames = this.el.nativeElement.querySelector('.bloco-relatedGames');
        const backButton = this.el.nativeElement.querySelector('app-back-page');


        if (footer) {
            this.renderer.setStyle(footer, 'display', 'none');
        }

        if (blocoProvider) {
            this.renderer.setStyle(blocoProvider, 'display', 'none');
        }

        if (blocoRelatedGames) {
            this.renderer.setStyle(blocoRelatedGames, 'display', 'none');
        }

        if (backButton) {
            this.renderer.setStyle(backButton, 'display', 'none');
        }

        this.fullscreen = true;
    }

    closeFullscreen() {
        if (this.document.exitFullscreen) {
            this.document.exitFullscreen();
        } else if (this.document.mozCancelFullScreen) {
            /* Firefox */
            this.document.mozCancelFullScreen();
        } else if (this.document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            this.document.webkitExitFullscreen();
        } else if (this.document.msExitFullscreen) {
            /* IE/Edge */
            this.document.msExitFullscreen();
        }

        this.enableHeader();

        const optionsHeader = this.el.nativeElement.querySelector('.header-game-view');

        const gameView = this.el.nativeElement.querySelector('.game-view');
        const gameFrame = this.el.nativeElement.querySelector('.game-frame');

        if (gameView) {
            this.renderer.removeClass(gameView, 'desktop-fullscreen');
        }

        if (gameView && !gameFrame.classList.contains('in-game')) {
            if (!this.isTablet) {
                this.renderer.setStyle(optionsHeader, 'margin', '0 20px');
            }
            this.renderer.setStyle(gameView, 'padding', '12px 12px 0px 12px');
        }

        if (gameFrame.classList.contains('in-game')) {
            this.renderer.setStyle(gameFrame, 'height', 'calc(100% - 140px)');
        }

        const footer = this.el.nativeElement.querySelector('.main-footer');
        const blocoProvider = this.el.nativeElement.querySelector('.bloco-providers');
        const blocoRelatedGames = this.el.nativeElement.querySelector('.bloco-relatedGames');
        const backButton = this.el.nativeElement.querySelector('app-back-page');

        if (backButton) {
            this.renderer.setStyle(backButton, 'display', 'flex');
        }

        if (footer) {
            this.renderer.setStyle(footer, 'display', 'block');
        }

        if (blocoProvider) {
            this.renderer.setStyle(blocoProvider, 'display', 'block');
        }

        if (blocoRelatedGames) {
            this.renderer.setStyle(blocoRelatedGames, 'display', 'block');
        }

        this.fullscreen = false;
    }

    isAppMobile() {
        let result = false;
        const appMobile = JSON.parse(localStorage.getItem('app-mobile'));
        if (appMobile) {
            result = appMobile;
        }
        return result;
    }

    get isDemo(): boolean {
        return location.host === 'demo.wee.bet';
    }

    closeSessionGameTomHorn() {
        this.casinoApi.closeSessionTomHorn(this.sessionId).subscribe(response => {
        }, error => {
        });
    }

    appendScriptGalaxsys() {
        let body = document.getElementsByTagName('body')[0];
        let bodyScript = document.createElement('script');

        bodyScript.append('window.addEventListener("message",(e) => {const { type, mainDomain } = e.data; if(type === "rgs-backToHome") {window.location.href = mainDomain;}});');
        bodyScript.id = 'galaxsysScript';
        body.appendChild(bodyScript);
    }

    abrirCadastro() {
        this.auth.openRegisterV3Modal();
    }

    async openDeposit() {
        if (!this.accountVerificationService.terms_accepted.getValue()) {
            const termsResult = await this.accountVerificationService.openModalTermsPromise();
            if (!termsResult) return;
        }

        if (!this.accountVerificationService.accountVerified.getValue()) {
            this.accountVerificationService.openModalAccountVerificationAlert();
            return;
        }

        this.modalService.open(DepositoComponent);
    }

    getPosicaoFinanceiraBonus() {
        this.auth.getPosicaoFinanceira()
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                posicaoFinanceira => {
                    if (posicaoFinanceira.bonus > 0 && posicaoFinanceira.bonus < 1) {
                        this.avisoCancelarBonus = true;
                        if (this.gameMode === 'REAL') {
                            this.abriModalContinuarJogando();
                        }
                    }
                },
                error => {
                    if (error === 'Não autorizado.' || error === 'Login expirou, entre novamente.') {
                        this.auth.logout();
                    } else {
                        this.handleError(error);
                    }
                }
            );
    }

    abriModalContinuarJogando() {
        this.modalRef = this.modalService.open(
            this.continuarJogandoModal,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-pop-up',
                centered: true,
                backdrop: 'static',
                keyboard: false
            }
        );
    }

    continuarBonus() {
        this.modalRef.close();
    }

    continuarSaldoReal() {
        this.financeiroService.cancelarBonusAtivos()
            .subscribe(
                response => {
                    this.modalRef.close();
                    this.loadGame();
                },
                error => {
                    this.handleError(error);
                }
            );

    }

    private fixMobileHeader() {
        const gameViewHeader = this.el.nativeElement.querySelector('.header-game-view');

        if (gameViewHeader) {
            this.renderer.setStyle(gameViewHeader, 'display', 'flex');
        }
    }

    private fixTabletHeader() {
        const gameViewHeader = this.el.nativeElement.querySelector('.header-game-view');
        const gameView = this.el.nativeElement.querySelector('.game-view');

        if (gameViewHeader) {
            this.renderer.setStyle(gameViewHeader, 'display', 'flex');
        }
        if (gameView) {
            this.renderer.setStyle(gameView, 'padding-top', '50px');
            this.renderer.setStyle(gameView, 'position', 'fixed');
        }
    }

    private fixInGameSpacings() {
        const blocoContainer = this.el.nativeElement.querySelector('.bloco-container-gameview');

        if (blocoContainer) {
            this.renderer.setStyle(blocoContainer, 'padding', '0');
        }
    }

    private async getRelatedAndPopularGames(category: string, live: boolean = false) {
        const response = await this.casinoApi.getGamesList(live).toPromise();

        this.gameList = await this.filterDestaques(response.populares, category);
        this.showGameListLoadingIndicator = false;
    }

    private async getProviders() {
        const {
            fornecedores,
        } = await this.casinoApi.getGamesList(false).toPromise();

        this.cassinoFornecedores = fornecedores.map((fornecedor: Fornecedor) => ({
            ...fornecedor,
            imagem: `https://wb-assets.com/img/cassino/logos/providers/${fornecedor.gameFornecedor}.png`
        }));
    }

    private async getLiveProviders() {
        const {
            fornecedores,
        } = await this.casinoApi.getGamesList(true).toPromise();

        this.cassinoFornecedores = fornecedores.map((fornecedor: Fornecedor) => ({
            ...fornecedor,
            imagem: `https://wb-assets.com/img/cassino/logos/providers/${fornecedor.gameFornecedor}.png`
        }));
    }

    public redirectToFilteredProviders(provider) {
        const providerName = provider.gameFornecedor;

        if (this.router.url.startsWith('/live-casino/')) {
            this.router.navigate(['live-casino'], { queryParams: { category: 'todos', provider: providerName } }).then(() => {
                this.location.replaceState('live-casino');
            });
        }

        if (this.router.url.startsWith('/casino/')) {
            this.router.navigate(['casino'], { queryParams: { category: 'todos', provider: providerName } }).then(() => {
                this.location.replaceState('casino');
            });
        }
    }

    public showMoreGames() {
        this.qtdGames += 3;
    }

    public showMoreProviders() {
        this.qtdProviders += 3;
    }

    public handleSeeAllGames() {
        const category = this.gameCategory;

        if (this.router.url.startsWith('/live-casino/')) {
            this.router.navigate(['live-casino'], { queryParams: { category: category, providerName: 'todos' } }).then(() => {
                this.location.replaceState('live-casino');
            });
        }

        if (this.router.url.startsWith('/casino/')) {
            this.router.navigate(['casino'], { queryParams: { category: category, providerName: 'todos' } }).then(() => {
                this.location.replaceState('casino');
            })
        }
    }

    private filterDestaques(games: GameCasino[], category: string): Promise<GameCasino[]> {
        return new Promise((resolve) => {
            let filteredGames = games
                .filter((game) => {
                    if (game.category === category && game.gameID !== this.gameId) {
                        if (!this.popularGamesIds.includes(game.gameID)) {
                            this.popularGamesIds.push(game.gameID);
                        }
                        return true;
                    }
                    return false;
                });

            if (filteredGames.length < this.casinoRelatedGamesQuantity) {
                if (!this.popularGamesIds.includes(this.gameId)) {
                    this.popularGamesIds.push(this.gameId);
                }
                let missingGamesCalc = this.casinoRelatedGamesQuantity - filteredGames.length;

                this.casinoApi.getCasinoGamesRelated(category, this.popularGamesIds, missingGamesCalc).subscribe(
                    response => {
                        filteredGames = filteredGames.concat(response);
                        resolve(filteredGames);
                    }
                );
            } else {
                resolve(filteredGames.slice(0, 15));
            }
        });
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
        modalRef.result.then(({ event, data }) => {
            if (event == 'apply') {
                const { providerSelected } = data;
                this.router.navigate(['/casino', providerSelected]);
            }
        })
    }

    private disableHeader() {
        this.headerService.openCasinoFullScreen();
    }

    private enableHeader() {
        this.headerService.closeCasinoFullScreen();
    }

    private fixTabletAndDesktopScreen() {
        const gameView = this.el.nativeElement.querySelector('.game-view');
        const gameFrame = this.el.nativeElement.querySelector('.game-frame');
        const headerOptions = this.el.nativeElement.querySelector('.header-game-view');

        if (!gameFrame || !gameView) {
            console.error("Game frame or gameView not found");
            return false;
        }

        if (this.isTablet) {
            if (gameView.classList.contains('is-tablet') && (gameFrame.classList.contains('in-game') && gameFrame.classList.contains('is-tablet'))) {
                this.renderer.setStyle(gameView, 'padding-top', '50px');
                this.renderer.setStyle(gameView, 'position', 'fixed');
                this.renderer.setStyle(gameFrame, 'height', 'calc(100vh - 50px)');
                this.renderer.setStyle(gameFrame, 'style', 'margin-top: 0');
            }
        }

        if ((!this.isTablet && this.isDesktop) && ((gameView.classList.contains('in-game') || this.inGame))) {
            if (gameFrame) {
                this.renderer.setStyle(gameFrame, 'position', 'fixed');
                this.renderer.setStyle(gameFrame, 'margin-top', '43px');

                this.layoutService.currentIndiqueGanheCardHeight.subscribe(indiqueGanheHeight => {
                    const newHeight = 132 + indiqueGanheHeight;
                    this.renderer.setStyle(gameFrame, 'height', `calc(100% - ${newHeight}px)`);
                });
            }
        }

        if ((!this.isTablet && this.isDesktop) && (!gameView.classList.contains('in-game'))) {
            if (headerOptions) {
                this.renderer.setStyle(headerOptions, 'margin', '0 18px');
            }
        }

        if (this.isHorizontalMobile) {
            this.disableHeader();
            if (gameView) {
                this.renderer.setStyle(gameView, 'padding-top', '50px');
                this.renderer.setStyle(gameView, 'width', '100dvw');
                this.renderer.setStyle(gameView, 'height', '100dvh');
                this.renderer.setStyle(gameView, 'position', 'fixed');
                this.renderer.setStyle(gameView, 'top', '0');
            }

            if (gameFrame) {
                this.renderer.setStyle(gameFrame, 'height', 'calc(100dvh - 50px)');
            }
        }
    }

    private getGameList() {
        if (this.isCassinoPage || this.isVirtualPage) {
            this.getProviders();
        }

        if (this.isCassinoAoVivoPage) {
            this.getLiveProviders();
        }
    }

    private resolveGameScreen(disableHeaderForced = false) {
        if (this.isMobile && this.gameMode === 'REAL') {
            this.disableHeader();
            if(disableHeaderForced) this.disableHeader();
            this.fixMobileHeader();
        }

        if (this.isTablet && this.gameMode === 'REAL') {
            this.disableHeader();
            if(disableHeaderForced) this.disableHeader();
            this.fixTabletHeader();
        }

        if ((this.isDesktop || this.isHorizontalMobile) && this.gameMode === 'REAL') {
            this.fixTabletAndDesktopScreen();
        }
    }

    private hideLiveChats() {
        const botaoContatoFlutuante = this.document.getElementsByClassName('botao-contato-flutuante')[0];

        if (botaoContatoFlutuante) {
            this.renderer.setStyle(botaoContatoFlutuante, 'z-index', '-1');
        }

        const jivoChatBtn = this.document.getElementsByTagName('jdiv')[0];
        if (jivoChatBtn) {
            this.renderer.setStyle(jivoChatBtn, 'display', 'none');
        }

        const liveChatBtn = this.document.getElementById('chat-widget-container');
        if (liveChatBtn) {
            this.renderer.setStyle(liveChatBtn, 'display', 'none');
        }

        const TawkChat = this.document.querySelector('.widget-visible') as HTMLElement;
        if (TawkChat) {
            const tawakIframes = this.document.querySelectorAll('[title="chat widget"]')
            this.tawakChatClicked = tawakIframes[1].style.display == 'block'

            tawakIframes.forEach(iframeChat => this.renderer.setStyle(iframeChat, 'display', 'none'));
        }

        const zendeskChat = this.document.querySelector('iframe#launcher');
        if (zendeskChat) {
            this.renderer.setStyle(zendeskChat, 'display', 'none');
        }

        const intercomBtnChat = this.document.querySelector('.intercom-launcher');
        if (intercomBtnChat) {
            this.renderer.setStyle(intercomBtnChat, 'display', 'none');
        }

        const intercomContainer = this.document.querySelector('#intercom-container');
        if (intercomContainer) {
            this.renderer.setStyle(intercomContainer, 'display', 'none');
        }
    }

    private restoreLiveChats() {
        let scriptGalaxsys = document.getElementById("galaxsysScript");

        if (scriptGalaxsys) {
            scriptGalaxsys.remove();

            const botaoContatoFlutuante = this.document.getElementsByClassName('botao-contato-flutuante')[0];
            if (botaoContatoFlutuante) {
                this.renderer.setStyle(botaoContatoFlutuante, 'z-index', '1000');
            }

            const jivoChatBtn = this.document.getElementsByTagName('jdiv')[0];
            if (jivoChatBtn) {
                this.renderer.setStyle(jivoChatBtn, 'display', 'inline');
            }

            const liveChatBtn = this.document.getElementById('chat-widget-container');
            if (liveChatBtn) {
                this.renderer.setStyle(liveChatBtn, 'display', 'block');
            }

            const zendeskChat = this.document.querySelector('iframe#launcher');
            if (zendeskChat) {
                this.renderer.setStyle(zendeskChat, 'display', 'block');
            }
        }

        const botaoContatoFlutuante = this.document.getElementsByClassName('botao-contato-flutuante')[0];
        if (botaoContatoFlutuante) {
            this.renderer.setStyle(botaoContatoFlutuante, 'z-index', '1000');
        }

        const jivoChatBtn = this.document.getElementsByTagName('jdiv')[0];
        if (jivoChatBtn) {
            this.renderer.setStyle(jivoChatBtn, 'display', 'inline');
        }

        const liveChatBtn = this.document.getElementById('chat-widget-container');
        if (liveChatBtn) {
            this.renderer.setStyle(liveChatBtn, 'display', 'block');
        }

        const zendeskChat = this.document.querySelector('iframe#launcher');
        if (zendeskChat) {
            this.renderer.setStyle(zendeskChat, 'display', 'block');
        }

        const TawkChat = this.document.querySelector('.widget-visible') as HTMLElement;
        if (TawkChat) {
            this.document.querySelectorAll('[title="chat widget"]').forEach((iframeChat, key) => {
                if (key != 1 || this.tawakChatClicked) {
                    this.renderer.setStyle(iframeChat, 'display', 'block');
                }
            });
        }

        const intercomBtnChat = this.document.querySelector('.intercom-launcher');
        if (intercomBtnChat) {
            this.renderer.setStyle(intercomBtnChat, 'display', 'block');
        }

        const intercomContainer = this.document.querySelector('#intercom-container');
        if (intercomContainer) {
            this.renderer.setStyle(intercomContainer, 'display', 'block');
        }
    }
}
