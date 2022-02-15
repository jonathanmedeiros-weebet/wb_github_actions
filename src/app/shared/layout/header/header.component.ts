import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../base-form/base-form.component';
import { AuthService, MessageService, ParametrosLocaisService, PrintService, SidebarService } from './../../../services';
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
export class HeaderComponent extends BaseFormComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('scrollMenu') scrollMenu: ElementRef;
    basqueteHabilitado = false;
    combateHabilitado = false;
    esportsHabilitado = false;
    loteriasHabilitado = false;
    aoVivoHabilitado = false;
    acumuladaoHabilitado = false;
    desafioHabilitado = false;
    futsalHabilitado = false;
    voleiHabilitado = false;
    tenisHabilitado = false;
    futebolAmericanoHabilitado = false;
    hoqueiGeloHabilitado = false;
    posicaoFinanceira = {
        saldo: 0,
        credito: 0,
        bonus: 0
    };
    usuario = new Usuario();
    isLoggedIn;
    BANCA_NOME;
    appMobile;
    isOpen = false;
    seninhaAtiva;
    quininhaAtiva;
    LOGO = config.LOGO;
    appVersion;
    whatsapp;
    isCliente;
    modoClienteAtivo;
    menuWidth;
    clienteWidth;
    scrollWidth;
    rightDisabled = false;
    leftDisabled = true;
    unsub$ = new Subject();

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (window.innerWidth > 1025) {
            this.menuWidth = window.innerWidth - (250 + 280);
        } else {
            this.menuWidth = window.innerWidth;
        }

        this.cd.detectChanges();

        this.checkScrollButtons();
    }

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private auth: AuthService,
        private sidebarService: SidebarService,
        private printService: PrintService,
        private paramsService: ParametrosLocaisService,
        private cd: ChangeDetectorRef
    ) {
        super();
    }

    ngOnInit() {
        this.BANCA_NOME = config.BANCA_NOME;
        this.appMobile = this.auth.isAppMobile();
        this.appVersion = localStorage.getItem('app_version');
        this.whatsapp = this.paramsService.getOpcoes().whatsapp.replace(/\D/g, '');

        this.auth.logado
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                isLoggedIn => this.isLoggedIn = isLoggedIn
            );

        this.auth.cliente
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                isCliente => this.isCliente = isCliente
            );

        this.basqueteHabilitado = this.paramsService.getOpcoes().basquete;
        this.combateHabilitado = this.paramsService.getOpcoes().combate;
        this.esportsHabilitado = this.paramsService.getOpcoes().esports;
        this.loteriasHabilitado = this.paramsService.getOpcoes().loterias;
        this.aoVivoHabilitado = this.paramsService.getOpcoes().aovivo;
        this.acumuladaoHabilitado = this.paramsService.getOpcoes().acumuladao;
        this.desafioHabilitado = this.paramsService.getOpcoes().desafio;
        this.futsalHabilitado = this.paramsService.getOpcoes().futsal;
        this.voleiHabilitado = this.paramsService.getOpcoes().volei;
        this.tenisHabilitado = this.paramsService.getOpcoes().tenis;
        this.futebolAmericanoHabilitado = this.paramsService.getOpcoes().futebol_americano;
        this.hoqueiGeloHabilitado = this.paramsService.getOpcoes().hoquei_gelo;
        this.seninhaAtiva = this.paramsService.seninhaAtiva();
        this.quininhaAtiva = this.paramsService.quininhaAtiva();
        this.modoClienteAtivo = this.paramsService.getOpcoes().modo_cliente;

        if (window.innerWidth <= 1024) {
            this.sidebarService.isOpen
                .pipe(takeUntil(this.unsub$))
                .subscribe(isOpen => this.isOpen = isOpen);
        }

        this.getUsuario();
        this.createForm();

        if (window.innerWidth > 1025) {
            this.menuWidth = window.innerWidth - (250 + 280);
        } else {
            this.menuWidth = window.innerWidth;
        }
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    ngAfterViewInit() {
        this.clienteWidth = this.scrollMenu.nativeElement.clientWidth;
        this.scrollWidth = this.scrollMenu.nativeElement.scrollWidth;

        this.checkScrollButtons();
    }

    checkScrollButtons() {
        if (this.menuWidth >= this.scrollWidth) {
            this.rightDisabled = true;
            this.leftDisabled = true;
        } else {
            this.rightDisabled = false;
        }

        this.cd.detectChanges();
    }

    scrollLeft() {
        this.scrollMenu.nativeElement.scrollLeft -= 200;
    }

    scrollRight() {
        this.scrollMenu.nativeElement.scrollLeft += 200;
    }

    onScroll(event) {
        let scrollLeft = this.scrollMenu.nativeElement.scrollLeft;

        if (scrollLeft <= 0) {
            this.leftDisabled = true;
        } else {
            this.leftDisabled = false;
        }

        if ((this.scrollWidth - (scrollLeft + this.clienteWidth)) <= 0) {
            this.rightDisabled = true;
        } else {
            this.rightDisabled = false;
        }
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
                () => {
                    this.getUsuario();
                    if (this.usuario.tipo_usuario === 'cambista') {
                        location.reload();
                    }
                },
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

    listPrinters() {
        this.printService.listPrinters();
    }

    getPosicaoFinanceira() {
        this.auth.getPosicaoFinanceira()
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                posicaoFinanceira => this.posicaoFinanceira = posicaoFinanceira,
                error => this.handleError(error)
            );
    }

    svgCss() {
        return {
            'width.rem': 2,
            'fill': 'var(--foreground-header)'
        };
    }

    menuCategoriesClasses() {
        return {
            'justify-center': this.leftDisabled && this.rightDisabled && this.menuWidth <= window.innerWidth,
            'justify-normal': window.innerWidth <= 1025 && this.menuWidth > window.innerWidth
        };
    }
}
