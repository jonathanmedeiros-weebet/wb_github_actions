import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BaseFormComponent} from '../base-form/base-form.component';
import {AuthService, MessageService, ParametrosLocaisService, PrintService, SidebarService} from './../../../services';
import {Usuario} from './../../../models';
import {config} from './../../config';

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
    desafioHabilitado = false;
    appMobile;
    isOpen = false;
    seninhaAtiva;
    quininhaAtiva;
    LOGO = config.LOGO;
    unsub$ = new Subject();
    appVersion;
    isCliente;
    modoClienteAtivo;
    contatoSolicitacaoSaque;
    menuWidth;
    @ViewChild('scrollMenu') scrollMenu: ElementRef;
    rightDisabled: boolean = false;
    leftDisabled: boolean = true;
    scrollPosition = 0;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.menuWidth = window.innerWidth - (250 + 280);
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
        this.contatoSolicitacaoSaque = this.paramsService.getOpcoes().contato_solicitacao_saque.replace(/\D/g, '');

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

        this.menuWidth = window.innerWidth - (250 + 280);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    ngAfterViewInit() {
        this.checkScrollButtons();
        this.cd.detectChanges();
    }

    checkScrollButtons() {
        if (this.menuWidth > this.scrollMenu.nativeElement.scrollWidth) {
            this.rightDisabled = true;
            this.leftDisabled = true;
        } else {
            this.rightDisabled = false;
        }
    }

    scrollLeft() {
        this.scrollMenu.nativeElement.scrollLeft -= 200;
        this.scrollPosition -= 200;
        this.checkScroll();
    }

    scrollRight() {
        this.scrollMenu.nativeElement.scrollLeft += 200;
        this.scrollPosition += 200;
        this.checkScroll();
    }

    onScroll(e) {
        this.checkScroll();
    }

    checkScroll() {
        this.scrollPosition == 0 ? this.leftDisabled = true : this.leftDisabled = false;

        let newScrollLeft = this.scrollMenu.nativeElement.scrollLeft;
        let width = this.scrollMenu.nativeElement.clientWidth;
        let scrollWidth = this.scrollMenu.nativeElement.scrollWidth;

        scrollWidth - (this.scrollPosition + width) <= 0 ? this.rightDisabled = true : this.rightDisabled = false;
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
            'fill': 'var(--foreground-header)',
            'margin-bottom.px': '5'
        };
    }
}
