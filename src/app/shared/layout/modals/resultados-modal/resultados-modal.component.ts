import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, ApostaService, MessageService, ParametrosLocaisService, ResultadoService } from './../../../../services';
import {BaseFormComponent} from '../../base-form/base-form.component';
import {Router} from '@angular/router';
import {Usuario} from '../../../models/usuario';

import * as moment from 'moment';
import { Campeonato } from 'src/app/models';

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

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private resultadoService: ResultadoService,
        private apostaService: ApostaService,
        private messageService: MessageService,
        private auth: AuthService,
        private paramsService: ParametrosLocaisService,
        private router: Router,
    ) {
        super();
    }

    ngOnInit() {
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
            sport_id: ['1', Validators.required]
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
            'sport': 1
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
