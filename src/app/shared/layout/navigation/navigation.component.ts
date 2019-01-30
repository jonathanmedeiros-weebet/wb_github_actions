import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    CampeonatoService, ParametroService, ApostaEsportivaService,
    MessageService, SupresinhaService, HelperService
} from './../../../services';
import { config } from './../../config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import * as moment from 'moment';

declare var $;

@Component({
    selector: 'app-navigation',
    templateUrl: 'navigation.component.html',
    styleUrls: ['navigation.component.css'],
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
    hoje = moment().format('YYYY-MM-DD');
    amanha = moment().add(1, 'd').format('YYYY-MM-DD');
    isLoggedIn;
    isAppMobile;
    isOpen = true;
    itens: any[];
    contexto;
    campeonatosImpressao;
    campeonatosSelecionados;
    @ViewChild('modalPesquisa') modalPesquisa: ElementRef;
    @ViewChild('modalTabela') modalTabela: ElementRef;
    @ViewChild('modalAposta') modalAposta: ElementRef;
    modalReferencePesquisa;
    modalReferenceTabela;
    modalReferenceAposta;
    exibirBilhete = false;
    pesquisarForm: FormGroup = this.fb.group({
        input: ['']
    });
    aposta;
    unsub$ = new Subject();

    constructor(
        private auth: AuthService,
        private sidebarService: SidebarService,
        private campeonatoService: CampeonatoService,
        private parametroService: ParametroService,
        private modalService: NgbModal,
        private router: Router,
        private fb: FormBuilder,
        private printService: PrintService,
        private apostaEsportivaService: ApostaEsportivaService,
        private messageService: MessageService,
        private supresinhaService: SupresinhaService,
        private renderer: Renderer2,
        private el: ElementRef,
    ) {
        router.events.forEach((event: NavigationEvent) => {
            if (event instanceof NavigationEnd) {
                this.closeMenu();
            }
        });
    }

    ngOnInit() {
        this.LOGO = config.LOGO;
        this.isAppMobile = this.auth.isAppMobile();

        if (window.innerWidth <= 667) {
            this.sidebarService.isOpen
                .pipe(takeUntil(this.unsub$))
                .subscribe(isOpen => this.isOpen = isOpen);
        }

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
                }, 500);
            });

        this.auth.logado
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                isLoggedIn => this.isLoggedIn = isLoggedIn
            );
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

    abrirModalPesquisa() {
        this.modalReferencePesquisa = this.modalService.open(
            this.modalPesquisa,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );
        this.modalReferencePesquisa.result
            .then((result) => { },
                (reason) => { });
    }

    pesquisar() {
        this.modalReferencePesquisa.close('');
        const input = this.pesquisarForm.value.input;
        this.pesquisarForm.reset();
        this.closeMenu();
        this.router.navigate(['/esportes/futebol/jogos'], { queryParams: { nome: input } });
    }

    abrirModalTabela() {
        this.modalReferenceTabela = this.modalService.open(
            this.modalTabela,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );

        const odds = this.parametroService.getOddsImpressao();
        const campeonatosBloqueados = JSON.parse(localStorage.getItem('campeonatos_bloqueados'));

        const queryParams: any = {
            'campeonatos_bloqueados': campeonatosBloqueados,
            'odds': odds.slice(0, 24),
            'data': moment().format('YYYY-MM-DD')
        };

        this.campeonatoService.getCampeonatos(queryParams).subscribe(
            campeonatos => {
                const date = moment().format('YYYYMMDD');
                const dataTree = [];

                dataTree.push({
                    id: date,
                    parent: '#',
                    text: moment().format('DD [de] MMMM [de] YYYY'),
                    icon: false
                });

                this.campeonatosImpressao = campeonatos.map(campeonato => {
                    dataTree.push({
                        id: campeonato._id,
                        parent: date,
                        text: campeonato.nome,
                        icon: false
                    });

                    campeonato.jogos.forEach(jogo => {
                        jogo.cotacoes.forEach(cotacao => {
                            cotacao.valor = HelperService.calcularCotacao(
                                cotacao.valor,
                                cotacao.chave,
                                jogo._id,
                                jogo.cotacoes
                            );
                        });
                    });

                    return campeonato;
                });

                $('#treeJogos').jstree({
                    core: {
                        data: dataTree
                    },
                    checkbox: {
                        keep_selected_style: false
                    },
                    plugins: ['checkbox']
                }).on('loaded.jstree', (e, data) => {

                }).on('changed.jstree', (e, data) => {
                    this.campeonatosSelecionados = data.selected;
                });
            },
            err => {
                console.log(err);
            }
        );
    }

    imprimirTabela() {
        const campsSelecionados = [];

        this.campeonatosImpressao.forEach(campeonatoImpressao => {
            const id = `${campeonatoImpressao._id}`;
            if (this.campeonatosSelecionados.includes(id)) {
                campsSelecionados.push(campeonatoImpressao);
            }
        });

        const jogos = [{ data_grupo: moment().format('DD [de] MMMM [de] YYYY'), camps: campsSelecionados }];

        this.printService.games(jogos);
        this.modalReferenceTabela.close('');
    }

    abrirModalAposta() {
        this.modalReferenceAposta = this.modalService.open(
            this.modalAposta,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );
        this.modalReferenceAposta.result
            .then(
                (result) => { },
                (reason) => this.exibirBilhete = false
            );
    }

    pesquisarAposta() {
        const input = this.pesquisarForm.value.input;
        this.apostaEsportivaService.getAposta(input)
            .subscribe(
                apostaEsportiva => {
                    this.pesquisarForm.reset();
                    this.aposta = apostaEsportiva;
                    this.exibirBilhete = true;
                },
                error => this.messageService.error(error)
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
            number = _.random(1, 60);
        } else {
            number = _.random(1, 80);
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
}
