import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

import { SidebarService } from './../../../services';

@Component({
    selector: 'app-navigation',
    templateUrl: 'navigation.component.html',
    styleUrls: ['navigation.component.css'],
    animations: [
        trigger('openClose', [
            state('open', style({
                'margin-left': '0px',
            })),
            state('closed', style({
                'margin-left': '-255px',
                visibility: 'hidden'
            })),
            transition('open => closed', [
                animate('400ms ease-in')
            ]),
            transition('closed => open', [
                animate('400ms ease-out')
            ])
        ]),
    ]
})
export class NavigationComponent implements OnInit {
    isOpen = false;

    constructor(
        private sidebarService: SidebarService
    ) { }

    ngOnInit() {
        this.sidebarService.isOpen.subscribe(isOpen => this.isOpen = isOpen);
    }

    clickMe() {
        this.isOpen = !this.isOpen;
    }
}
