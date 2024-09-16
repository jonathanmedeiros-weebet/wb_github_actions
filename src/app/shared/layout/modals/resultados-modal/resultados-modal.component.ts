import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {UntypedFormBuilder, FormGroup, Validators} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, ApostaService, MessageService, ParametrosLocaisService, ResultadoService } from './../../../../services';
import {BaseFormComponent} from '../../base-form/base-form.component';
import {Router} from '@angular/router';
import {Usuario} from '../../../models/usuario';

import * as moment from 'moment';
import { Campeonato } from 'src/app/models';
import {config} from '../../../config';

import * as sportsIds from '../../../constants/sports-ids';

@Component({
    selector: 'app-resultados-modal',
    templateUrl: './resultados-modal.component.html',
    styleUrls: ['./resultados-modal.component.css']
})
export class ResultadosModalComponent extends BaseFormComponent implements OnInit, OnDestroy {
    appMobile;
    unsub$ = new Subject();
    usuario = new Usuario();
    isCliente;
    isLoggedIn;

    showLoadingIndicator = true;

    sportsIds = sportsIds;
    sport;
    campeonatos: Campeonato[] = [];

    basqueteHabilitado = false;
    combateHabilitado = false;
    esportsHabilitado = false;
    futsalHabilitado = false;
    voleiHabilitado = false;
    tenisHabilitado = false;
    futebolAmericanoHabilitado = false;
    hoqueiGeloHabilitado = false;

    hoveredDate: NgbDate | null = null;
    selectedDate: string = '';

    fromDate: NgbDate | null;
    toDate: NgbDate | null;

    LOGO = config.LOGO;
    mobileScreen;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: UntypedFormBuilder,
        private resultadoService: ResultadoService,
        private apostaService: ApostaService,
        private messageService: MessageService,
        private auth: AuthService,
        private paramsService: ParametrosLocaisService,
        private router: Router,
        private calendar: NgbCalendar,
        public formatter: NgbDateParserFormatter,
    ) {
        super();

        this.fromDate = calendar.getNext(calendar.getToday(), 'd', -6);
        this.toDate = calendar.getToday();
    }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <=1024;
        this.appMobile = this.auth.isAppMobile();
        this.createForm();

        this.getResultados();

        this.basqueteHabilitado = this.paramsService.getOpcoes().basquete;
        this.combateHabilitado = this.paramsService.getOpcoes().combate;
        this.esportsHabilitado = this.paramsService.getOpcoes().esports;
        this.futsalHabilitado = this.paramsService.getOpcoes().futsal;
        this.voleiHabilitado = this.paramsService.getOpcoes().volei;
        this.tenisHabilitado = this.paramsService.getOpcoes().tenis;
        this.futebolAmericanoHabilitado = this.paramsService.getOpcoes().futebol_americano;
        this.hoqueiGeloHabilitado = this.paramsService.getOpcoes().hoquei_gelo;
    }

    createForm() {
        this.form = this.fb.group({
            data: [moment().format('YYYY-MM-DD'), Validators.required],
            sport_id: [sportsIds.FOOTBALL_ID, Validators.required]
        });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    submit() {
        this.showLoadingIndicator = true;
        this.getResultados(this.form.value);
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    getResultados(params?) {
        let queryParams: any = {
            'data': moment().format('YYYY-MM-DD'),
            'sport': sportsIds.FOOTBALL_ID
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
