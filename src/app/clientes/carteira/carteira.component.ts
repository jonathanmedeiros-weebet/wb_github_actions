import { Component, OnDestroy, OnInit, ChangeDetectorRef, ElementRef, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ClienteService } from '../../shared/services/clientes/cliente.service';
import { Cliente } from '../../shared/models/clientes/cliente';
import { MessageService } from '../../shared/services/utils/message.service';
import { FinanceiroService } from '../../shared/services/financeiro.service';
import { MenuFooterService } from '../../shared/services/utils/menu-footer.service';
import { ParametrosLocaisService } from '../../shared/services/parametros-locais.service';
import { AuthService, LayoutService, SidebarService } from 'src/app/services';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'carteira',
    templateUrl: './carteira.component.html',
    styleUrls: ['./carteira.component.css']
})
export class CarteiraComponent implements OnInit, AfterViewInit, OnDestroy {
    unsub$ = new Subject();
    cliente: Cliente;
    modalRef;
    currentLanguage = 'pt';
    token = '';
    balance = 0;
    bonusCasino = 0;
    bonusSport = 0;
    withdrawAvailable = 0;
    showLoading = true;
    isMobile = false;

    constructor(
        private fb: UntypedFormBuilder,
        private messageService: MessageService,
        private clienteService: ClienteService,
        private financeiroService: FinanceiroService,
        private menuFooterService: MenuFooterService,
        private paramsLocais: ParametrosLocaisService,
        private sidebarService: SidebarService,
        private modalService: NgbModal,
        private auth: AuthService,
        public activeModal: NgbActiveModal,
        private translate: TranslateService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private el: ElementRef,
        private layoutService: LayoutService,
    ) {
    }

    ngOnInit() {
        if (window.innerWidth <= 1024) {
            this.isMobile = true;
        } else {
            this.sidebarService.changeItens({ contexto: 'cliente' });
            this.menuFooterService.setIsPagina(true);
        }

        this.currentLanguage = this.translate.currentLang;

        const user = JSON.parse(localStorage.getItem('user'));

        this.auth.getPosicaoFinanceira()
            .subscribe(
                posicaoFinanceira => {
                    this.balance = posicaoFinanceira.saldo;
                    this.withdrawAvailable = this.balance - posicaoFinanceira.saldoBloqueado;
                    if(posicaoFinanceira.bonusModalidade === 'esportivo') {
                        this.bonusSport = posicaoFinanceira.bonus;
                    } else {
                        this.bonusCasino = posicaoFinanceira.bonus;
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

        if (!this.isMobile) {
            this.layoutService.currentHeaderHeight
                .pipe(takeUntil(this.unsub$))
                .subscribe(curHeaderHeight => {
                    this.cd.detectChanges();
                });
        }
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
        this.unsub$.next();
        this.unsub$.complete();
    }

    handleError(error: string) {
        this.messageService.error(error);
        this.showLoading = false;
    }
}
