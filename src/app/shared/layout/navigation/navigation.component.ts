import {ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Event as NavigationEvent, NavigationEnd, Router} from '@angular/router';
import {UntypedFormBuilder, Validators} from '@angular/forms';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
    ApostaService,
    AuthService,
    LayoutService,
    MessageService,
    ParametrosLocaisService,
    PrintService,
    SidebarService,
    SupresinhaService
} from './../../../services';
import {
    ApostaModalComponent,
    AtivarCartaoModalComponent,
    CartaoCadastroModalComponent,
    PesquisaModalComponent,
    PesquisarCartaoModalComponent,
    RecargaCartaoModalComponent,
    SolicitarSaqueModalComponent
} from '../modals';
import {config} from '../../config';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as random from 'lodash.random';
import * as moment from 'moment';
import {BaseFormComponent} from '../base-form/base-form.component';

@Component({
    selector: 'app-navigation',
    templateUrl: 'navigation.component.html',
    styleUrls: ['navigation.component.css']
})
export class NavigationComponent extends BaseFormComponent implements OnInit, OnDestroy {
    headerHeight = 92;
    hoje = moment();
    amanha = moment().add(1, 'd');
    dias = [];
    isLoggedIn;
    isCliente;
    isAppMobile;
    mobileScreen;
    isOpen = true;
    itens: any[];
    contexto;
    esporte = '';
    modalRef;
    cartaoApostaHabilitado;
    loteriasHabilitada;
    acumuladaoHabilitado;
    exibirPaginaDeposito;
    dataLimiteTabela;
    unsub$ = new Subject();
    regiaoOpen = null;
    regioesDestaque;
    LOGO = config.LOGO;
    appUrl = 'https://weebet.s3.amazonaws.com/' + config.SLUG + '/app/app.apk?v=' + (new Date()).getTime();
    trevoOne = false;
    showLoading = false;
    submitting = false;
    heightSidebarNav = 500;
    collapsed = false;
    whatsapp = null;
    blockedHover = false;

    constructor(
        private auth: AuthService,
        private sidebarService: SidebarService,
        private paramsService: ParametrosLocaisService,
        private modalService: NgbModal,
        private router: Router,
        private printService: PrintService,
        private supresinhaService: SupresinhaService,
        private renderer: Renderer2,
        private el: ElementRef,
        private cd: ChangeDetectorRef,
        private apostaService: ApostaService,
        private messageService: MessageService,
        private fb: UntypedFormBuilder,
        private layoutService: LayoutService
    ) {
        super();
        router.events.forEach((event: NavigationEvent) => {
            if (event instanceof NavigationEnd) {
                this.closeMenu();
            }
        });
    }

    ngOnInit() {
        this.createForm();
        this.mobileScreen = window.innerWidth <= 1024;

        this.sidebarService.collapsedSource
            .subscribe(collapse => {
                this.collapsed = collapse;
            });

        if (window.innerWidth <= 1024) {
            this.sidebarService.isOpen
                .pipe(takeUntil(this.unsub$))
                .subscribe(isOpen => {
                    this.isOpen = isOpen;
                    this.cd.detectChanges();
                });
        }

        this.regioesDestaque = this.paramsService.getOpcoes().regioes_destaque

        this.auth.logado
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                isLoggedIn => {
                    this.isLoggedIn = isLoggedIn;
                    this.cd.detectChanges();
                }
            );

