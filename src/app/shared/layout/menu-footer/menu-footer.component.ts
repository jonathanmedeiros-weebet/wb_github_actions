import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApostaComponent } from 'src/app/cambistas/aposta/aposta.component';
import { ValidarApostaWrapperComponent } from '../../../validar-aposta/wrapper/validar-aposta-wrapper.component';
import { CopiarApostaWrapperComponent } from '../../../copiar-aposta/wrapper/copiar-aposta-wrapper.component'
import { config } from '../../config';
import { AuthService } from '../../services/auth/auth.service';
import { ParametrosLocaisService } from '../../services/parametros-locais.service';
import { MenuFooterService } from '../../services/utils/menu-footer.service';
import { MessageService } from '../../services/utils/message.service';
import { SidebarService } from '../../services/utils/sidebar.service';
import { ClienteApostasModalComponent, LoginModalComponent, PesquisarApostaModalComponent } from '../modals';
import { AccountVerificationService } from '../../services/account-verification.service';

@Component({
    selector: 'app-menu-footer',
    templateUrl: './menu-footer.component.html',
    styleUrls: ['./menu-footer.component.css']
})
export class MenuFooterComponent implements OnInit {
    aoVivoHabilitado = false;
    modoCambistaHabilitado = false;
    isCliente;
    isLoggedIn;
    quantidadeItens = 0;
    unsub$ = new Subject();
    hidden = false;
    mobileScreen = false;
    sidebarNavHeight;
    LOGO = config.LOGO;
    menuIsOpen = false;
    campeonatosIsOpen = false;
    isOpen = false;
    contexto = '';
    nomeBotaoExtras = 'Campeonatos';
    private accountVerified: boolean = false;

    constructor(
        private auth: AuthService,
        private sidebarService: SidebarService,
        private paramsService: ParametrosLocaisService,
        private cd: ChangeDetectorRef,
        private menuFooterService: MenuFooterService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private translate: TranslateService,
        private accountVerificationService: AccountVerificationService
    ) {
    }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;

        this.modoCambistaHabilitado = this.paramsService.getOpcoes().modo_cambista;
        this.aoVivoHabilitado = this.paramsService.aoVivoAtivo();

        if (this.mobileScreen) {
            this.sidebarNavHeight = window.innerHeight - 125;

            this.auth.logado
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    isLoggedIn => {
                        this.isLoggedIn = isLoggedIn;
                        this.cd.detectChanges();
                    }
                );

            this.auth.cliente
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    isCliente => {
                        this.isCliente = isCliente;
                        this.cd.detectChanges();
                    }
                );

            this.menuFooterService.quantidadeItens
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    res => this.quantidadeItens = res
                );

            this.menuFooterService.isPagina
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    res => this.hidden = res
                );

            this.sidebarService.isOpen
                .pipe(takeUntil(this.unsub$))
                .subscribe(isOpen => {
                    this.isOpen = isOpen;
                    this.cd.detectChanges();
                });

            this.sidebarService.itens
                .pipe(takeUntil(this.unsub$))
                .subscribe(dados => {
                    this.contexto = dados.contexto;
                    switch (this.contexto) {
                        case 'esportes':
                            this.nomeBotaoExtras = this.translate.instant('geral.campeonatos');
                            break;
                        case 'desafio':
                            this.nomeBotaoExtras = this.translate.instant('geral.desafios');
                            break;
                        default:
                            this.nomeBotaoExtras = this.translate.instant('geral.campeonatos');
                    }
                });
        }
    }

    toggleSidebar() {
        this.sidebarService.toggle();
    }

    async toggleApostas() {
        if (this.isLoggedIn) {
            if(this.isCliente) {
                if (!this.accountVerificationService.terms_accepted.getValue()) {
                    const termsResult = await this.accountVerificationService.openModalTermsPromise();
                    if (!termsResult) return;
                }

                if(!this.accountVerificationService.accountVerified.getValue()) {
                    this.accountVerificationService.openModalAccountVerificationAlert();
                    return;
                }
            }

            this.abrirApostas();
        } else {
            if (this.modoCambistaHabilitado) {
                this.abrirPesquisarAposta();
            } else {
                this.abrirLogin();
            }
        }

    }

    abrirLogin() {
        this.modalService.open(LoginModalComponent, {windowClass: 'modal-fullscreen',});
    }

    abrirApostas() {
        if (this.isCliente) {
            this.modalService.open(ClienteApostasModalComponent);
        } else {
            this.modalService.open(ApostaComponent)
        }
    }

    abrirPesquisarAposta() {
        this.modalService.open(PesquisarApostaModalComponent);
    }

    toggleCampeonatos() {
        if (!this.menuIsOpen && this.campeonatosIsOpen || !this.isOpen) {
            this.toggleSidebar();
        }

        this.campeonatosIsOpen = true;
    }

    closeMenu() {
        this.toggleSidebar();

        this.campeonatosIsOpen = false;
    }

    toggleBilhete() {
        if (this.menuFooterService.getIsAcumuladao() && this.quantidadeItens === 0) {
            this.messageService.warning('Selecione um acumuladão para abrir o Bilhete');
        } else {
            this.menuFooterService.toggleBilhete();
        }
    }

    abrirValidarAposta() {
        this.modalService.open(ValidarApostaWrapperComponent);
    }

    svgCss() {
        return {
            'width.rem': 1.8,
            'fill': 'var(--foreground-header)',
            'margin-bottom.px': '4'
        };
    }
}
