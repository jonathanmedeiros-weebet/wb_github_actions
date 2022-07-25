import {Component, OnInit} from '@angular/core';
import {SidebarService} from '../../services/utils/sidebar.service';

@Component({
    selector: 'app-sport-layout',
    templateUrl: './sport-layout.component.html',
    styleUrls: ['./sport-layout.component.css']
})
export class SportLayoutComponent implements OnInit {
    isMobile = false;
    navigationIsCollapsed = false;

    constructor(private sidebarService: SidebarService) {
    }

    ngOnInit() {
        this.isMobile = window.innerWidth <= 1025;

        this.sidebarService.collapsedSource
            .subscribe(collapsed => {
                this.navigationIsCollapsed = collapsed;
            });
    }
}
