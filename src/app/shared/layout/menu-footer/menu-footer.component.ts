import {Router} from '@angular/router';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SidebarService} from '../../services/utils/sidebar.service';
import {ParametrosLocaisService} from '../../services/parametros-locais.service';
import {BilheteEsportivoService} from '../../services/aposta-esportiva/bilhete-esportivo.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';
import {MenuFooterService} from '../../services/utils/menu-footer.service';

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

    constructor(
        private auth: AuthService,
        private sidebarService: SidebarService,
        private paramsService: ParametrosLocaisService,
        private cd: ChangeDetectorRef,
        private menuFooterService: MenuFooterService
    ) {
    }

    ngOnInit() {
        this.aoVivoHabilitado = this.paramsService.getOpcoes().aovivo;

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
    }

    toggleSidebar() {
        this.sidebarService.toggle();
    }

    toggleBilhete() {
        console.log('toggle');
    }

    svgCss() {
        return {
            'width.rem': 1.8,
            'fill': 'var(--foreground-header)',
            'margin-bottom.px': '4'
        };
    }
}
