import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { ExibirBilheteEsportivoComponent } from '../../exibir-bilhete/esportes/exibir-bilhete-esportivo.component';
import { BilheteAcumuladaoComponent } from './../../exibir-bilhete/acumuladao/bilhete-acumuladao.component';
import { ExibirBilheteDesafioComponent } from './../../exibir-bilhete/desafio/exibir-bilhete-desafio.component';
import { ExibirBilheteLoteriaComponent } from './../../exibir-bilhete/loteria/exibir-bilhete-loteria.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, AuthService, ParametrosLocaisService } from '../../../../services';

@Component({
    selector: 'app-aposta-modal',
    templateUrl: './aposta-modal.component.html',
    styleUrls: ['./aposta-modal.component.css']
})
export class ApostaModalComponent implements OnInit {
    @ViewChild(ExibirBilheteEsportivoComponent) bilheteEsportivoComponent: ExibirBilheteEsportivoComponent;
    @ViewChild(ExibirBilheteLoteriaComponent) bilheteLoteriaComponent: ExibirBilheteLoteriaComponent;
    @ViewChild(ExibirBilheteDesafioComponent) bilheteDesafioComponent: ExibirBilheteDesafioComponent;
    @ViewChild(BilheteAcumuladaoComponent) bilheteAcumuladaoComponent: BilheteAcumuladaoComponent;
    @Input() aposta;
    @Input() showCancel = false;
    @Input() primeiraImpressao = false;
    @Input() ultimaAposta = false;
    appMobile;
    isLoggedIn;

    constructor(
        public activeModal: NgbActiveModal,
        private helperService: HelperService,
        private paramsLocais: ParametrosLocaisService,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.isLoggedIn = this.auth.isLoggedIn();
    }

    printTicket() {
        if (this.aposta.tipo === 'esportes') {
            this.bilheteEsportivoComponent.print();
        }
        if (this.aposta.tipo === 'loteria') {
            this.bilheteLoteriaComponent.print();
        }
        if (this.aposta.tipo === 'acumuladao') {
            this.bilheteAcumuladaoComponent.print();
        }
        if (this.aposta.tipo === 'desafio') {
            this.bilheteDesafioComponent.print();
        }
    }

    shareTicket() {
        if (this.aposta.tipo === 'esportes') {
            this.bilheteEsportivoComponent.shared();
        }
        if (this.aposta.tipo === 'loteria') {
            this.bilheteLoteriaComponent.shared();
        }
        if (this.aposta.tipo === 'acumuladao') {
            this.bilheteAcumuladaoComponent.shared();
        }
        if (this.aposta.tipo === 'desafio') {
            this.bilheteDesafioComponent.shared();
        }
    }

    cancel() {
        this.activeModal.close('cancel');
    }

    setPagamento() {
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
