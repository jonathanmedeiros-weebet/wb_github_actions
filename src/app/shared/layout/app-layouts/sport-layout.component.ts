import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MenuFooterService} from '../../services/utils/menu-footer.service';
import {SidebarService} from '../../services/utils/sidebar.service';

@Component({
    selector: 'app-sport-layout',
    templateUrl: './sport-layout.component.html',
    styleUrls: ['./sport-layout.component.css']
})
export class SportLayoutComponent implements OnInit {
    isMobile = false;
    navigationIsCollapsed = false;

    constructor(
        private sidebarService: SidebarService,
        private router: Router,
        private menuFooterService: MenuFooterService,
    ) { }

    ngOnInit() {
        this.isMobile = window.innerWidth <= 1024;
        this.menuFooterService.setIsAcumuladao(false);

        this.sidebarService.collapsedSource
            .subscribe(collapsed => {
                this.navigationIsCollapsed = collapsed;
            });
    }

    showSubmenu() {
        return true;
    }
}
