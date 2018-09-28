import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Campeonato } from './../../../../models';
import { CampeonatoService, MessageService } from './../../../../services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-futebol-listagem',
    templateUrl: 'futebol-listagem.component.html',
    styleUrls: ['futebol-listagem.component.css']
})

export class FutebolListagemComponent implements OnInit, OnDestroy {
    diaEspecifico = true;
    campeonato: Campeonato = new Campeonato();
    campeonatos: Campeonato[];
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private messageService: MessageService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                if (params['campeonato']) {
                    const campeonatoId = +params['campeonato'];

                    this.campeonatoService.getCampeonato(campeonatoId)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            campeonato => {
                                this.diaEspecifico = false;
                                this.campeonato = campeonato;
                            },
                            error => this.messageService.error(error)
                        );
                } else {
                    const campeonatosBloqueados = JSON.parse(localStorage.getItem('campeonatos_bloqueados'));
                    const queryParams: any = {
                        'leagues': campeonatosBloqueados
                    };

                    if (params['data']) {
                        const data = moment(params['data']).format('YYYY-MM-DD');
                        queryParams.data = data;
                    } else {
                        queryParams.data = moment().format('YYYY-MM-DD');
                    }

                    this.campeonatoService.getCampeonatos(queryParams)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            campeonatos => {
                                this.diaEspecifico = true;
                                this.campeonatos = campeonatos;
                            },
                            error => this.messageService.error(error)
                        );
                }
            });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }
}
