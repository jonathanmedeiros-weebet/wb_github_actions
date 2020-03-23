import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../base-form/base-form.component';
import { ParametrosLocaisService, AuthService, MessageService, SidebarService, PrintService } from './../../../services';
import { Usuario } from './../../../models';
import { config } from './../../config';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css'],
    animations: [
        trigger('openClose', [
            state('open', style({
                'left': '0',
            })),
            state('closed', style({
                'left': '0',
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
export class HeaderComponent extends BaseFormComponent implements OnInit, OnDestroy {
    posicaoFinanceira = {
        saldo: 0,
        credito: 0
    };
    usuario = new Usuario();
    isLoggedIn;
    BANCA_NOME;
    basqueteHabilitado = false;
    combateHabilitado = false;
    esportsHabilitado = false;
    loteriasHabilitado = false;
    aoVivoHabilitado = false;
    acumuladaoHabilitado = false;
    appMobile;
    isOpen = false;
    seninhaAtiva;
    quininhaAtiva;
    unsub$ = new Subject();

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private auth: AuthService,
        private sidebarService: SidebarService,
        private printService: PrintService,
        private paramsService: ParametrosLocaisService
    ) {
        super();
    }

    ngOnInit() {
        this.BANCA_NOME = config.BANCA_NOME;
        this.appMobile = this.auth.isAppMobile();

        this.auth.logado
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                isLoggedIn => this.isLoggedIn = isLoggedIn
            );

        this.basqueteHabilitado = this.paramsService.getOpcoes().basquete;
        this.combateHabilitado = this.paramsService.getOpcoes().combate;
        this.esportsHabilitado = this.paramsService.getOpcoes().esports;
        this.loteriasHabilitado = this.paramsService.getOpcoes().loterias;
        this.aoVivoHabilitado = this.paramsService.getOpcoes().aovivo;
        this.acumuladaoHabilitado = this.paramsService.getOpcoes().acumuladao;
        this.seninhaAtiva = this.paramsService.seninhaAtiva();
        this.quininhaAtiva = this.paramsService.quininhaAtiva();

        if (window.innerWidth <= 667) {
            this.sidebarService.isOpen
                .pipe(takeUntil(this.unsub$))
                .subscribe(isOpen => this.isOpen = isOpen);
        }

        this.getUsuario();
        this.createForm();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            username: ['', Validators.compose([Validators.required])],
            password: [
                '',
                Validators.compose([Validators.required, Validators.minLength(2)])
            ]
        });
    }

    submit() {
        this.auth.login(this.form.value)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                () => this.getUsuario(),
                error => this.handleError(error)
            );
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    toggleSidebar() {
        this.sidebarService.toggle();
    }

    logout() {
        this.auth.logout();
        this.getUsuario();
        // this.atualizarTiposAposta();
    }

    getUsuario() {
        this.usuario = this.auth.getUser();
    }

    // atualizarTiposAposta() {
    //     this.parametroService.getParametros()
    //         .pipe(takeUntil(this.unsub$))
    //         .subscribe(
    //             parametros => {
    //                 localStorage.setItem('tipos_aposta', JSON.stringify(parametros['tipos_aposta']));
    //             },
    //             error => this.messageService.error(error)
    //         );
    // }

    listPrinters() {
        this.printService.listPrinters();
    }

    appVersion() {
        const message = {
            data: '',
            action: 'showVersion',
        };

        parent.postMessage(message, 'file://'); // file://
        console.log('app version');
    }

    getPosicaoFinanceira(event) {
        if (this.isLoggedIn) {
            this.auth.getPosicaoFinanceira()
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    posicaoFinanceira => this.posicaoFinanceira = posicaoFinanceira,
                    error => this.handleError(error)
                );
        }
    }

    svgCss() {
        return {
            'width.rem': 2,
            'fill': 'var(--foreground-header)',
            'margin-bottom.px': '5'
        };
    }
}
