import { Component, OnInit } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidebarService, AuthService } from './../../../services';

import * as moment from 'moment';

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
    amanha = moment().add(1, 'd').format('YYYY-MM-DD');
    isLoggedIn = false;
    isOpen = true;
    itens: any[];
    contexto;
    unsub$ = new Subject();

    constructor(
        private auth: AuthService,
        private sidebarService: SidebarService
    ) { }

    ngOnInit() {
        if (window.innerWidth <= 667) {
            this.sidebarService.isOpen
                .pipe(takeUntil(this.unsub$))
                .subscribe(isOpen => this.isOpen = isOpen);
        }

        this.sidebarService.itens
            .pipe(takeUntil(this.unsub$))
            .subscribe(dados => {
                this.contexto = dados.contexto;
                this.itens = dados.itens;
            });

        this.isLoggedIn = this.auth.isLoggedIn();
    }
}
