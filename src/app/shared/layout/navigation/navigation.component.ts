import {
    Component, OnInit, ElementRef,
    Renderer2, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Router, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    SidebarService, AuthService, PrintService,
    ParametrosLocaisService, SupresinhaService
} from './../../../services';
import {
    PesquisaModalComponent, TabelaModalComponent,
    PesquisarApostaModalComponent, CartaoCadastroModalComponent,
    PesquisarCartaoModalComponent, SolicitarSaqueModalComponent,
    RecargaCartaoModalComponent
} from '../modals';
import { config } from './../../config';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as random from 'lodash.random';
import * as moment from 'moment';

@Component({
    selector: 'app-navigation',
    templateUrl: 'navigation.component.html',
    styleUrls: ['navigation.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('openClose', [
            state('open', style({
                'margin-left': '0px',
            })),
            state('closed', style({
                'margin-left': '-255px',
                visibility: 'hidden'
            })),
            transition('open => closed', [
                animate('400ms ease-in')
            ]),
            transition('closed => open', [
                animate('400ms ease-out')
            ])
        ])
    ]
})
export class NavigationComponent implements OnInit {
    LOGO;
    hoje = moment();
    amanha = moment().add(1, 'd');
    dias = [];
    isLoggedIn;
    isAppMobile;
    isOpen = true;
    itens: any[];
    contexto;
    modalRef;
    opcoes;
    primeiraPagina;
    dataLimiteTabela;
    unsub$ = new Subject();
    regiaoOpen = null;

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
        private cd: ChangeDetectorRef
    ) {
        router.events.forEach((event: NavigationEvent) => {
            if (event instanceof NavigationEnd) {
                this.closeMenu();
            }
        });
    }

    ngOnInit() {
        if (window.innerWidth <= 667) {
            this.sidebarService.isOpen
                .pipe(takeUntil(this.unsub$))
                .subscribe(isOpen => {
                    this.isOpen = isOpen;
                    this.cd.detectChanges();
                });
        }

        this.LOGO = config.LOGO;
        this.isAppMobile = this.auth.isAppMobile();
        this.primeiraPagina = this.paramsService.getPrimeiraPagina();
        this.dataLimiteTabela = this.paramsService.getDataLimiteTabela();
        this.isLoggedIn = this.auth.isLoggedIn();
        this.preencherDias();

        this.sidebarService.itens
            .pipe(takeUntil(this.unsub$))
            .subscribe(dados => {
                this.contexto = dados.contexto;
                this.itens = dados.itens;

                setTimeout(e => {
                    const alturaMenuFixo = this.el.nativeElement.querySelector('#side-fixed-menu').offsetHeight;
                    const altura = window.innerHeight - (alturaMenuFixo + 15);
                    const menuSideLeftEl = this.el.nativeElement.querySelector('#menu-side-left');
                    this.renderer.setStyle(menuSideLeftEl, 'height', `${altura}px`);
                    this.cd.detectChanges();
                }, 500);
            });
    }

    closeMenu() {
        this.sidebarService.close();
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
                reason => { }
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
                reason => { }
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
                        this.router.navigate(['/esportes/futebol/jogos'], { queryParams: { nome: result.input } });
                    }
                },
                reason => { }
            );
    }

    abrirModalTabela() {
        this.modalRef = this.modalService.open(
            TabelaModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );

        this.modalRef.result
            .then(result => {
                this.closeMenu();
            }, reason => { });
    }

    abrirModalAposta() {
        this.modalRef = this.modalService.open(
            PesquisarApostaModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );

        this.modalRef.result
            .then(
                result => { },
                reason => { }
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
                result => { },
                reason => { }
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
                reason => { }
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
        this.router.navigate([url], { queryParams });
    }

    exibirJogosAmanha() {
        let result = true;
        if (this.dataLimiteTabela) {
            result = !moment(this.dataLimiteTabela).isSameOrBefore(moment(), 'day');
        }
        return result;
    }

    abrirRegiao(regiao) {
        if (regiao == this.regiaoOpen) { // fechando
            this.regiaoOpen = null;
        } else { // abrindo
            this.regiaoOpen = regiao;
        }
    }

    preencherDias() {
        const dtInicial = moment().add(2, 'day');
        const dataLimiteTabela = moment(this.dataLimiteTabela);

        let temDomingo = false;
        while (dtInicial.isSameOrBefore(dataLimiteTabela, 'day') && !temDomingo) {
            if (dtInicial.day() === 0) {
                temDomingo = true;
            }

            this.dias.push({
                'descricao': dtInicial.format('dddd'),
                'format': dtInicial.format('YYYY-MM-DD')
            });
            dtInicial.add('1', 'day');
        }
    }

    refresh() {
        sessionStorage.clear();
        window.location.reload();
    }
}
