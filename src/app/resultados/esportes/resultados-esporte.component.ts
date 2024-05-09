import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import {ResultadoService, MessageService, MenuFooterService, ParametrosLocaisService} from './../../services';
import { Campeonato } from './../../models';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import * as sportsIds from '../../shared/constants/sports-ids';

@Component({
    selector: 'app-resultados-esporte',
    templateUrl: 'resultados-esporte.component.html',
    styleUrls: ['resultados-esporte.component.css']
})
export class ResultadosEsporteComponent extends BaseFormComponent implements OnInit, OnDestroy {
    campeonatos: Campeonato[] = [];
    showLoadingIndicator = true;
    unsub$ = new Subject();
    sport;
    basqueteHabilitado = false;
    combateHabilitado = false;
    esportsHabilitado = false;
    futsalHabilitado = false;
    voleiHabilitado = false;
    tenisHabilitado = false;
    futebolAmericanoHabilitado = false;
    hoqueiGeloHabilitado = false;
    sportsIds = sportsIds;

    constructor(
        private messageService: MessageService,
        private resultadoService: ResultadoService,
        private fb: UntypedFormBuilder,
        private menuFooterService: MenuFooterService,
        private paramsService: ParametrosLocaisService,
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.getResultados();
        this.menuFooterService.setIsPagina(true);

        this.basqueteHabilitado = this.paramsService.getOpcoes().basquete;
        this.combateHabilitado = this.paramsService.getOpcoes().combate;
        this.esportsHabilitado = this.paramsService.getOpcoes().esports;
        this.futsalHabilitado = this.paramsService.getOpcoes().futsal;
        this.voleiHabilitado = this.paramsService.getOpcoes().volei;
        this.tenisHabilitado = this.paramsService.getOpcoes().tenis;
        this.futebolAmericanoHabilitado = this.paramsService.getOpcoes().futebol_americano;
        this.hoqueiGeloHabilitado = this.paramsService.getOpcoes().hoquei_gelo;
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            data: [moment().format('YYYY-MM-DD'), Validators.required],
            sport_id: [sportsIds.SOCCER_ID, Validators.required]
        });
    }

    submit() {
        this.showLoadingIndicator = true;
        this.getResultados(this.form.value);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    getResultados(params?) {
        let queryParams: any = {
            'data': moment().format('YYYY-MM-DD'),
            'sport': sportsIds.SOCCER_ID
        };

        if (params) {
            queryParams = params;
        }

        this.resultadoService.getResultados(queryParams)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => {
                    this.showLoadingIndicator = false;
                    this.campeonatos = campeonatos;
                    this.sport = this.form.get('sport_id').value;
                },
                error => this.handleError(error)
            );
    }
}
