import { RolloverComponent } from './../../../clientes/rollover/rollover.component';
import {AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {IsActiveMatchOptions, Router} from '@angular/router';
import {UntypedFormBuilder} from '@angular/forms';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BaseFormComponent} from '../base-form/base-form.component';
import {AuthService, MessageService, ParametrosLocaisService, PrintService, SidebarService, ConnectionCheckService, ClienteService, LayoutService} from './../../../services';
import {Usuario} from './../../../models';
import {config} from '../../config';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
    AuthDoisFatoresModalComponent,
    CadastroModalComponent,
    CartaoCadastroModalComponent,
    ClienteApostasModalComponent,
    ClientePerfilModalComponent,
    ClientePixModalComponent,
    ClienteSenhaModalComponent,
    LoginModalComponent,
    PesquisarCartaoMobileModalComponent,
    RecargaCartaoModalComponent
} from '../modals';
import {DepositoComponent} from 'src/app/clientes/deposito/deposito.component';
import {SolicitacaoSaqueClienteComponent} from 'src/app/clientes/solicitacao-saque-cliente/solicitacao-saque-cliente.component';
import {DashboardComponent} from 'src/app/cambistas/dashboard/dashboard.component';
import {ApuracaoComponent} from 'src/app/cambistas/apuracao/apuracao.component';
import {ValidarApostaWrapperComponent} from 'src/app/validar-aposta/wrapper/validar-aposta-wrapper.component';
import {TabelaComponent} from 'src/app/cambistas/tabela/tabela.component';
import {SolicitacaoSaqueComponent} from 'src/app/cambistas/solicitacao-saque/solicitacao-saque.component';
import {CartaoComponent} from 'src/app/cambistas/cartao/cartao.component';
import {ApostaComponent} from 'src/app/cambistas/aposta/aposta.component';
import {TranslateService} from '@ngx-translate/core';
import {FinanceiroComponent} from '../../../clientes/financeiro/financeiro.component';
import {ConfiguracoesComponent} from '../../../clientes/configuracoes/configuracoes.component';
import {MovimentacaoComponent} from '../../../cambistas/movimentacao/movimentacao.component';
import {DepositoCambistaComponent} from '../../../cambistas/deposito/deposito-cambista.component';
import { IndiqueGanheComponent } from 'src/app/clientes/indique-ganhe/indique-ganhe.component';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent extends BaseFormComponent implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild('scrollMenu') scrollMenu: ElementRef;
    @ViewChild('menu') menu: ElementRef;
    @ViewChild('indiqueGanheCard', {read: ElementRef}) indiqueGanheCard: ElementRef;
    paginaPromocaoHabilitado = false;
    loteriasHabilitado = false;
    acumuladaoHabilitado = false;
    desafioHabilitado = false;
    indiqueGanheHabilitado = false;
    posicaoFinanceira = {
        saldo: 0,
        credito: 0,
        bonus: 0,
        saldoMaisBonus: 0,
        bonusModalidade: 'nenhum'
    };
    usuario = new Usuario();
    isLoggedIn;
    BANCA_NOME;
    appMobile;
    isOpen = false;
    seninhaAtiva;
    quininhaAtiva;
    loteriaPopularAtiva;
    esporteAtivo;
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
    cartaoApostaHabilitado;
    modalRef;
    linguagemSelecionada = 'pt';
    myMatchOptions: IsActiveMatchOptions = {
        matrixParams: 'ignored',
        queryParams: 'ignored',
        fragment: 'ignored',
        paths: 'exact'
    };
    mostrarSaldo;
    firstLoggedIn;
    valorGanhoPorIndicacao;
    removendoIndiqueGanheCard = false;
    messageConnection;
    isConnected = true;
    isDemo = location.host === 'demo.wee.bet';

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
        private fb: UntypedFormBuilder,
        private messageService: MessageService,
        private auth: AuthService,
        private sidebarService: SidebarService,
        private printService: PrintService,
        private paramsService: ParametrosLocaisService,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private translate: TranslateService,
        private router: Router,
        private connectionCheck: ConnectionCheckService,
        private renderer: Renderer2,
        private host: ElementRef,
        private clienteService: ClienteService,
        private layoutService: LayoutService
    ) {
        super();
    }

    ngOnInit() {
        this.BANCA_NOME = config.BANCA_NOME;
        this.appMobile = this.auth.isAppMobile();
        this.appVersion = localStorage.getItem('app_version');

        this.cartaoApostaHabilitado = this.paramsService.getOpcoes().cartao_aposta;

        if (this.paramsService.getOpcoes().whatsapp) {
            this.whatsapp = this.paramsService.getOpcoes().whatsapp.replace(/\D/g, '');
        }

        this.clienteService.logado
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                isLoggedIn => {
                    if (!this.firstLoggedIn) {
                        this.firstLoggedIn = isLoggedIn;
                    }

                    this.isLoggedIn = isLoggedIn;

                    if (isLoggedIn) {
                        this.getUsuario();
                        this.getPosicaoFinanceira();
                    }
                }
            );

        if (!this.isLoggedIn) {
            this.auth.logado
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    isLoggedIn => {
                        if (!this.firstLoggedIn) {
                            this.firstLoggedIn = isLoggedIn;
                        }

                        this.isLoggedIn = isLoggedIn;
                        if (isLoggedIn) {
                            this.getUsuario();

                            if (this.usuario.tipo_usuario === 'cambista' && this.firstLoggedIn) {
                                this.getPosicaoFinanceira();
                            } else {
                                this.getPosicaoFinanceira();
                            }
                        }
                    }
                );
        }

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
        this.loteriaPopularAtiva = this.paramsService.loteriaPopularAtiva();
        this.esporteAtivo = this.paramsService.getOpcoes().esporte;
        this.cassinoAtivo = this.paramsService.getOpcoes().casino;
        this.virtuaisAtivo = this.paramsService.getOpcoes().virtuais;
        this.indiqueGanheHabilitado = this.paramsService.indiqueGanheHabilitado();
        this.paginaPromocaoHabilitado = this.paramsService.getOpcoes().habilitar_pagina_promocao;

        this.valorGanhoPorIndicacao =  (parseFloat(this.paramsService.getOpcoes().indique_ganhe_valor_por_indicacao).toFixed(2)).replace('.', ',');

        this.modoClienteAtivo = this.paramsService.getOpcoes().modo_cliente;
        this.pixCambista = this.paramsService.getOpcoes().pix_cambista;

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

        this.linguagemSelecionada = this.translate.currentLang;
        this.translate.onLangChange.subscribe(res => this.linguagemSelecionada = res.lang);
        this.mostrarSaldo =  JSON.parse(localStorage.getItem('exibirSaldo'));

        if(this.mostrarSaldo == null){
            localStorage.setItem('exibirSaldo', 'true');
            this.mostrarSaldo = 'true';
        }

        this.connectionCheck.onlineStatus$.subscribe((isOnline) => {
            let element = this.host.nativeElement.querySelector('.info-connection-card');
            let icon = this.host.nativeElement.querySelector('.fa-exclamation-triangle');

            if (!isOnline) {
                this.isConnected = false;
                this.messageConnection = 'Sem conexão com a internet';
                this.renderer.removeClass(element, 'online');
                this.renderer.addClass(element, 'offline');
                this.renderer.removeClass(element, 'hide');
                this.renderer.removeClass(icon, 'icon-hidden');
                setTimeout(() => {
                    this.renderer.addClass(element, 'show');
                }, 100);
            } else if (isOnline && this.messageConnection === 'Sem conexão com a internet') {
                this.isConnected = true
                this.messageConnection = 'Conexão restabelecida';
                this.renderer.removeClass(element, 'offline');
                this.renderer.addClass(element, 'online');
                this.renderer.addClass(icon, 'icon-hidden');
                setTimeout(() => {
                    this.renderer.removeClass(element, 'show');
                    setTimeout(() => {
                        this.renderer.addClass(element, 'hide');
                    }, 1000);
                }, 1000);
            }
        });

        if (this.indiqueGanheHabilitado && (!this.isLoggedIn || this.isCliente) && !this.activeGameCassinoMobile()) {
            this.layoutService.changeIndiqueGanheCardHeight(37);
        }

        if(!this.indiqueGanheHabilitado){
            this.layoutService.indiqueGanheRemovido(true);
        }
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    ngAfterViewChecked() {
        this.checkCentering();
        this.cd.detectChanges();
    }

    checkCentering() {
        const scrollWidth = this.menu.nativeElement.scrollWidth;
        this.centered = scrollWidth <= window.innerWidth;
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
                posicaoFinanceira => {
                    this.posicaoFinanceira = posicaoFinanceira;
                    this.posicaoFinanceira.saldoMaisBonus = posicaoFinanceira.saldo;
                    if (this.isCliente) {
                        this.posicaoFinanceira.saldoMaisBonus = Number(posicaoFinanceira.saldo) + Number(posicaoFinanceira.bonus);
                    }
                },
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
                size: 'md',
                centered: true,
                windowClass: 'modal-500 modal-cadastro-cliente'
            }
        );
    }

    abrirLogin() {
        this.modalRef = this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350 modal-login',
                centered: true,
            }
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

    abrirConfiguracoes() {
        this.modalService.open(ConfiguracoesComponent);
    }

    abrirFinanceiro() {
        this.modalService.open(FinanceiroComponent);

    }

    abrirCambistaMovimentacao(){
        this.modalService.open(MovimentacaoComponent);
    }

    abrirSaques() {
        this.modalService.open(SolicitacaoSaqueClienteComponent);
    }

    abrirDepositos() {
        this.modalService.open(DepositoComponent);
    }

    abrirDepositosCambista() {
        this.modalService.open(DepositoCambistaComponent);
    }

    abrirApostas() {
        this.modalService.open(ClienteApostasModalComponent);
    }

    abrirRollovers() {
        this.modalService.open(RolloverComponent);
    }

    abrirIndiqueGanhe() {
        this.modalService.open(IndiqueGanheComponent);
    }

    abrirCambistaDashboard() {
        this.modalService.open(DashboardComponent);
    }

    abrirCambistaCartaoConsultar() {
        this.modalService.open(PesquisarCartaoMobileModalComponent);
    }

    abrirCambistaCartaoCriar() {
        this.modalService.open(CartaoCadastroModalComponent);
    }

    abrirCambistaCartaoListagem() {
        this.modalService.open(CartaoComponent);
    }

    abrirCambistaCartaoSaque() {
        this.modalService.open(SolicitacaoSaqueComponent);
    }

    abrirCambistaCartaoRecarga() {
        this.modalService.open(RecargaCartaoModalComponent);
    }

    abrirCambistaValidacao() {
        this.modalService.open(ValidarApostaWrapperComponent);
    }

    abrirCambistaApuracao() {
        this.modalService.open(ApuracaoComponent);
    }

    abrirCambistaApostas() {
        this.modalService.open(ApostaComponent);
    }

    abrirCambistaTabela() {
        this.modalService.open(TabelaComponent);
    }

    useLanguage(language: string): void {
        localStorage.setItem('linguagem', language);
        this.linguagemSelecionada = language;
        this.translate.use(language);
    }

    alternarExibirSaldo(event) {
        event.stopPropagation();
        this.mostrarSaldo = !this.mostrarSaldo;
        localStorage.setItem('exibirSaldo', this.mostrarSaldo);
    }

    activeMenuCassino() {
        if (this.router.url.includes('/casino/c/')) {
            return 'active';
        }

        return '';
    }

    activeMenuCassinoLive() {
        if (this.router.url.includes('/casino/cl/')) {
            return 'active';
        }

        return '';
    }

    activeGameCassinoMobile() {
        return (
            this.isMobile
            && (this.router.url.includes('/casino/c/play') || this.router.url.includes('/casino/cl/play'))
        );
    }

    redirectIndiqueGanhe() {
        if (!this.isLoggedIn) {
            this.abrirLogin();
        } else {
            if (this.isMobile) {
                this.abrirIndiqueGanhe();
            } else {
                this.router.navigate(['clientes/indique-ganhe']);
            }
            this.removerIndiqueGanheCard();
        }
    }

    removerIndiqueGanheCard() {
        this.removendoIndiqueGanheCard = true;
        let card = this.indiqueGanheCard.nativeElement;
        this.renderer.setStyle(card, 'height', '0');
        this.renderer.setStyle(card, 'padding', '0 20px');
        setTimeout(() => { this.renderer.removeChild(this.host.nativeElement, card); }, 1000);
        setTimeout(() => { this.layoutService.changeIndiqueGanheCardHeight(0); }, 300);
        this.layoutService.indiqueGanheRemovido(true);
    }

    btnCardOnMouseOver() {
        this.renderer.setStyle(this.indiqueGanheCard.nativeElement, 'height', '45px');
        this.layoutService.changeIndiqueGanheCardHeight(45);
    }

    btnCardOnMouseOut() {
        this.renderer.setStyle(this.indiqueGanheCard.nativeElement, 'height', '37px');
        setTimeout(() => { this.layoutService.changeIndiqueGanheCardHeight(37); }, 300);
    }
}
