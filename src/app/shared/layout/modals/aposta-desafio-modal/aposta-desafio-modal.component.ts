import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { ExibirBilheteDesafioComponent } from './../../exibir-bilhete/desafio/exibir-bilhete-desafio.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, AuthService, ParametrosLocaisService } from '../../../../services';

@Component({
    selector: 'app-aposta-desafio-modal',
    templateUrl: './aposta-desafio-modal.component.html',
    styleUrls: ['./aposta-desafio-modal.component.css']
})
export class ApostaDesafioModalComponent implements OnInit {
    @ViewChild(ExibirBilheteDesafioComponent, { static: false }) bilheteDesafioComponent: ExibirBilheteDesafioComponent;
    @Input() aposta;
    @Input() showCancel = false;
    @Input() primeiraImpressao = false;
    @Input() ultimaAposta = false;
    appMobile;
    isLoggedIn;

    constructor(
        public activeModal: NgbActiveModal,
        private paramsLocais: ParametrosLocaisService,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.isLoggedIn = this.auth.isLoggedIn();
    }

    printTicket() {
        this.bilheteDesafioComponent.print();
    }

    shareTicket() {
        this.bilheteDesafioComponent.shared();
    }

    cancel() {
        this.activeModal.close('cancel');
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

        if (opcoes.habilitar_compartilhamento_comprovante) {
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
