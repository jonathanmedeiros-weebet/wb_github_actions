import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { ExibirBilheteEsportivoComponent } from '../../exibir-bilhete/esportes/exibir-bilhete-esportivo.component';
import { BilheteAcumuladaoComponent } from '../../exibir-bilhete/acumuladao/bilhete-acumuladao.component';
import { ExibirBilheteDesafioComponent } from '../../exibir-bilhete/desafio/exibir-bilhete-desafio.component';
import { ExibirBilheteLoteriaComponent } from '../../exibir-bilhete/loteria/exibir-bilhete-loteria.component';
import { ExibirBilheteRifaComponent} from '../../exibir-bilhete/rifa/exibir-bilhete-rifa/exibir-bilhete-rifa.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, AuthService, ParametrosLocaisService } from '../../../../services';
import { config } from '../../../config';
import { Ga4Service, EventGa4Types} from 'src/app/shared/services/ga4/ga4.service';

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
    @ViewChild(ExibirBilheteRifaComponent) bilheteRifaComponent: ExibirBilheteRifaComponent;
    @Input() aposta;
    @Input() showCancel = false;
    @Input() primeiraImpressao = false;
    @Input() isUltimaAposta = false;
    appMobile;
    casaDasApostasId;
    isLoggedIn;
    isCliente;
    isMobile = false;
    urlBilheteAoVivo ;
    slug ;
    origin;

    constructor(
        public activeModal: NgbActiveModal,
        private helperService: HelperService,
        private paramsLocais: ParametrosLocaisService,
        private auth: AuthService,
        private ga4Service: Ga4Service,
    ) { }

    ngOnInit() {
        this.isMobile = window.innerWidth <= 1024;
        this.appMobile = this.auth.isAppMobile();
        this.isLoggedIn = this.auth.isLoggedIn();
        this.casaDasApostasId = this.paramsLocais.getOpcoes().casa_das_apostas_id;
        this.isCliente = this.auth.isCliente();
        this.origin = this.appMobile ? '?origin=app':'';
        this.urlBilheteAoVivo = `https://${config.SLUG}/bilhete/${this.aposta.codigo}${this.origin}`;
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

        this.ga4Service.triggerGa4Event(EventGa4Types.SHARE);
    }

    cancel() {
        this.activeModal.close('cancel');
    }

    setPagamento() {
        this.activeModal.close('pagamento');
    }

    pagamentoPermitido() {
        return this.aposta.resultado && this.aposta.resultado === 'ganhou' && !this.aposta.pago && !this.aposta.cartao_aposta && !this.isCliente && this.isLoggedIn;
    }

    cancelamentoPermitido() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;

        if (this.showCancel && this.isLoggedIn && !this.isCliente) {
            if (opcoes.habilitar_cancelar_aposta) {
                result = true;
            } else if (opcoes.habilitar_cancelar_ultima_aposta && this.isUltimaAposta) {
                result = true;
            }
        }

        return result;
    }

    compartilhamentoPermitido() {
        const opcoes = this.paramsLocais.getOpcoes();

        return opcoes.habilitar_compartilhamento_comprovante;
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

            if (opcoes.permitir_reimprimir_ultima_aposta && this.isUltimaAposta) {
                result = true;
            }
        }

        return result;
    }
}
