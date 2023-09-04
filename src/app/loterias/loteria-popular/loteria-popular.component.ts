import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { interval } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoteriaPopularService } from 'src/app/shared/services/loteria/loteria-popular.service';
import { AuthService, MenuFooterService, MessageService, ParametrosLocaisService } from 'src/app/services';
import { LoginModalComponent } from 'src/app/shared/layout/modals';

@Component({
    selector: 'app-loteria-popular',
    templateUrl: './loteria-popular.component.html',
    styleUrls: ['./loteria-popular.component.css']
})
export class LoteriaPopularComponent implements OnInit, OnDestroy {
    gameUrl: SafeUrl = "";
    modalRef;
    isLoggedIn;
    isCliente;
    mobileScreen;
    showLoadingIndicator = true;

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
        private paramsService: ParametrosLocaisService
    ) {}

    ngOnInit(): void {
        this.mobileScreen = window.innerWidth <= 1024;
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
        if (this.mobileScreen) {
            this.menuFooterService.setIsPagina(false);
        } else {
            this.menuFooterService.setIsPagina(true);
        }
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
}