        this.auth.cliente
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                isCliente => {
                    this.isCliente = isCliente;
                    this.cd.detectChanges();
                }
            );

        this.isAppMobile = this.auth.isAppMobile();
        this.dataLimiteTabela = this.paramsService.getDataLimiteTabela();
        this.cartaoApostaHabilitado = this.paramsService.getOpcoes().cartao_aposta;
        this.loteriasHabilitada = this.paramsService.getOpcoes().loterias;
        this.acumuladaoHabilitado = this.paramsService.getOpcoes().acumuladao;
        this.exibirPaginaDeposito = this.paramsService.getOpcoes().exibir_pagina_deposito;
        this.preencherDias();

        // this.sidebarService.itens
        //     .pipe(takeUntil(this.unsub$))
        //     .subscribe(dados => {
        //         this.contexto = dados.contexto;
        //         this.itens = dados.itens;
        //
        //         if (dados.esporte) {
        //             this.esporte = dados.esporte;
        //         }
        //
        //         setTimeout(e => {
        //             const alturaMenuFixo = this.el.nativeElement.querySelector('#side-fixed-menu').offsetHeight;
        //             this.maxHeightSidebarNav = alturaMenuFixo + this.headerHeight;
        //             // const menuSideLeftEl = this.el.nativeElement.querySelector('#menu-side-left');
        //             // this.renderer.setStyle(menuSideLeftEl, 'height', `${altura}px`);
        //             // this.cd.detectChanges();
        //         }, 500);
        //     });

        if (location.host.search(/trevoone/) >= 0) {
            this.trevoOne = true;
        }

        if (this.paramsService.getOpcoes().whatsapp) {
            this.whatsapp = this.paramsService.getOpcoes().whatsapp.replace(/\D/g, '');
        }

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.definirAltura();
                this.cd.detectChanges();
            });
    }

    ngOnDestroy(): void {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            'codigo': [null, [Validators.required,
                Validators.minLength(8),
                Validators.maxLength(8)
            ]]
        });
    }

    closeMenu() {
        this.sidebarService.close();
    }

    collapseSidebar() {
        this.sidebarService.collapseSidebar();

        this.blockedHover = true;

        setTimeout(() => {
            this.blockedHover = false;
        }, 1000);
        //
        // this.collapsed = !this.collapsed;
        //
        // if (this.collapsed) {
        //     localStorage.setItem('navigation_callapsed', 'collapsed');
        // } else {
        //     localStorage.removeItem('navigation_callapsed');
        // }
    }

    onSwipeLeft(event) {
        if (parseInt(event.direction, 10) === 2) {
            this.closeMenu();
        }
    }

    listPrinters() {
        this.printService.listPrinters();
    }

    abrirModalCadastroCartao() {
        this.modalRef = this.modalService.open(
            CartaoCadastroModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );

        this.modalRef.result
            .then(
                result => {
                    this.closeMenu();
                },
                reason => {
                }
            );
    }

    abrirModalCartao() {
        this.modalRef = this.modalService.open(
            PesquisarCartaoModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );

        this.modalRef.result
            .then(
                result => {
                    this.closeMenu();
                },
                reason => {
                }
            );
    }

    abrirModalPesquisa() {
        this.modalRef = this.modalService.open(
            PesquisaModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );

        this.modalRef.result
            .then(
                result => {
                    if (result.input) {
                        this.closeMenu();
                        this.router.navigate(['/esportes/futebol/jogos'], {queryParams: {nome: result.input}});
                    }
                },
                reason => {
                }
            );
    }

    abrirModalAposta(codigo) {
        this.submitting = true;
        this.apostaService.getApostaByCodigo(codigo)
            .subscribe(
                apostaLocalizada => {
                    this.modalRef = this.modalService.open(ApostaModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true,
                        scrollable: true
                    });
                    this.modalRef.componentInstance.aposta = apostaLocalizada;
                    this.showLoading = false;
                    this.submitting = false;
                },
                error => {
                    this.handleError(error);
                    this.submitting = false;
                }
            );
    }

    abrirModalSolicitarSaque() {
        this.modalRef = this.modalService.open(
            SolicitarSaqueModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );

        this.modalRef.result
            .then(
                result => this.closeMenu(),
                reason => {
                }
            );
    }

    abrirModalRecargaCartao() {
        this.modalRef = this.modalService.open(
            RecargaCartaoModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );

        this.modalRef.result
            .then(
                result => {
                    this.closeMenu();
                },
                reason => {
                }
            );
    }

    abrirModalAtivarCartao() {
        this.modalRef = this.modalService.open(
            AtivarCartaoModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );

        this.modalRef.result
            .then(
                result => {
                    this.closeMenu();
                },
                reason => {
                }
            );
    }

    /* Geração dos números aleatórios para loteria */
    gerarSupresinha(length, context) {
        const numbers = [];

        for (let index = 0; index < length; index++) {
            const number = this.generateRandomNumber(numbers, context);
            numbers.push(number);
        }

        numbers.sort((a, b) => a - b);
        this.supresinhaService.atualizarSupresinha(numbers);
    }

    /* Gerar número randômico */
    generateRandomNumber(numbers: Number[], context) {
        let number;

        if (context === 'seninha') {
            number = random(1, 60);
        } else {
            number = random(1, 80);
        }

        const find = numbers.find(n => n === number);

        if (!find) {
            return number;
        } else {
            return this.generateRandomNumber(numbers, context);
        }
    }

    goTo(url, queryParams) {
        this.router.navigate([url], {queryParams});
    }

    exibirJogosAmanha() {
        let result = true;
        if (this.dataLimiteTabela) {
            result = !moment(this.dataLimiteTabela).isSameOrBefore(moment(), 'day');
        }
        return result;
    }

    abrirRegiao(regiao) {
        if (regiao === this.regiaoOpen) { // fechando
            this.regiaoOpen = null;
        } else { // abrindo
            this.regiaoOpen = regiao;
        }
    }

    preencherDias() {
        const dtInicial = moment().add(2, 'day');
        const dataLimiteTabela = moment(this.dataLimiteTabela);

        // let temDomingo = false;
        while (dtInicial.isSameOrBefore(dataLimiteTabela, 'day')) { // && !temDomingo
            /* if (dtInicial.day() === 0) {
                temDomingo = true;
            }*/

            this.dias.push({
                'descricao': dtInicial.format('dddd'),
                'format': dtInicial.format('YYYY-MM-DD')
            });
            dtInicial.add('1', 'day');
        }
    }

    definirAltura() {
        const elSideBar = this.el.nativeElement.querySelector('#sidebar-wrapper');
        let height =  window.innerHeight - this.headerHeight;
        this.renderer.setStyle(elSideBar, 'height', `${height}px`);
    }

    refresh() {
        window.location.reload();
    }

    permitirAtivacaoCartao() {
        return !!location.origin.match(/mjrsports.com/g);
    }

    handleError(error) {
        this.messageService.error(error);
    }

    submit() {
        this.abrirModalAposta(this.form.get('codigo').value);
    }
}
