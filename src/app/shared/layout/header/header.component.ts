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
import { PromocaoComponent } from 'src/app/clientes/promocao/promocao.component';
import { TransacoesHistoricoComponent } from 'src/app/clientes/transacoes-historico/transacoes-historico.component';

declare var xtremepush: any;

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent extends BaseFormComponent implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild('scrollMenu') scrollMenu: ElementRef;
    @ViewChild('menu') menu: ElementRef;
    @ViewChild('indiqueGanheCard', {read: ElementRef}) indiqueGanheCard: ElementRef;

    usuario = new Usuario();
    unsub$ = new Subject();
    modalRef;

    posicaoFinanceira = {
        saldo: 0,
        credito: 0,
        bonus: 0,
        saldoMaisBonus: 0,
        bonusModalidade: 'nenhum'
    };
    myMatchOptions: IsActiveMatchOptions = {
        matrixParams: 'ignored',
        queryParams: 'ignored',
        fragment: 'ignored',
        paths: 'exact'
    };

    BANCA_NOME;
    appVersion;
    messageConnection;
    linguagemSelecionada = 'pt';
    LOGO = config.LOGO;
    bonusBalanceReferAndEarn = '';

    menuWidth;
    clienteWidth;
    scrollWidth;
    valorGanhoPorIndicacao;

    isOpen = false;
    appMobile;
    isMobile = false;
    isConnected = true;
    whatsapp;
    isLoggedIn;
    firstLoggedIn;
    isCliente;
    modoClienteAtivo;
    centered = true;
    enabledBettorPix = false;
    mostrarSaldo;
    removendoIndiqueGanheCard = false;
    seninhaAtiva;
    quininhaAtiva;
    esporteAtivo;
    cassinoAtivo;
    virtuaisAtivo;
    parlaybayAtivo;
    loteriaPopularAtiva;
    loteriasHabilitado = false;
    acumuladaoHabilitado = false;
    desafioHabilitado = false;
    desafioNome: string;
    paginaPromocaoHabilitado = false;
    indiqueGanheHabilitado = false;
    cartaoApostaHabilitado;
    isDemo = location.host === 'demo.wee.bet';
    aoVivoAtivo;
    notificationsXtremepushOpen = false;
    public showHeaderMobile: boolean = false;
    xtremepushHabilitado = false;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (window.innerWidth > 1025) {
            this.menuWidth = window.innerWidth - 500;
            this.isMobile = false;
        } else {
            this.menuWidth = window.innerWidth;
            this.isMobile = true;
        }

        this.onShowHeaderMobile();
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

        this.xtremepushHabilitado = this.paramsService.getOpcoes().xtremepush_habilitado;
        if(this.xtremepushHabilitado) {
            this.verificarNotificacoes();
        }
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

        this.aoVivoAtivo = this.paramsService.aoVivoAtivo();
        this.desafioHabilitado = this.paramsService.getOpcoes().desafio;
        this.desafioNome = this.paramsService.getOpcoes().desafio_nome;
        this.acumuladaoHabilitado = this.paramsService.getOpcoes().acumuladao;
        this.loteriasHabilitado = this.paramsService.getOpcoes().loterias;
        this.seninhaAtiva = this.paramsService.seninhaAtiva();
        this.quininhaAtiva = this.paramsService.quininhaAtiva();
        this.loteriaPopularAtiva = this.paramsService.loteriaPopularAtiva();
        this.esporteAtivo = this.paramsService.getOpcoes().esporte;
        this.cassinoAtivo = this.paramsService.getOpcoes().casino;
        this.virtuaisAtivo = this.paramsService.getOpcoes().virtuais;
        this.parlaybayAtivo = this.paramsService.getOpcoes().parlaybay;
        this.indiqueGanheHabilitado = this.paramsService.indiqueGanheHabilitado();
        this.paginaPromocaoHabilitado = this.paramsService.getOpcoes().habilitar_pagina_promocao;

        this.valorGanhoPorIndicacao = (parseFloat(this.paramsService.getOpcoes().indique_ganhe_valor_por_indicacao).toFixed(2)).replace('.', ',');
        this.bonusBalanceReferAndEarn = this.paramsService.getOpcoes().indique_ganhe_tipo_saldo_ganho == 'bonus' ? "indique_ganhe.inBonus" : "";

        this.modoClienteAtivo = this.paramsService.getOpcoes().modo_cliente;
        this.enabledBettorPix = Boolean(this.paramsService.getOpcoes().payment_methods_available_for_bettors.length);

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

        this.onShowHeaderMobile();
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

    verificarNotificacoes(){
       setInterval(() => {
            xtremepush('inbox', 'message.list', {
                limit: 1,
                opened: 0
            }, (result) => {
                if (result.items.length > 0) {
                    this.atualizarBadge(true);
                }
            }, function(err) {
                console.log(err);
            });
        }, 50000);
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

    openTransactionHistory() {
        this.modalService.open(TransacoesHistoricoComponent);
    }

    abrirDepositosCambista() {
        this.modalService.open(DepositoCambistaComponent);
    }

    abrirApostas() {
        this.modalService.open(ClienteApostasModalComponent);
    }

    abrirRollovers() {
        this.modalService.open(PromocaoComponent);
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
        if (this.router.url.includes('/casino')) {
            return 'active';
        }

        return '';
    }

    activeMenuCassinoLive() {
        if (this.router.url.includes('/live-casino')) {
            return 'active';
        }

        return '';
    }

    activeGameCassinoMobile() {
        const url = this.router.url;

        return (
            this.isMobile
            && (url.match(/\/casino\/\w*/g) || url.match(/\/live-casino\/\w*/g))
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

    private onShowHeaderMobile() {
        this.showHeaderMobile = window.innerWidth <= 1281;
        this.layoutService.changeHeaderHeigh(this.showHeaderMobile ? 106 : 92);
    }

    notificationsXtremepush() {
        this.atualizarBadge(false);

        const xtremepushNotificationContainer = document.getElementById('xtremepushNotificationContainer');
        xtremepushNotificationContainer.innerHTML = '';

        const loadItems = () => {
            xtremepush('inbox', 'message.list', {
            }, (result) => {
                for (let i = 0; i < result.items.length; i++) {
                    const xtremepushItem = result.items[i];

                    const date = new Date(xtremepushItem.create_time * 1000);
                    const formattedDate = date.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    const xtremepushElement = document.createElement('div');
                    xtremepushElement.className = 'xtremepush-notification-item';
                    xtremepushElement.innerHTML = `
                    <div class="xtremepush-card" style="
                        border-bottom: 1px solid rgba(204, 204, 204, 0.5);
                        padding-bottom: 10px;
                    ">
                        <img src="${xtremepushItem.message.icon}" class="xtremepush-card-img-top" alt="${xtremepushItem.message.title}">
                        <div class="xtremepush-card-body">
                            <h5 class="xtremepush-card-title">${xtremepushItem.message.title}</h5>
                            <p class="xtremepush-card-text">${xtremepushItem.message.alert}</p>
                            <p class="xtremepush-card-date">${formattedDate}</p>
                        </div>
                    </div>
                `;

                    xtremepushElement.addEventListener('click', () => {
                        xtremepush('inbox', 'message.action', {
                            id: xtremepushItem.id,
                            open: 1
                        }, (result) => {
                            // if (result.badge !== undefined) {
                            //     this.atualizarBadge(result.badge);
                            // }
                        }, (err) => {
                            console.log(err);
                        });
                    });

                    xtremepushNotificationContainer.appendChild(xtremepushElement);
                }
            }, (err) => {
                console.log(err);
            });
        };

        loadItems();

        this.notificationsXtremepushOpen = !this.notificationsXtremepushOpen;
    }

    atualizarBadge(badge) {
        const badgeElement = document.getElementById('badge-xtremepush');
        if (badge == true) {
            badgeElement.classList.add('show-badge');
        } else {
            badgeElement.classList.remove('show-badge');
        }
    }

    closeNotifications() {
        this.notificationsXtremepushOpen = false;
    }
}
