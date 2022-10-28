import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BaseFormComponent} from '../base-form/base-form.component';
import {AuthService, MessageService, ParametrosLocaisService, PrintService, SidebarService} from './../../../services';
import {Usuario} from './../../../models';
import {config} from '../../config';
import {Router} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthDoisFatoresModalComponent, CadastroModalComponent, ClienteApostasModalComponent, ClientePerfilModalComponent, ClientePixModalComponent, ClienteSenhaModalComponent, LoginModalComponent } from '../modals';
import { DepositoComponent } from 'src/app/clientes/deposito/deposito.component';
import { SolicitacaoSaqueClienteComponent } from 'src/app/clientes/solicitacao-saque-cliente/solicitacao-saque-cliente.component';
import { ApostasClienteComponent } from 'src/app/clientes/apostas-cliente/apostas-cliente.component';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent extends BaseFormComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('scrollMenu') scrollMenu: ElementRef;
    loteriasHabilitado = false;
    acumuladaoHabilitado = false;
    desafioHabilitado = false;
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
    cassinoAtivo;
    virtuaisAtivo;
    LOGO = config.LOGO;
    appVersion;
    whatsapp;
    isCliente;
    modoClienteAtivo;
    menuWidth;
    clienteWidth;
    scrollWidth;
    unsub$ = new Subject();
    isMobile = false;
    centered = true;
    pixCambista = false;
    modalRef;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (window.innerWidth > 1025) {
            this.menuWidth = window.innerWidth - 500;
            this.isMobile = false;
        } else {
            this.menuWidth = window.innerWidth;
            this.isMobile = true;
        }
        this.cd.detectChanges();

        this.checkCentering();
    }

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private auth: AuthService,
        private sidebarService: SidebarService,
        private printService: PrintService,
        private paramsService: ParametrosLocaisService,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private router: Router
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
                isLoggedIn => {
                    this.isLoggedIn = isLoggedIn;
                    if (isLoggedIn) {
                        this.getUsuario();
                        this.getPosicaoFinanceira();
                    }
                }
            );

        this.auth.cliente
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                isCliente => this.isCliente = isCliente
            );

        this.desafioHabilitado = this.paramsService.getOpcoes().desafio;
        this.acumuladaoHabilitado = this.paramsService.getOpcoes().acumuladao;
        this.loteriasHabilitado = this.paramsService.getOpcoes().loterias;
        this.seninhaAtiva = this.paramsService.seninhaAtiva();
        this.quininhaAtiva = this.paramsService.quininhaAtiva();
        this.cassinoAtivo = this.paramsService.getOpcoes().casino;
        this.virtuaisAtivo = this.paramsService.getOpcoes().virtuais;

        this.modoClienteAtivo = this.paramsService.getOpcoes().modo_cliente;

        if (window.innerWidth <= 1024) {
            this.sidebarService.isOpen
                .pipe(takeUntil(this.unsub$))
                .subscribe(isOpen => this.isOpen = isOpen);
        }

        this.getUsuario();
        this.createForm();

        if (window.innerWidth > 1025) {
            this.menuWidth = window.innerWidth - (350 + 350);
            this.isMobile = false;
        } else {
            this.menuWidth = window.innerWidth;
            this.isMobile = true;
        }
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    ngAfterViewInit() {
        this.scrollWidth = this.scrollMenu.nativeElement.scrollWidth;
        this.checkCentering();
    }

    checkCentering() {
        this.centered = this.menuWidth >= this.scrollWidth;
        this.cd.detectChanges();
    }

    createForm() {
    }

    submit() {
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
                error => {
                    if (error === 'Não autorizado.' || error === 'Login expirou, entre novamente.') {
                        this.auth.logout();
                    } else {
                        this.handleError(error);
                    }
                }
            );
    }

    svgCss() {
        return {
            'width.rem': 2,
            'fill': 'var(--foreground-header)'
        };
    }

    abrirCadastro() {
        this.modalRef = this.modalService.open(
            CadastroModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                centered: true,
            }
        );
    }

    abrirLogin() {

        let options = {};

        if (this.isMobile) {
            options = {
                windowClass: 'modal-fullscreen',
            }
        } else {
            options = {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-600',
                centered: true,
            }
        }

        this.modalRef = this.modalService.open(
            LoginModalComponent, options
        );
    }

    abrirModalAuthDoisFatores() {
        this.modalRef = this.modalService.open(
            AuthDoisFatoresModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-600',
                centered: true,
            }
        );
    }

    changeTheme() {
        document.body.classList.toggle('dark');
    }

    abrirEditarPerfil() {
        this.modalService.open(ClientePerfilModalComponent);
    }

    abrirAlterarSenha() {
        this.modalService.open(ClienteSenhaModalComponent);
    }

    abrirPix() {
        this.modalService.open(ClientePixModalComponent);
    }

    abrirFinanceiro() {

    }

    abrirSaques() {
        this.modalService.open(SolicitacaoSaqueClienteComponent);
    }

    abrirDepositos() {
        this.modalService.open(DepositoComponent);
    }

    abrirApostas() {
        this.modalService.open(ClienteApostasModalComponent);
    }

    abrirAjuda() {

    }
}
