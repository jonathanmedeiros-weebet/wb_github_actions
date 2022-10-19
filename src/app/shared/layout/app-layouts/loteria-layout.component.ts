import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/utils/sidebar.service';

@Component({
  selector: 'app-loteria-layout',
  templateUrl: './loteria-layout.component.html',
  styleUrls: ['./loteria-layout.component.css']
})
export class LoteriaLayoutComponent implements OnInit {

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
