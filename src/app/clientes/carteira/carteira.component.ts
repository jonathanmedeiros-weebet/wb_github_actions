import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Cliente } from '../../shared/models/clientes/cliente';
import { MessageService } from '../../shared/services/utils/message.service';
import { MenuFooterService } from '../../shared/services/utils/menu-footer.service';
import { AuthService, LayoutService, SidebarService } from 'src/app/services';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'carteira',
    templateUrl: './carteira.component.html',
    styleUrls: ['./carteira.component.css']
})
export class CarteiraComponent implements OnInit, OnDestroy {
    unsub$ = new Subject();
    cliente: Cliente;
    balance = 0;
    bonusCasino = 0;
    bonusSport = 0;
    withdrawAvailable = 0;
    withdrawBlocked = 0;
    showLoading = true;
    isMobile = false;

    constructor(
        private messageService: MessageService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
        private auth: AuthService,
        private cd: ChangeDetectorRef,
        private layoutService: LayoutService,
        public activeModal: NgbActiveModal
    ) {
    }

    ngOnInit() {
        if (window.innerWidth <= 1024) {
            this.isMobile = true;
        } else {
            this.sidebarService.changeItens({ contexto: 'cliente' });
            this.menuFooterService.setIsPagina(true);
        }

        this.auth.getPosicaoFinanceira()
            .subscribe(
                posicaoFinanceira => {
                    this.balance = posicaoFinanceira.saldo;
                    this.withdrawBlocked = posicaoFinanceira.saldoBloqueado;
                    this.withdrawAvailable = posicaoFinanceira.saldoLiberado;

                    if (posicaoFinanceira.bonusModalidade === 'esportivo') {
                        this.bonusSport = posicaoFinanceira.bonus;
                    } else {
                        this.bonusCasino = posicaoFinanceira.bonus;
                    }

                    this.showLoading = false;
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
