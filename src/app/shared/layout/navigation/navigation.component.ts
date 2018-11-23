import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { SidebarService, AuthService, PrintService, CampeonatoService, ParametroService } from './../../../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    amanha = moment().add(1, 'd').format('YYYY-MM-DD');
    isLoggedIn;
    isOpen = true;
    itens: any[];
    contexto;
    unsub$ = new Subject();
    @ViewChild('modal') modal: ElementRef;
    @ViewChild('modalJogo') modalJogo: ElementRef;
    modalReference;
    modalReferenceJogo;
    campeonatosImpressao;
    campeonatosSelecionados;
    searchForm: FormGroup = this.fb.group({
        input: ['']
    });

    constructor(
        private auth: AuthService,
        private sidebarService: SidebarService,
        private campeonatoService: CampeonatoService,
        private parametroService: ParametroService,
        private modalService: NgbModal,
        private router: Router,
        private fb: FormBuilder,
        private printService: PrintService
    ) {
        router.events.forEach((event: NavigationEvent) => {
            if(event instanceof NavigationEnd) {
                this.closeMenu();
            }
        });
     }

    ngOnInit() {
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

    openModal() {
        this.modalReference = this.modalService.open(this.modal, { ariaLabelledBy: 'modal-basic-title' });
        this.modalReference.result
            .then((result) => {

            }, (reason) => {

            });
    }

    listPrinters() {
        this.printService.listPrinters();
    }

    printJogos() {
        this.modalReferenceJogo = this.modalService.open(this.modalJogo, { ariaLabelledBy: 'modal-basic-title' });

        const odds = this.parametroService.getOddsImpressao();
        const campeonatosBloqueados = JSON.parse(localStorage.getItem('campeonatos_bloqueados'));

        const queryParams: any = {
            'campeonatos_bloqueados': campeonatosBloqueados,
            'odds': odds,
            'data': moment().format('YYYY-MM-DD')
        };

        this.campeonatoService.getCampeonatos(queryParams).subscribe(
            campeonatos => {
                console.log('campiniii1', campeonatos);
                console.log('campiniii2', this.campeonatosImpressao);
                this.campeonatosImpressao = campeonatos;
                console.log('campiniii2', this.campeonatosImpressao);
                let parent = moment().format('YYYYMMDD');
                let dataTree = [];

                dataTree.push({
                    id: parent,
                    parent: '#',
                    text: moment().format('DD [de] MMMM [de] YYYY'),
                    icon: false
                });

                campeonatos.forEach(campeonato => {
                    dataTree.push({
                        id: campeonato._id,
                        parent: parent,
                        text: campeonato.nome,
                        icon: false
                    });
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
                    console.log('Loaded:', data);
                }).on('changed.jstree', (e, data) => {
                    this.campeonatosSelecionados = data.selected;
                    console.log('Selected:', data.selected);
                });
            },
            err => {
                console.log(err);
            }
        );
    }

    printar() {
        console.log('imprimindo...');
        console.log('campssss', this.campeonatosImpressao);
        let campsSelecionados = [];
        // let camps = this.campeonatosImpressao.reduce((prev, next) => prev.concat(next.jogos), []);

        this.campeonatosSelecionados.forEach(element => {
            let selected = this.campeonatosImpressao.find(camp => camp._id == element);
            if(selected) {
                campsSelecionados.push(selected);
            }
        });

        let jogos = [{data_grupo: moment().format('DD [de] MMMM [de] YYYY'), camps: campsSelecionados}];

        this.printService.gamesAppMobile(jogos);
    }

    search() {
        this.modalReference.close('');
        const input = this.searchForm.value.input;
        this.closeMenu();
        this.router.navigate(['/esportes/futebol/jogos'], { queryParams: { nome: input } });
    }

    onSwipeLeft(evend) {
        // console.log('pos', evend.direction);

        // let ele = document.getElementById('sidebar-wrapper');
        // let currentMargin = parseInt(ele.style.marginLeft, 10);
        if (evend.direction == 2) {
            this.closeMenu();
            // currentMargin -= 10;
        } /*else if (evend.direction == 4) {
            currentMargin += 10;
        } else if (currentMargin < 0) {
            currentMargin = 0;
        }*/
        // ele.style.marginLeft = currentMargin + 'px';
        // this.closeMenu();
    }
}
