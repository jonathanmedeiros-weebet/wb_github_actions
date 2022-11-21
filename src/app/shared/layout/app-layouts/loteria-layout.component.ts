import { Component, OnInit } from '@angular/core';
import { MenuFooterService } from '../../services/utils/menu-footer.service';
import { SidebarService } from '../../services/utils/sidebar.service';

@Component({
  selector: 'app-loteria-layout',
  templateUrl: './loteria-layout.component.html',
  styleUrls: ['./loteria-layout.component.css']
})
export class LoteriaLayoutComponent implements OnInit {

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
