import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SidebarService} from '../../services/utils/sidebar.service';
import {ParametrosLocaisService} from '../../services/parametros-locais.service';
import {BilheteEsportivoService} from '../../services/aposta-esportiva/bilhete-esportivo.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';

@Component({
    selector: 'app-menu-footer',
    templateUrl: './menu-footer.component.html',
    styleUrls: ['./menu-footer.component.css']
})
export class MenuFooterComponent implements OnInit {
    aoVivoHabilitado = false;
    isCliente;
    isLoggedIn;
    itens;
    unsub$ = new Subject();

    constructor(
        private auth: AuthService,
        private sidebarService: SidebarService,
        private paramsService: ParametrosLocaisService,
        private bilheteEsportivoService: BilheteEsportivoService,
        private cd: ChangeDetectorRef
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

        this.bilheteEsportivoService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                res => this.itens = res.length
            );
    }

    toggleSidebar() {
        this.sidebarService.toggle();
    }

    toggleBilhete() {
        this.bilheteEsportivoService.toggleBilhete();
    }

    svgCss() {
        return {
            'width.rem': 1.8,
            'fill': 'var(--foreground-header)',
            'margin-bottom.px': '4'
        };
    }
}
