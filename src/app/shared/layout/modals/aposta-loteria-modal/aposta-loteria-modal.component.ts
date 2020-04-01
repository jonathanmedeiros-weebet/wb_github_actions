import { ExibirBilheteLoteriaComponent } from './../../exibir-bilhete/loteria/exibir-bilhete-loteria.component';
import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, ParametrosLocaisService } from './../../../../services';

@Component({
    selector: 'app-aposta-loteria-modal',
    templateUrl: './aposta-loteria-modal.component.html'
})
export class ApostaLoteriaModalComponent implements OnInit {
    @ViewChild(ExibirBilheteLoteriaComponent, { static: false }) bilheteLoteriaComponent: ExibirBilheteLoteriaComponent;
    @Input() aposta;
    @Input() showCancel = false;
    appMobile;
    isLoggedIn;

    constructor(
        public activeModal: NgbActiveModal,
        private auth: AuthService,
        private paramsLocais: ParametrosLocaisService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.isLoggedIn = this.auth.isLoggedIn();
    }

    printTicket() {
        this.bilheteLoteriaComponent.print();
    }

    shareTicket() {
        this.bilheteLoteriaComponent.shared();
    }

    cancel() {
        this.activeModal.close('cancel');
    }

    cancelamentoPermitido() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;

        if (opcoes.habilitar_cancelar_aposta) {
            if (this.isLoggedIn && this.showCancel && !this.aposta.cartao_aposta) {
                result = true;
            }
        }

        return result;
    }

    compartilhamentoPermitido() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;

        if (this.appMobile && opcoes.habilitar_compartilhamento_comprovante) {
            result = true;
        }

        return result;
    }
}
