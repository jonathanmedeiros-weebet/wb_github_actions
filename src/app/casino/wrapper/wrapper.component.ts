import {Component, Input, OnDestroy, OnInit, DoCheck} from '@angular/core';
import {SidebarService} from '../../shared/services/utils/sidebar.service';
import {MenuFooterService} from '../../services';
import {Router} from '@angular/router';

@Component({
    selector: 'app-wrapper',
    templateUrl: './wrapper.component.html',
    styleUrls: ['./wrapper.component.css']
})
export class CasinoWrapperComponent implements OnInit, OnDestroy, DoCheck {
    @Input() showLoadingIndicator;
    mobileScreen = false;
    isVirtuais = false;
    isGameView = false;

    constructor(
        private sideBarService: SidebarService,
        private menuFooterService: MenuFooterService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.isVirtuais = this.router.url.split('/')[2] === 'v';

        this.mobileScreen = window.innerWidth <= 1024;
        this.sideBarService.changeItens({
            contexto: 'casino',
            dados: {}
        });
        if (this.mobileScreen) {
            this.menuFooterService.setIsPagina(false);
        } else {
            this.menuFooterService.setIsPagina(true);
        }

    }

    ngDoCheck(): void {
        this.isGameView = this.router.url.split('/')[3] === 'play';
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

}
