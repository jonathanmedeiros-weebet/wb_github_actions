import { Component, OnInit, OnDestroy, Inject, HostListener } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { interval } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoteriaPopularService } from 'src/app/shared/services/loteria/loteria-popular.service';
import { AuthService, MenuFooterService, MessageService, ParametrosLocaisService, UtilsService } from 'src/app/services';
import { LoginModalComponent } from 'src/app/shared/layout/modals';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-loteria-popular',
    templateUrl: './loteria-popular.component.html',
    styleUrls: ['./loteria-popular.component.css']
})
export class LoteriaPopularComponent implements OnInit, OnDestroy {
    @HostListener('document:fullscreenchange')
    @HostListener('document:webkitfullscreenchange')
    @HostListener('document:mozfullscreenchange')
    @HostListener('document:MSFullscreenChange')
    onFullscreenChange() {
        if (this.document.fullscreenElement) {
            this.fullscreen = true;
        } else {
            this.fullscreen = false;
        }
    }

    gameUrl: SafeUrl = "";
    documentEl: any;
    modalRef;
    isLoggedIn;
    isCliente;
    mobileScreen;
    showLoadingIndicator = true;

    fullscreen = false;
    forceFullscreen = false;
    forcedFullscreen = true;

    constructor(
        private loteriaPopularApi: LoteriaPopularService,
        private menuFooterService: MenuFooterService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private sanitizer: DomSanitizer,
        private auth: AuthService,
        private messageService: MessageService,
        private translate: TranslateService,
        private paramsService: ParametrosLocaisService,
        private utilsService: UtilsService,
        @Inject(DOCUMENT) private document: any
    ) {}

    ngOnInit(): void {
        this.mobileScreen = window.innerWidth <= 1024;
        this.forceFullscreen = this.utilsService.getMobileOperatingSystem() == 'ios' && this.mobileScreen;
        this.documentEl = document.documentElement;
        this.menuFooterService.setIsPagina(true);
        this.route.params.subscribe(params => {
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
            if (!this.isLoggedIn) {
                this.abrirModalLogin();
                if (this.paramsService.quininhaAtiva() || this.paramsService.seninhaAtiva()) {
                    this.router.navigate(['loterias']);
                } else {
                    this.router.navigate(['/']);
                }
            } else if (!this.isCliente) {
                this.handleError(this.translate.instant('geral.semPermissaoAcesso'));
                if (this.paramsService.quininhaAtiva() || this.paramsService.seninhaAtiva()) {
                    this.router.navigate(['loterias']);
                } else {
                    this.router.navigate(['/']);
                }
            } else {
                this.loadGame();
            }
            interval(500)
                .subscribe(() => {
                    this.showLoadingIndicator = false;
                });
        });
    }

    ngOnDestroy(): void {
        this.menuFooterService.setOutraModalidade(false);
        this.menuFooterService.setIsPagina(false);
    }

    loadGame() {
        this.loteriaPopularApi.getGameUrl()
            .subscribe(
                response => {
                    this.gameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.gameUrl);
                },
                error => {
                    this.handleError(error);
                    this.router.navigate(['loterias']);
                }
            );
    }

    handleError(error: string) {
        this.messageService.error(error);
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

    openFullscreen() {
        if (this.documentEl.requestFullscreen) {
            this.documentEl.requestFullscreen();
        } else if (this.documentEl.mozRequestFullScreen) {
            /* Firefox */
            this.documentEl.mozRequestFullScreen();
        } else if (this.documentEl.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            this.documentEl.webkitRequestFullscreen();
        } else if (this.documentEl.msRequestFullscreen) {
            /* IE/Edge */
            this.documentEl.msRequestFullscreen();
        }
    }

    exitFullscreen() {
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
    }

    toggleForcedFullscreen() {
        this.forcedFullscreen = !this.forcedFullscreen;
    }
}
