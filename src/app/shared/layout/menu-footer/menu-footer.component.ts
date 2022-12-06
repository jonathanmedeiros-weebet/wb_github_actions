import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SidebarService} from '../../services/utils/sidebar.service';
import {ParametrosLocaisService} from '../../services/parametros-locais.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';
import {MenuFooterService} from '../../services/utils/menu-footer.service';
import {MessageService} from '../../services/utils/message.service';
import {config} from '../../config';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ValidarApostaWrapperComponent} from '../../../validar-aposta/wrapper/validar-aposta-wrapper.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-menu-footer',
    templateUrl: './menu-footer.component.html',
    styleUrls: ['./menu-footer.component.css']
})
export class MenuFooterComponent implements OnInit {
    aoVivoHabilitado = false;
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

    constructor(
        private auth: AuthService,
        private sidebarService: SidebarService,
        private paramsService: ParametrosLocaisService,
        private cd: ChangeDetectorRef,
        private menuFooterService: MenuFooterService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private translate: TranslateService
    ) {
    }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;

        this.aoVivoHabilitado = this.paramsService.getOpcoes().aovivo;
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

    toggleMenu() {
        if (!this.campeonatosIsOpen && this.menuIsOpen || !this.isOpen) {
            this.toggleSidebar();
        }

        this.campeonatosIsOpen = false;
        this.menuIsOpen = !this.menuIsOpen;

    }

    toggleCampeonatos() {
        if (!this.menuIsOpen && this.campeonatosIsOpen || !this.isOpen) {
            this.toggleSidebar();
        }

        this.menuIsOpen = false;
        this.campeonatosIsOpen = true;
    }

    closeMenu() {
        this.toggleSidebar();

        this.menuIsOpen = false;
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
