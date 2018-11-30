import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CampeonatoService, SidebarService, MessageService } from './../../../services';

@Component({
    selector: 'app-futebol-wrapper',
    templateUrl: 'futebol-wrapper.component.html',
    styleUrls: ['futebol-wrapper.component.css']
})
export class FutebolWrapperComponent implements OnInit, OnDestroy {
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private sidebarService: SidebarService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.getJogos();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
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
                campeonatos => this.sidebarService.changeItens(campeonatos, 'esportes'),
                error => this.messageService.error(error)
            );
    }
}
