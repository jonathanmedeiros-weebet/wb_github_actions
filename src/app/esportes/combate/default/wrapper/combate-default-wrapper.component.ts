import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ParametrosLocaisService, CampeonatoService, SidebarService, MessageService } from './../../../../services';
import * as moment from 'moment';

@Component({
    selector: 'app-combate-default-wrapper',
    templateUrl: 'combate-default-wrapper.component.html',
    styleUrls: ['combate-default-wrapper.component.css']
})
export class CombateDefaultWrapperComponent implements OnInit, OnDestroy {
    showLoadingIndicator = true;
    campeonatos;
    odds = ['cmbt_casa', 'cmbt_fora'];
    aux = [];
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private paramsService: ParametrosLocaisService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.sidebarService.itens
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                dados => {
                    if (dados.contexto !== 'futebol') {
                        this.getJogos();
                    }
                }
            );

        this.route.queryParams
            .subscribe((params: any) => {
                this.showLoadingIndicator = true;
                const queryParams: any = {
                    sport_id: 9,
                    campeonatos_bloqueados: this.paramsService.getCampeonatosBloqueados(),
                    odds: this.odds,
                    data_final: '2030-01-01'
                };

                this.campeonatoService.getCampeonatos(queryParams)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        campeonatos => {
                            this.campeonatos = campeonatos;
                            this.showLoadingIndicator = false;
                        },
                        error => this.messageService.error(error)
                    );
            });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    getJogos() {
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados();
        const opcoes = this.paramsService.getOpcoes();
        const params = {
            'sport_id': 1,
            'campeonatos_bloqueados': campeonatosBloqueados,
            'data_final': opcoes.data_limite_tabela,
        };

        this.campeonatoService.getCampeonatosPorRegioes(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => this.sidebarService.changeItens(campeonatos, 'futebol'),
                error => this.messageService.error(error)
            );
    }
}
