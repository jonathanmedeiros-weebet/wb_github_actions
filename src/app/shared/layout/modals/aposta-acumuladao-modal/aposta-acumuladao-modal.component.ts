import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, ParametrosLocaisService } from './../../../../services';
import { BilheteAcumuladaoComponent } from './../../exibir-bilhete/acumuladao/bilhete-acumuladao.component';

@Component({
    selector: 'app-aposta-acumuladao-modal',
    templateUrl: './aposta-acumuladao-modal.component.html',
    styleUrls: ['./aposta-acumuladao-modal.component.css']
})
export class ApostaAcumuladaoModalComponent implements OnInit {
    @ViewChild(BilheteAcumuladaoComponent, { static: false }) bilheteComponent: BilheteAcumuladaoComponent;
    @Input() aposta;
    @Input() showCancel = false;
    @Input() primeiraImpressao = false;
    @Input() ultimaAposta = false;
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
        this.bilheteComponent.print();
    }

    shareTicket() {
        this.bilheteComponent.shared();
    }

    cancelar() {
        this.activeModal.close('cancel');
    }

    pagarAposta() {
        this.activeModal.close('pagamento');
    }

    pagamentoPermitido() {
        return this.aposta.resultado && this.aposta.resultado === 'ganhou' && !this.aposta.pago && !this.aposta.cartao_aposta;
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

    impressaoPermitida() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;

        if (this.primeiraImpressao) {
            result = true;
        } else {
            if (opcoes.permitir_reimprimir_aposta) {
                result = true;
            }

            if (opcoes.permitir_reimprimir_ultima_aposta && this.ultimaAposta) {
                result = true;
            }
        }

        return result;
    }
}
