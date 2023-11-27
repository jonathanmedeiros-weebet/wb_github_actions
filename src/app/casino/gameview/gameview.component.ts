import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {AuthService, MenuFooterService, MessageService} from '../../services';
import {interval} from 'rxjs';


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
    bloquearGame;

    constructor(
        private casinoApi: CasinoApiService,
        private route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer,
        private location: Location,
        private auth: AuthService,
        private menuFooterService: MenuFooterService,
        private messageService: MessageService,
        @Inject(DOCUMENT) private document: any
    ) {
    }

    ngOnInit(): void {
        this.elem = document.documentElement;
        this.mobileScreen = window.innerWidth <= 1024;
        this.fullscreen = false;
        this.menuFooterService.setIsPagina(true);
        this.route.params.subscribe(params => {
            this.params = params;
            this.gameId = params['game_id'];
            this.gameMode = params['game_mode'];
            this.gameFornecedor = params['game_fornecedor'];
            this.auth.cliente
                .subscribe(
                    isCliente => {
                        this.isCliente = isCliente;
                    }
                );
            if (this.gameMode === 'REAL' && !this.isCliente) {
                this.router.navigate(['casino/wall']);
            } else {
                this.loadGame();
            }
            interval(3000)
                .subscribe(() => {
                    this.showLoadingIndicator = false;
                });
        });

    }

    loadGame() {
        this.casinoApi.getGameUrl(this.gameId, this.gameMode, this.gameFornecedor)
            .subscribe(
                response => {
                    this.bloquearGame = response.bloquearGame;
                    this.gameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.gameURL);
                    this.sessionId = response.sessionId;
                    this.gameName = response.gameName || "";
                },
                error => {
                    this.handleError(error);
                });
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    back(): void {
        if (this.gameFornecedor === 'tomhorn') {
            this.closeSessionGameTomHorn();
        }

        if (this.gameFornecedor === 'ezugi' || this.gameFornecedor === 'evolution') {
            this.router.navigate(['casino/c/wall/live']);
        } else {
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
        this.casinoApi.closeSessionTomHorn(this.sessionId).subscribe(response => {},error => {});
    }
}
