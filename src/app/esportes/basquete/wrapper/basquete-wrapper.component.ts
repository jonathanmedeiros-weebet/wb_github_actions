import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ParametrosLocaisService, CampeonatoService, SidebarService, MessageService } from './../../../services';

@Component({
    selector: 'app-basquete-wrapper',
    templateUrl: 'basquete-wrapper.component.html',
    styleUrls: ['basquete-wrapper.component.css']
})
export class BasqueteWrapperComponent implements OnInit, OnDestroy {
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit() {
        this.getJogos();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    getJogos() {
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados();
        const params = {
            fields: ['_id', 'nome'],
            'sport_id': 18,
            'campeonatos_bloqueados': campeonatosBloqueados,
            'odds': ['bkt_casa', 'bkt_fora']
        };

        this.campeonatoService.getCampeonatos(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => this.sidebarService.changeItens(campeonatos, 'basquete'),
                error => this.messageService.error(error)
            );
    }
}
