import {ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {AuthService, LayoutService, MenuFooterService, MessageService, ParametrosLocaisService, UtilsService} from '../../services';
import {interval, Subject} from 'rxjs';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CadastroModalComponent, JogosLiberadosBonusModalComponent, LoginModalComponent, RegrasBonusModalComponent} from "../../shared/layout/modals";
import { takeUntil } from 'rxjs/operators';



@Component({
    selector: 'app-gameview',
    templateUrl: './gameview.component.html',
    styleUrls: ['./gameview.component.css']
})
export class GameviewComponent implements OnInit, OnDestroy {
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
    unsub$ = new Subject();
    headerHeight = 92;
    currentHeight = window.innerHeight - this.headerHeight;
    modalRef;
    isMob: boolean = false;
    isDesktop: boolean = false;

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
        @Inject(DOCUMENT) private document: any
    ) {}

    get customCasinoName(): string {
        return this.paramsService.getCustomCasinoName();
    }

    ngOnInit(): void {

        this.isLoggedIn = this.auth.isLoggedIn();
        const routeParams = this.route.snapshot.params;
        this.backgroundImageUrl = `https://cdn.wee.bet/img/cassino/${routeParams.game_fornecedor}/${routeParams.game_id}.png`;
        this.elem = this.el.nativeElement.querySelector('.game-frame');
        this.updateView();
        window.addEventListener('resize', () => this.updateView());
        const botaoContatoFlutuante = this.document.getElementsByClassName('botao-contato-flutuante')[0];
        if (botaoContatoFlutuante) {
            this.renderer.setStyle(botaoContatoFlutuante, 'z-index', '-1');
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

                        this.loadGame();
                    }
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
                this.loadGame();
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
        this.isMob = window.innerWidth <= 482;
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
        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.changeGameviewHeight();
                this.cd.detectChanges();
            });
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
                    this.gameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.gameURL);
                    this.sessionId = response.sessionId;
                    if ((this.gameFornecedor == 'tomhorn')) {
                        this.gameName = response.gameName.split("- 9", 1) || "";
                    } else {
                        this.gameName = response.gameName || "";
                    }
                },
                error => {
                    this.handleError(error);
                });
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    back(): void {
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
        }
    }

    openFullscreen() {

        const gameFrame = this.el.nativeElement.querySelector('.game-frame');

        if (gameFrame) {
            this.renderer.setStyle(gameFrame, 'position', 'fixed');
            this.renderer.setStyle(gameFrame, 'top', '0');
        }

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
}
