import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IndiqueGanheComponent } from 'src/app/clientes/indique-ganhe/indique-ganhe.component';
import { AuthService, ClienteService, ConnectionCheckService, LayoutService, ParametrosLocaisService, PrintService, SidebarService } from 'src/app/services';
import { LoginModalComponent } from 'src/app/shared/layout/modals';

@Component({
    selector: 'app-cards-modalidade',
    templateUrl: './cards-modalidade.component.html',
    styleUrls: ['./cards-modalidade.component.css']
})
export class CardsModalidadeComponent implements OnInit {
    indiqueGanheHabilitado = false;
    promocoesHabilitado = false;
    isLoggedIn = false;
    isCliente = false;
    isMobile = false;
    modalRef: any;
    unsub$ = new Subject();

    constructor(
        private auth: AuthService,
        private paramsService: ParametrosLocaisService,
        private modalService: NgbModal,
        private router: Router,
        private clienteService: ClienteService,
    ) { }

    ngOnInit(): void {
        this.indiqueGanheHabilitado = this.paramsService.getOpcoes().indique_ganhe_habilitado;
        this.promocoesHabilitado = this.paramsService.getOpcoes().habilitar_pagina_promocao;

        this.clienteService.logado
            .pipe(takeUntil(this.unsub$))
            .subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);

        this.auth.cliente
            .pipe(takeUntil(this.unsub$))
            .subscribe(isCliente => this.isCliente = isCliente);
    }

    activeGameCassinoMobile() {
        return (
            this.isMobile
            && (this.router.url.includes('/casino') || this.router.url.includes('/live-casino'))
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

    redirectIndiqueGanhe() {
        if (!this.isLoggedIn) {
            this.abrirLogin();
        } else {
            if (this.isMobile) {
                this.modalService.open(IndiqueGanheComponent);
            } else {
                this.router.navigate(['clientes/indique-ganhe']);
            }
        }
    }
}
