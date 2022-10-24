import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {CadastroModalComponent, LoginModalComponent, PesquisarApostaModalComponent, TabelaModalComponent} from '../../layout/modals';
import {SidebarService} from '../../services/utils/sidebar.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-sidebar-menu',
    templateUrl: './sidebar-menu.component.html',
    styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {
    isLoggedIn;
    isCliente;
    isAppMobile;
    modalRef;
    unsub$ = new Subject();

    constructor(
        private auth: AuthService,
        private sidebarService: SidebarService,
        private modalService: NgbModal,
        private cd: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        if (window.innerWidth > 1025) {
            this.isAppMobile = false;
        } else {
            this.isAppMobile = true;
        }

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
            }, reason => {
            });
    }

    closeMenu() {
        this.sidebarService.close();
    }

    abrirLogin() {

        let options = {};

        if (this.isAppMobile) {
            options = {
                windowClass: 'modal-fullscreen',
            }
        } else {
            options = {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-600',
                centered: true,
            }
        }

        this.modalRef = this.modalService.open(
            LoginModalComponent, options
        );
    }

    abrirCadastro() {
        this.modalRef = this.modalService.open(
            CadastroModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                centered: true,
            }
        );
    }

    pesqisarTicket() {
        this.modalRef = this.modalService.open(
            PesquisarApostaModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                centered: true,
            }
        );
    }
}
