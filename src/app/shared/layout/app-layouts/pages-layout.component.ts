import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/utils/sidebar.service';

@Component({
  selector: 'app-pages-layout',
  templateUrl: './pages-layout.component.html',
  styleUrls: ['./pages-layout.component.css']
})
export class PagesLayoutComponent implements OnInit {

    navigationIsCollapsed = false;

    constructor(
        private sidebarService: SidebarService
    ) { }

    ngOnInit(): void {
        this.sidebarService.collapsedSource
            .subscribe(collapsed => {
                this.navigationIsCollapsed = collapsed;
            });
    }

}
