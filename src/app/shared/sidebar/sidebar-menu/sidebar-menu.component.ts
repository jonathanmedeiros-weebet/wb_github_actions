import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {
    LoginModalComponent,
    PesquisarApostaModalComponent,
    PesquisarCartaoMobileModalComponent,
    SolicitarSaqueModalComponent,
    TabelaModalComponent
} from '../../layout/modals';
import {SidebarService} from '../../services/utils/sidebar.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ResultadosModalComponent} from '../../layout/modals/resultados-modal/resultados-modal.component';
import {config} from '../../config';
import {PrintService} from '../../services/utils/print.service';
import {ParametrosLocaisService} from '../../services/parametros-locais.service';
import {TranslateService} from '@ngx-translate/core';
import {TabelaComponent} from '../../../cambistas/tabela/tabela.component';
import { RegisterModalComponentComponent } from '../../layout/modals/register-modal/register-modal-component/register-modal-component.component';

@Component({
    selector: 'app-sidebar-menu',
    templateUrl: './sidebar-menu.component.html',
    styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {
    isLoggedIn;
    isCliente;
    isMobileScreen;
    isAppMobile;
    modalRef;
    trevoOne = false;
    appUrl = 'https://weebet.s3.amazonaws.com/' + config.SLUG + '/app/app.apk?v=' + (new Date()).getTime();
    cartaoApostaHabilitado;
    unsub$ = new Subject();
    whatsapp;
    modoCambista = false;
    hasApk;

    constructor(
        private auth: AuthService,
        private sidebarService: SidebarService,
        private modalService: NgbModal,
        private cd: ChangeDetectorRef,
        private printService: PrintService,
        private paramsService: ParametrosLocaisService,
        private translate: TranslateService
    ) {
    }

    ngOnInit() {
        this.isAppMobile = this.auth.isAppMobile();
        this.isMobileScreen = window.innerWidth < 1025;
        this.cartaoApostaHabilitado = this.paramsService.getOpcoes().cartao_aposta;
        this.modoCambista = this.paramsService.getOpcoes().modo_cambista;
        this.hasApk = this.paramsService.getOpcoes().has_aplicativo;

        if (location.host.search(/trevoone/) >= 0) {
            this.trevoOne = true;
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

        if (this.paramsService.getOpcoes().whatsapp) {
            this.whatsapp = this.paramsService.getOpcoes().whatsapp.replace(/\D/g, '');
        }
    }

    abrirModalTabela() {
        this.modalRef = this.modalService.open(TabelaComponent);
    }

    closeMenu() {
        this.sidebarService.close();
    }

    abrirLogin() {

        let options = {};

        if (this.isMobileScreen) {
            options = {
                windowClass: 'modal-fullscreen',
            };
        } else {
            options = {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350 modal-login',
                centered: true,
            };
        }

        this.modalRef = this.modalService.open(
            LoginModalComponent, options
        );
    }

    abrirCadastro() {
        this.modalRef = this.modalService.open(
            RegisterModalComponentComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                centered: true,
                windowClass: 'modal-cadastro-cliente'
            }
        );
    }

    pesquisarTicket() {
        this.modalRef = this.modalService.open(
            PesquisarApostaModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'md',
                centered: true,
                windowClass: 'modal-500'
            }
        );
    }

    pesquisarCartao() {
        this.modalRef = this.modalService.open(
            PesquisarCartaoMobileModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                centered: true,
            }
        );
    }

    abrirResultados() {
        this.modalService.open(ResultadosModalComponent, {
            centered: true,
            size: 'xl',
        });
    }

    listPrinters() {
        this.printService.listPrinters();
    }

    abrirSolicitacaoSaqueCartao() {
        this.modalService.open(SolicitarSaqueModalComponent);
    }
}
