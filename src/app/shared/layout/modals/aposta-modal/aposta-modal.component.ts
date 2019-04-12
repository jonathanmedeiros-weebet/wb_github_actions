import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { ExibirBilheteEsportivoComponent } from '../../exibir-bilhete/esportes/exibir-bilhete-esportivo.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, AuthService } from '../../../../services';

@Component({
    selector: 'app-aposta-modal',
    templateUrl: './aposta-modal.component.html',
    styleUrls: ['./aposta-modal.component.css']
})
export class ApostaModalComponent implements OnInit {
    @ViewChild(ExibirBilheteEsportivoComponent) bilheteEsportivoComponent: ExibirBilheteEsportivoComponent;
    @Input() aposta;
    @Input() showCancel = false;
    appMobile;
    isLoggedIn;

    constructor(
        public activeModal: NgbActiveModal,
        private helperService: HelperService,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.isLoggedIn = this.auth.isLoggedIn();
    }

    printTicket() {
        this.bilheteEsportivoComponent.print();
    }

    shareTicket() {
        if (this.aposta.tipo === 'esportes') {
            this.bilheteEsportivoComponent.shared();
        } else {
            this.helperService.sharedLotteryTicket(this.aposta);
        }
    }

    cancel() {
        this.activeModal.close('cancel');
    }

    setPagamento() {
        this.activeModal.close('pagamento');
    }

    pagamentoPermitido() {
        return this.aposta.resultado && this.aposta.resultado === 'ganhou' && !this.aposta.pago;
    }
}
