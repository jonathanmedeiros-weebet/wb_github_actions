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
import { SidebarService, CampeonatoService, MessageService } from './../../../services';

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
    isOpen;
    lista: any[];
    contexto = 'esportes';
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private messageService: MessageService,
        private sidebarService: SidebarService
    ) { }

    ngOnInit() {
        this.sidebarService.isOpen
            .pipe(takeUntil(this.unsub$))
            .subscribe(isOpen => this.isOpen = isOpen);

        this.getJogos();
    }

    getJogos() {
        const campeonatosBloqueados = JSON.parse(localStorage.getItem('campeonatos_bloqueados'));
        const params = {
            fields: ['_id', 'nome'],
            'campeonatos_bloqueados': campeonatosBloqueados,
            'odds': ['casa_90', 'fora_90']
        };

        this.campeonatoService.getCampeonatos(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => this.lista = campeonatos,
                error => this.messageService.error(error)
            );
    }
}
