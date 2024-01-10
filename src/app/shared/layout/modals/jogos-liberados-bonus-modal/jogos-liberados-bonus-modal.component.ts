import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {ParametrosLocaisService} from './../../../services/parametros-locais.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FinanceiroService} from '../../../services/financeiro.service';
import {MessageService} from '../../../services/utils/message.service';
import {Promocao} from '../../../../models';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
import {AuthService} from "../../../services/auth/auth.service";
import {LoginModalComponent} from "../login-modal/login-modal.component";
import {Router} from "@angular/router";
import {RegrasBonusModalComponent} from "../regras-bonus-modal/regras-bonus-modal.component";


@Component({
  selector: 'app-regras-bonus-modal',
  templateUrl: './jogos-liberados-bonus-modal.component.html',
  styleUrls: ['./jogos-liberados-bonus-modal.component.css']
})
export class JogosLiberadosBonusModalComponent implements OnInit {
    scrolls: ElementRef[];
    gameList;
    isDemo = false;
    isLoggedIn;
    isCliente;
    blink: string;
    modalRef;
    qtdItens = 20;

	constructor(
		public activeModal: NgbActiveModal,
        private paramsLocais: ParametrosLocaisService,
        private financeiroService: FinanceiroService,
        private messageService: MessageService,
        private casinoApi: CasinoApiService,
        private auth: AuthService,
        private modalService: NgbModal,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.blink = this.router.url.split('/')[2];

        if (location.host === 'demo.wee.bet') {
            this.isDemo = true;
        }

        this.auth.logado
            .subscribe(
                isLoggedIn => {
                    this.isLoggedIn = isLoggedIn;
                }
            );

        this.auth.cliente
            .subscribe(
                isCliente => {
                    this.isCliente = isCliente;
                }
            );

        this.casinoApi.getJogosLiberadosBonus().subscribe(response => {
            this.gameList = response.gameList;
        }, erro => {});
    }

    abrirModalLogin() {
        this.modalRef = this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350 modal-login',
                centered: true,
            }
        );
    }

    exibirMais(){
        this.qtdItens += 3;
    }


    voltarModalRegras(){
        this.activeModal.close();
        this.modalService.open(RegrasBonusModalComponent, {
            centered: true,
            size: 'xl',
        });
    }
}
