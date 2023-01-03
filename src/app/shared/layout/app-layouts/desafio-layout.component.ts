import {Component, OnInit} from '@angular/core';
import { MenuFooterService } from '../../services/utils/menu-footer.service';
import { SidebarService } from '../../services/utils/sidebar.service';

@Component({
    selector: 'app-desafio-layout',
    templateUrl: './desafio-layout.component.html',
    styleUrls: ['./desafio-layout.component.css']
})
export class DesafioLayoutComponent implements OnInit {

    navigationIsCollapsed = false;

    constructor(
        private sidebarService: SidebarService,
        private menuFooterService: MenuFooterService,
    ) { }

    ngOnInit(): void {
        this.menuFooterService.setIsAcumuladao(false);

        this.sidebarService.collapsedSource
            .subscribe(collapsed => {
                this.navigationIsCollapsed = collapsed;
            });
    }

}
