import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
import { SidebarService, AuthService } from './../../../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';

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
    modalReference;
    searchForm: FormGroup = this.fb.group({
        input: ['']
    });

    constructor(
        private auth: AuthService,
        private sidebarService: SidebarService,
        private modalService: NgbModal,
        private router: Router,
        private fb: FormBuilder
    ) { }

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

    openModal() {
        this.modalReference = this.modalService.open(this.modal, { ariaLabelledBy: 'modal-basic-title' });
        this.modalReference.result
            .then((result) => {

            }, (reason) => {

            });
    }

    search() {
        this.modalReference.close('');
        const input = this.searchForm.value.input;
        this.router.navigate(['/esportes/futebol/jogos'], { queryParams: { nome: input } });
    }
}
