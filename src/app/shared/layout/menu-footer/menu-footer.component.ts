import {Component, OnInit} from '@angular/core';
import {SidebarService} from '../../services/utils/sidebar.service';

@Component({
    selector: 'app-menu-footer',
    templateUrl: './menu-footer.component.html',
    styleUrls: ['./menu-footer.component.css']
})
export class MenuFooterComponent implements OnInit {
    aoVivoHabilitado = true;

    constructor(
        private sidebarService: SidebarService
    ) {
    }

    ngOnInit() {
    }

    toggleSidebar() {
        this.sidebarService.toggle();
    }

    svgCss() {
        return {
            'width.rem': 1.8,
            'fill': 'var(--foreground-header)',
            'margin-bottom.px': '4'
        };
    }
}
