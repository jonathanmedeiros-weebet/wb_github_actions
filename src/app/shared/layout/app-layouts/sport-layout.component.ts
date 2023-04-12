import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuFooterService } from '../../services/utils/menu-footer.service';
import {SidebarService} from '../../services/utils/sidebar.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-sport-layout',
    templateUrl: './sport-layout.component.html',
    styleUrls: ['./sport-layout.component.css']
})
export class SportLayoutComponent implements OnInit, OnDestroy {
    isMobile = false;
    navigationIsCollapsed = false;
    categoriaSubmenu = 'esporte';
    routerEventsSub;

    constructor(
        private sidebarService: SidebarService,
        private router: Router,
        private menuFooterService: MenuFooterService,
    ) { }

    ngOnInit() {
        this.detectUrlChanges();

        this.isMobile = window.innerWidth <=1024;
        this.menuFooterService.setIsAcumuladao(false);

        this.sidebarService.collapsedSource
            .subscribe(collapsed => {
                this.navigationIsCollapsed = collapsed;
            });
    }

    ngOnDestroy(): void {
        this.routerEventsSub.unsubscribe();
    }

    showSubmenu() {
        return true;
    }

    detectUrlChanges() {
        this.categoriaSubmenu = this.router.url.includes('/esportes') ? 'esporte' : 'live';

        this.routerEventsSub = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((changes: NavigationEnd) => this.categoriaSubmenu = changes.url.includes('/esportes') ? 'esporte' : 'live');
    }
}
