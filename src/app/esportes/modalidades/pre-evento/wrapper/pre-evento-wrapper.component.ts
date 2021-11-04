import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, switchMap, mergeMap, tap } from 'rxjs/operators';
import { ParametrosLocaisService, CampeonatoService, SidebarService, MessageService } from './../../../../services';
import * as moment from 'moment';

@Component({
    selector: 'app-pre-evento-wrapper',
    templateUrl: 'pre-evento-wrapper.component.html',
    styleUrls: ['pre-evento-wrapper.component.css']
})
export class PreEventoWrapperComponent implements OnInit, OnDestroy {
    contexto = null;
    sportId;
    mobileScreen = true;
    showLoadingIndicator = true;
    campeonatos;
    odds = [];
    aux = [];
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private paramsService: ParametrosLocaisService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        // this.mobileScreen = window.innerWidth <= 668 ? true : false;
        const dataLimiteTabela = this.paramsService.getOpcoes().data_limite_tabela;

        this.route.data
            .pipe(
                switchMap((data: any) => {
                    this.sportId = data.sportId;
                    this.setContextoPorEsporte(data.sportId);

                    return this.route.queryParams;
                }),
                takeUntil(this.unsub$)
            )
            .subscribe((params: any) => {
                this.showLoadingIndicator = true;

                if (params['campeonato']) {
                    const campeonatoId = params['campeonato'];
                    const queryParams: any = {
                        odds: this.odds,
                        data_final: dataLimiteTabela
                    };

                    this.campeonatoService.getCampeonato(campeonatoId, queryParams)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            campeonato => {
                                this.campeonatos = [campeonato];

                                this.showLoadingIndicator = false;
                            },
                            error => this.messageService.error(error)
                        );
                } else {
                    const queryParams: any = {
                        'sport_id': this.sportId,
                        'campeonatos_bloqueados': this.paramsService.getCampeonatosBloqueados(),
                        'odds': this.odds
                    };

                    if (params['data']) {
                        const dt = moment(params['data']);
                        if (dt.isSameOrBefore(dataLimiteTabela, 'day')) {
                            queryParams.data = dt.format('YYYY-MM-DD');
                        } else {
                            queryParams.data = dataLimiteTabela;
                        }
                    } else {
                        queryParams.data = moment().format('YYYY-MM-DD');
                    }

                    this.campeonatoService.getCampeonatos(queryParams)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            campeonatos => {
                                console.log('campeonatos');
                                console.log(campeonatos);
                                this.campeonatos = campeonatos;
                                this.showLoadingIndicator = false;
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

    getCampeonatos2Sidebar() {
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados();
        const opcoes = this.paramsService.getOpcoes();
        const params = {
            'sport_id': this.sportId,
            'campeonatos_bloqueados': campeonatosBloqueados,
            'data_final': opcoes.data_limite_tabela,
        };

        this.campeonatoService.getCampeonatos(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => this.sidebarService.changeItens(this.campeonatos, this.contexto),
                error => this.messageService.error(error)
            );
    }

    setContextoPorEsporte(sportId) {
        switch (sportId) {
            case '1':
                this.contexto = 'futebol';
                this.odds = ['casa_90', 'empate_90', 'fora_90'];;
                if (this.paramsService.getOddsPrincipais()) {
                    this.odds = this.paramsService.getOddsPrincipais();
                }
                break;
            case '9':
                this.contexto = 'combate';
                this.odds = ['cmbt_casa', 'cmbt_fora'];
                break;
            case '12':
                this.contexto = 'futebol-americano';
                this.odds = ['futebol_americano_casa', 'futebol_americano_fora'];
                break;
            default:
                break;
        }
    }
}
