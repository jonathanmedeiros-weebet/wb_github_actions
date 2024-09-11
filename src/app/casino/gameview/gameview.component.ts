import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, Renderer2, QueryList, ViewChildren, ViewChild , ViewChild} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {AuthService, LayoutService, MenuFooterService, MessageService, ParametrosLocaisService, UtilsService, FinanceiroService} from '../../services';
import {interval, Subject} from 'rxjs';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
    CadastroModalComponent,
    CanceledBonusConfirmComponent,
    JogosLiberadosBonusModalComponent,
    LoginModalComponent,
    RegrasBonusModalComponent
} from "../../shared/layout/modals";
import {takeUntil} from "rxjs/operators";
import { Fornecedor } from '../wall/wall.component';
import { GameCasino } from 'src/app/shared/models/casino/game-casino';

@Component({
    selector: 'app-gameview',
    templateUrl: './gameview.component.html',
    styleUrls: ['./gameview.component.css']
})
export class GameviewComponent implements OnInit, OnDestroy {
    @ViewChild('providersScroll', { static: false }) providersScroll: ElementRef;
    @ViewChild('relatedGamesScroll', { static: false }) relatedGamesScroll: ElementRef;
    @ViewChildren('scrollGames') private gamesScrolls: QueryList<ElementRef>;
    @ViewChild('continuarJogandoModal', {static: true}) continuarJogandoModal;
    gameUrl: SafeUrl = '';
    gameId: String = '';
    gameMode: String = '';
    gameFornecedor: String = '';
    gameName: String = '';
    params: any = [];
    mobileScreen;
    fullscreen;
    elem: any;
    showLoadingIndicator = true;
    isCliente;
    sessionId = '';
    isMobile = 0;
    removerBotaoFullscreen = false;
    isLoggedIn = false;
    backgroundImageUrl = '';
    headerHeight = 92;
    currentHeight = window.innerHeight - this.headerHeight;
    modalRef;
    isMob: boolean = false;
    isDesktop: boolean = false;
    isFullScreen: boolean = false;
    public cassinoFornecedores: Fornecedor[] = [];
    public scrollStep = 700;
    public scrolls: ElementRef[] = [];
    public gameList: GameCasino[];
    public categorySelected: String = 'cassino';
    public gameCategory: string;
    public gameTitle: string;
    public gameProviderSelected;
    public linkFacebook:string;
    public linkWhatsapp:string;
    public linkTelegram:string;
    public currentUrl:string;
    public sharedMsg:string;
    public qtdGames: number = 10;
    public qtdProviders: number = 10;
    public popularGamesIds: string[] = [];
    private casinoRelatedGamesQuantity: number = 15;
    posicaoFinanceira;
    avisoCancelarBonus = false;
    modalRef;
    unsub$ = new Subject();

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
        @Inject(DOCUMENT) private document: any
    ) {
        this.currentUrl = window.location.href;
    }

    get customCasinoName(): string {
        return this.paramsService.getCustomCasinoName();
    }

    ngOnInit(): void {
        if (window.innerWidth <= 482) {
            this.scrollStep = 200;
        }

        this.sharedMsg = encodeURIComponent("Confira este jogo incrível agora mesmo e teste sua sorte! \nBoa diversão! 🎲");

        this.linkFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.currentUrl)}`;
        this.linkWhatsapp = `https://api.whatsapp.com/send/?text=${this.sharedMsg}%0A${encodeURIComponent(this.currentUrl)}&type=custom_url&app_absent=0`;
        this.linkTelegram = `https://telegram.me/share/url?url=${encodeURIComponent(this.currentUrl)}&text=${this.sharedMsg}`;

        this.getFornecedores();
        this.isLoggedIn = this.auth.isLoggedIn();
        if(this.isLoggedIn) {
            this.getPosicaoFinanceira()
        }
        const routeParams = this.route.snapshot.params;
        this.backgroundImageUrl = `https://cdn.wee.bet/img/cassino/${routeParams.game_fornecedor}/${routeParams.game_id}.png`;
        this.elem = this.el.nativeElement.querySelector('.game-frame');
        this.updateView();
        window.addEventListener('resize', () => this.updateView());
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

        if (window.innerWidth <= 1024) {
            this.isMobile = 1;
        }

        if (this.utilsService.getMobileOperatingSystem() == 'ios') {
            this.removerBotaoFullscreen = true;
        }

        this.elem = document.documentElement;
        this.mobileScreen = window.innerWidth <= 1024;
        this.fullscreen = false;
        this.menuFooterService.setIsPagina(true);
        this.route.params.subscribe(params => {
            this.params = params;
            if(this.router.url.includes('parlaybay')){
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
            this.auth.logado
            .subscribe(
                isLoggedIn => {
                    if(isLoggedIn){
                        this.isLoggedIn = this.auth.isLoggedIn();
                        if(this.avisoCancelarBonus === false){
                            this.loadGame();
                        }
                    }
                    
                    this.loadGame();
                }
            );

            this.auth.cliente
                .subscribe(
                    isCliente => {
                        this.isCliente = isCliente;
                    }
                );
            if (this.gameMode === 'REAL' && !this.isCliente) {
                if(!this.isMobile){

                }
            } else {
                if(this.avisoCancelarBonus === false){
                    this.loadGame();
                }
            }
            interval(3000)
                .subscribe(() => {
                    this.showLoadingIndicator = false;
                });
        });

        this.checkIfDesktop();

        if (this.gameFornecedor === 'galaxsys') {
            this.appendScriptGalaxsys();
        }
    }


    abrirLogin() {
        this.modalRef = this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350 modal-login',
                centered: true,
            }
        );
    }

    checkIfDesktop() {
        this.isDesktop = window.innerWidth > 482;
        this.isMob = !this.isDesktop;
    }

    checkIfMobile() {
        this.isMob = window.innerWidth > 482;
        this.isDesktop = !this.isMobile;
    }

    updateView() {
        this.isDesktop = window.innerWidth > 482;
        this.isMob = !this.isDesktop;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      this.checkIfDesktop();
    }

    ngAfterViewInit(){
        this.gamesScrolls.changes.subscribe(
            (scrolls) => this.scrolls = scrolls.toArray()
        );

        if (this.providersScroll) {
            this.scrolls.push(this.providersScroll);
        };

        if (this.relatedGamesScroll) {
            this.scrolls.push(this.relatedGamesScroll);
        };
        
        if (!this.isLoggedIn && this.gameMode === 'REAL' && this.isMob) {
            this.disableHeaderOptions();
            const gameView = this.el.nativeElement.querySelector('.game-view');
            this.renderer.setStyle(gameView, 'max-height', '300px');
        }
        
        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.changeGameviewHeight();
                this.cd.detectChanges();
            });
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

    //copyLink para navegadores sem suporte
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

    changeGameviewHeight() {
        if(!this.isMobile){
            const headerHeight = this.headerHeight;
            const contentEl = this.el.nativeElement.querySelector('.game-frame');
            const headerGameView = this.el.nativeElement.querySelector('.header-game-view').getBoundingClientRect().height;
            const height = window.innerHeight - headerHeight - headerGameView;
        }
    }

    loadGame() {
        this.casinoApi.getGameUrl(this.gameId, this.gameMode, this.gameFornecedor, this.isMobile)
            .subscribe(
                response => {
                    if(typeof response.gameUrl !== 'undefined') {
                        this.gameCategory = response.category;
                        this.gameFornecedor = response.fornecedor;
                        this.gameName = response.gameName;
                        this.backgroundImageUrl = `https://cdn.wee.bet/img/cassino/${response.fornecedor}/${response.gameId}.png`; 
                    } else {
                        this.gameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.gameURL);
                        this.sessionId = response.sessionId;
                        if ((this.gameFornecedor == 'tomhorn')) {
                            this.gameName = response.gameName.split("- 9", 1) || "";
                        } else {
                            this.gameName = response.gameName || "";
                        }
                    }

                    this.getRelatedAndPopularGames(response.category);
                },
                error => {
                    this.handleError(error);
                });
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    back(): void {
        if(this.modalRef) {
            this.modalRef.close();
        }

        switch (this.gameFornecedor) {
            case 'tomhorn':
                this.closeSessionGameTomHorn();
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
    }

    disableHeaderOptions() {
        const optionsHeader = this.el.nativeElement.querySelector('.header-game-view');
        
        if (optionsHeader) {
            this.renderer.setStyle(optionsHeader, 'display', 'none');
        }
    }

    openFullScreenMob(){
        const gameFrame = this.el.nativeElement.querySelector('.game-frame');
        const optionsHeader = this.el.nativeElement.querySelector('.header-game-view');
        const optionsHeaderHeight = optionsHeader.getBoundingClientRect().height;
        const calculatedGameHeight = `calc(100% - ${optionsHeaderHeight}px)`;

        if (gameFrame) {
            if (!this.isFullScreen) {
                this.renderer.setStyle(optionsHeader, 'position', 'fixed');
                this.renderer.setStyle(optionsHeader, 'width', '100%');
                this.renderer.setStyle(optionsHeader, 'top', 0);
                this.renderer.setStyle(gameFrame, 'position', 'fixed');
                this.renderer.setStyle(gameFrame, 'top', `${optionsHeaderHeight}px`);
                this.renderer.setStyle(gameFrame, 'height', calculatedGameHeight);
            } else {
                this.renderer.removeStyle(optionsHeader, 'position');
                this.renderer.removeStyle(optionsHeader, 'width');
                this.renderer.removeStyle(optionsHeader, 'top');
                this.renderer.removeStyle(gameFrame, 'position');
                this.renderer.removeStyle(gameFrame, 'top');
                this.renderer.setStyle(gameFrame, 'height', '100%');
            }

            this.isFullScreen = !this.isFullScreen;
        }
    }

    disableHeaderOptions() {
        const optionsHeader = this.el.nativeElement.querySelector('.header-game-view');
        
        if (optionsHeader) {
            this.renderer.setStyle(optionsHeader, 'display', 'none');
        }
    }

    openFullScreenMob(){
        const gameFrame = this.el.nativeElement.querySelector('.game-frame');
        const optionsHeader = this.el.nativeElement.querySelector('.header-game-view');
        const optionsHeaderHeight = optionsHeader.getBoundingClientRect().height;
        const calculatedGameHeight = `calc(100% - ${optionsHeaderHeight}px)`;

        if (gameFrame) {
            if (!this.isFullScreen) {
                this.renderer.setStyle(optionsHeader, 'position', 'fixed');
                this.renderer.setStyle(optionsHeader, 'width', '100%');
                this.renderer.setStyle(optionsHeader, 'top', 0);
                this.renderer.setStyle(gameFrame, 'position', 'fixed');
                this.renderer.setStyle(gameFrame, 'top', `${optionsHeaderHeight}px`);
                this.renderer.setStyle(gameFrame, 'height', calculatedGameHeight);
            } else {
                this.renderer.removeStyle(optionsHeader, 'position');
                this.renderer.removeStyle(optionsHeader, 'width');
                this.renderer.removeStyle(optionsHeader, 'top');
                this.renderer.removeStyle(gameFrame, 'position');
                this.renderer.removeStyle(gameFrame, 'top');
                this.renderer.setStyle(gameFrame, 'height', '100%');
            }

            this.isFullScreen = !this.isFullScreen;
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

        const optionsHeader = this.el.nativeElement.querySelector('.header-game-view');
        this.renderer.setStyle(optionsHeader, 'margin', '0');

        const gameView = this.el.nativeElement.querySelector('.game-view');
        this.renderer.addClass(gameView, 'desktop-fullscreen');
        this.renderer.setStyle(gameView, 'padding', '0');

        const footer = this.el.nativeElement.querySelector('.main-footer');
        this.renderer.setStyle(footer, 'display', 'none');

        const blocoProvider = this.el.nativeElement.querySelector('.bloco-providers');
        this.renderer.setStyle(blocoProvider, 'display', 'none');

        const blocoRelatedGames = this.el.nativeElement.querySelector('.bloco-relatedGames');
        this.renderer.setStyle(blocoRelatedGames, 'display', 'none');

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

        const optionsHeader = this.el.nativeElement.querySelector('.header-game-view');
        this.renderer.setStyle(optionsHeader, 'margin', '0 20px');

        const gameView = this.el.nativeElement.querySelector('.game-view');
        this.renderer.removeClass(gameView, 'desktop-fullscreen');
        this.renderer.setStyle(gameView, 'padding', '30px');

        const footer = this.el.nativeElement.querySelector('.main-footer');
        this.renderer.setStyle(footer, 'display', 'block');

        const blocoProvider = this.el.nativeElement.querySelector('.bloco-providers');
        this.renderer.setStyle(blocoProvider, 'display', 'block');

        const blocoRelatedGames = this.el.nativeElement.querySelector('.bloco-relatedGames');
        this.renderer.setStyle(blocoRelatedGames, 'display', 'block');

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

    exibirJogosLiberadosBonus() {
        this.location.back();
        this.modalService.open(JogosLiberadosBonusModalComponent, {
            centered: true,
            size: 'xl',
        });
    }

    appendScriptGalaxsys() {
        let body = document.getElementsByTagName('body')[0];
        let bodyScript = document.createElement('script');

        bodyScript.append('window.addEventListener("message",(e) => {const { type, mainDomain } = e.data; if(type === "rgs-backToHome") {window.location.href = mainDomain;}});');
        bodyScript.id = 'galaxsysScript';
        body.appendChild(bodyScript);
    }

    abriModalLogin(){
        const modalRef = this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350 modal-login',
                centered: true,
            }
        );
        modalRef.result.then(
            (result) => {
                if(result) {
                    this.isLoggedIn = this.auth.isLoggedIn();
                    this.getPosicaoFinanceira()
                }
            }
        );
    }

    abrirCadastro(){
        this.modalService.open(
            CadastroModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'md',
                centered: true,
                windowClass: 'modal-500 modal-cadastro-cliente'
            }
        );
    }

    getPosicaoFinanceira() {
        this.auth.getPosicaoFinanceira()
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                posicaoFinanceira => {
                    this.posicaoFinanceira = posicaoFinanceira.bonus;
                    if(this.posicaoFinanceira > 0 && this.posicaoFinanceira < 1) {
                       this.avisoCancelarBonus = true;
                       this.abriModalContinuarJogando();
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

    abriModalContinuarJogando(){
        this.modalRef =  this.modalService.open(
            this.continuarJogandoModal,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-pop-up',
                centered: true,
            }
        );
    }

    continuarBonus(){
        this.avisoCancelarBonus = false;
        this.modalRef.close();
    }

    continuarSaldoReal(){
        this.financeiroService.cancelarBonusAtivos()
            .subscribe(
                response => {
                    this.avisoCancelarBonus = false;
                    this.modalRef.close();
                },
                error => {
                    this.handleError(error);
                }
            );

    }

    private async getRelatedAndPopularGames(category:string) {
        const response = await this.casinoApi.getGamesList(false).toPromise();

        this.gameList = await this.filterDestaques(response.gameList, category);
    }

    private async getFornecedores() {
        const {
            fornecedores,
        } = await this.casinoApi.getGamesList(false).toPromise();

        this.cassinoFornecedores = fornecedores.map((fornecedor: Fornecedor) => ({
            ...fornecedor,
            imagem: `https://cdn.wee.bet/img/cassino/logos/providers/${fornecedor.gameFornecedor}.png`
        }));
    }

    public redirectToFilteredProviders(provider) {
        const providerName = provider.gameFornecedor;

        this.router.navigate(['/casino', providerName]);
    }

    public showMoreGames() {
        this.qtdGames += 3;
    }

    public showMoreProviders() {
        this.qtdProviders += 3;
    }

    get blink(): string {
        return this.router.url.split('/')[1] ?? 'casino';
    }

    public handleSeeAllGames() {
        const category = this.gameCategory;

        if (!category) {
            console.error('Categoria do jogo não está definida');
            return;
        }
    
        this.router.navigate(['casino/wallFiltered'], { queryParams: { category } });
    }

    private filterDestaques(games: GameCasino[], category: string): Promise<GameCasino[]> {
        return new Promise((resolve) => {
            let filteredGames = games
                .filter((game) => {
                    if (game.modalidade === category && game.gameID !== this.gameId) {
                        this.popularGamesIds.push(game.gameID);
                        return true; 
                    }
                    return false;
                });
    
            if (filteredGames.length < this.casinoRelatedGamesQuantity) {
                let missingGamesCalc = this.casinoRelatedGamesQuantity - filteredGames.length;
    
                this.casinoApi.getCasinoGamesRelated(category, this.popularGamesIds, missingGamesCalc).subscribe(
                    response => {
                        filteredGames = filteredGames.concat(response);
    
                        resolve(filteredGames);
                    }
                );
            } else {
                resolve(filteredGames);
            }
        });
    }
}
