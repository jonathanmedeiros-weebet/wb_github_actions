import { Component, OnInit, OnDestroy } from '@angular/core';

import { MessageService, CampeonatoService } from '../../../services';
import { Campeonato } from '../../../models';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-futebol-navigation',
    templateUrl: 'futebol-navigation.component.html',
    styleUrls: ['futebol-navigation.component.css']
})
export class FutebolNavigationComponent implements OnInit, OnDestroy {
    amanha = moment().add(1, 'd').format('YYYY-MM-DD');
    campeonatos: Campeonato[];
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
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
        const campeonatosBloqueados = JSON.parse(localStorage.getItem('campeonatos-bloqueados'));
        const params = {
            fields: ['_id', 'nome'],
            'leagues': campeonatosBloqueados
        };

        this.campeonatoService.getCampeonatos(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => this.campeonatos = campeonatos,
                error => this.messageService.error(error)
            );
    }
}
