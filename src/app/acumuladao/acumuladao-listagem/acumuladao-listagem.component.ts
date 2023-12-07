import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Acumuladao } from './../../models';
import { AcumuladaoService, HeadersService, LayoutService, MessageService } from './../../services';

import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-acumuladao-listagem',
    templateUrl: './acumuladao-listagem.component.html',
    styleUrls: ['./acumuladao-listagem.component.css']
})
export class AcumuladaoListagemComponent implements OnInit {
    acumuladoes: Acumuladao[];
    isMobile = false;
    isLoading = true;
    headerHeight = 92;
    currentHeight = window.innerHeight - this.headerHeight;
    unsub$ = new Subject();

    constructor(
        private router: Router,
        private acumuladaoService: AcumuladaoService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef,
        private layoutService: LayoutService
    ) { }

    ngOnInit() {
        if (window.innerWidth <= 1024) {
            this.isMobile = true;
        }

        this.acumuladaoService.getAcumuladoes()
            .subscribe(
                acumuladoes => {
                    this.acumuladoes = acumuladoes;
                    this.isLoading = false;
                },
                error => this.handleError(error)
            );

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.currentHeight = window.innerHeight - this.headerHeight;
                this.cd.detectChanges();
            });
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    gotTo(id) {
        this.router.navigate([`acumuladao/form/${id}`]);
    }

    verificarEncerramento(dataEncerramento) {
        return moment().isAfter(dataEncerramento);
    }
}
